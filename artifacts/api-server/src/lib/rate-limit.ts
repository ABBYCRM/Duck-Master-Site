import { pool } from '@workspace/db';
import { ipKeyGenerator } from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

// Key by authenticated userId, fall back to the library's IPv6-safe IP helper.
// ipKeyGenerator(ip) normalises IPv6-mapped IPv4 addresses so users can't
// bypass limits by switching between address forms (e.g. ::ffff:1.2.3.4).
function userOrIpKey(req: Request): string {
  if (req.isAuthenticated?.() && req.user?.id) {
    return `u:${req.user.id}`;
  }
  return `ip:${ipKeyGenerator(req.ip ?? '')}`;
}

function ipKey(req: Request): string {
  return `ip:${ipKeyGenerator(req.ip ?? '')}`;
}

interface LimiterOptions {
  /** Limiter name — becomes the prefix of the DB key, e.g. "global" */
  name: string;
  /** Window size in milliseconds */
  windowMs: number;
  /** Maximum requests allowed per window */
  max: number;
  /** Derives the per-client key from the request (default: IP) */
  keyGenerator?: (req: Request) => string;
}

/**
 * Creates an Express middleware that enforces a rate limit backed by
 * PostgreSQL. One row per (limiter name + client key) is upserted atomically
 * so the counter survives server restarts and works across multiple processes.
 *
 * Sets RFC-draft-8 RateLimit-* headers on every response.
 */
function createDbRateLimiter(opts: LimiterOptions) {
  const { name, windowMs, max, keyGenerator = ipKey } = opts;

  return async function dbRateLimiter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const clientKey = keyGenerator(req);
    const compositeKey = `${name}:${clientKey}`;
    const windowSec = windowMs / 1000;

    let count: number;
    let expiresAt: Date;

    try {
      // Atomic upsert:
      //   • On first hit (or after window expired): insert count=1, new window.
      //   • On subsequent hits within the window: increment count in-place.
      // The CASE expressions handle an expired row without a separate DELETE.
      const result = await pool.query<{ count: number; expires_at: Date }>(
        `INSERT INTO rate_limits (key, count, window_start, expires_at)
         VALUES ($1, 1, NOW(), NOW() + ($2 || ' seconds')::interval)
         ON CONFLICT (key) DO UPDATE SET
           count = CASE
             WHEN rate_limits.expires_at < NOW() THEN 1
             ELSE rate_limits.count + 1
           END,
           window_start = CASE
             WHEN rate_limits.expires_at < NOW() THEN NOW()
             ELSE rate_limits.window_start
           END,
           expires_at = CASE
             WHEN rate_limits.expires_at < NOW()
               THEN NOW() + ($2 || ' seconds')::interval
             ELSE rate_limits.expires_at
           END
         RETURNING count, expires_at`,
        [compositeKey, windowSec],
      );

      count = result.rows[0].count;
      expiresAt = result.rows[0].expires_at;
    } catch (err) {
      // On DB failure, fail open (don't block legitimate traffic) but log it.
      logger.error({ err, limiter: name }, 'Rate-limit DB query failed — failing open');
      next();
      return;
    }

    const remaining = Math.max(0, max - count);
    const resetSec = Math.ceil(expiresAt.getTime() / 1000);

    // RFC draft-8 RateLimit-* headers
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetSec);
    res.setHeader('RateLimit-Policy', `${max};w=${windowSec}`);

    if (count > max) {
      res.setHeader('Retry-After', Math.ceil((expiresAt.getTime() - Date.now()) / 1000));
      res.status(429).json({
        error: 'Too many requests — please slow down.',
        retryAfterSeconds: Math.ceil((expiresAt.getTime() - Date.now()) / 1000),
        limit: max,
      });
      return;
    }

    next();
  };
}

// ── Tier 1: global catch-all ─────────────────────────────────────────────
// 300 req / 15 min / IP — protects every route by default.
export const globalLimiter = createDbRateLimiter({
  name: 'global',
  windowMs: 15 * 60 * 1000,
  max: 300,
});

// ── Tier 2: auth endpoints ────────────────────────────────────────────────
// 15 req / 15 min / IP — prevents login enumeration and OIDC callback spam.
export const authLimiter = createDbRateLimiter({
  name: 'auth',
  windowMs: 15 * 60 * 1000,
  max: 15,
});

// ── Tier 3: AI search ────────────────────────────────────────────────────
// 30 req / min / user — controls NVIDIA NIM API cost + prevents scraping.
export const searchLimiter = createDbRateLimiter({
  name: 'search',
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: userOrIpKey,
});

// ── Tier 4: workspace mutations ──────────────────────────────────────────
// 60 req / min / user — reasonable ceiling for save/unsave operations.
export const workspaceMutationLimiter = createDbRateLimiter({
  name: 'workspace',
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: userOrIpKey,
});
