import rateLimit, { ipKeyGenerator, type Options } from "express-rate-limit";
import type { Request } from "express";

// Key by authenticated userId, fall back to the library's IPv6-safe IP helper.
// Using ipKeyGenerator (not req.ip directly) ensures IPv6 addresses are
// normalised so users cannot bypass limits by switching between address forms.
function userOrIpKey(req: Request): string {
  if (req.isAuthenticated?.() && req.user?.id) {
    return `u:${req.user.id}`;
  }
  return `ip:${ipKeyGenerator(req)}`;
}

function makeMessage(windowMs: number, max: number) {
  return {
    error: "Too many requests — please slow down.",
    retryAfterSeconds: Math.ceil(windowMs / 1000),
    limit: max,
  };
}

const BASE: Partial<Options> = {
  standardHeaders: "draft-8", // RateLimit-* headers (RFC 6585 successor)
  legacyHeaders: false,       // no X-RateLimit-* (deprecated)
  skipSuccessfulRequests: false,
};

// ── Tier 1: global catch-all ─────────────────────────────────────────────
// 300 req / 15 min / IP — protects every route by default.
export const globalLimiter = rateLimit({
  ...BASE,
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: makeMessage(15 * 60 * 1000, 300),
});

// ── Tier 2: auth endpoints ────────────────────────────────────────────────
// 15 req / 15 min / IP — prevents login enumeration and OIDC callback spam.
export const authLimiter = rateLimit({
  ...BASE,
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: makeMessage(15 * 60 * 1000, 15),
});

// ── Tier 3: AI search ────────────────────────────────────────────────────
// 30 req / min / user — controls NVIDIA NIM API cost + prevents scraping.
export const searchLimiter = rateLimit({
  ...BASE,
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: userOrIpKey,
  message: makeMessage(60 * 1000, 30),
});

// ── Tier 4: workspace mutations ──────────────────────────────────────────
// 60 req / min / user — reasonable ceiling for save/unsave operations.
export const workspaceMutationLimiter = rateLimit({
  ...BASE,
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: userOrIpKey,
  message: makeMessage(60 * 1000, 60),
});
