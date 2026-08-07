---
name: Duck Master API security controls
description: Security hardening applied to the api-server; what exists and why.
---

## Controls in place

### Helmet (src/app.ts)
- Sets X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, Referrer-Policy: no-referrer, X-DNS-Prefetch-Control: off, X-Download-Options: noopen, HSTS 1yr + preload, removes X-Powered-By.
- CSP disabled (API-only server; no HTML served).

### Trust proxy
- `app.set('trust proxy', 1)` — trusts exactly one hop so req.ip resolves to real client IP via X-Forwarded-For, without blindly accepting spoofed multi-hop headers.

### CORS (allowlist, not reflect-all)
- Previous config: `origin: true` (reflects any origin).
- New config: regex allowlist for *.replit.dev, *.repl.co, *.replit.app, localhost:*.
- Blocked origins are logged as warnings (origin field, no body logged).

### Body size limits
- `express.json({ limit: '16kb' })` and `express.urlencoded({ limit: '16kb' })`.

### Rate limiters (src/lib/rate-limit.ts)
Four tiers, all using `ipKeyGenerator` (IPv6-safe) for IP-based keys:
- **globalLimiter**: 300 req / 15 min / IP — covers every route.
- **authLimiter**: 15 req / 15 min / IP — on /login, /callback, /mobile-auth/token-exchange.
- **searchLimiter**: 30 req / min / user (or IP) — controls NVIDIA API cost.
- **workspaceMutationLimiter**: 60 req / min / user — on POST/DELETE /workspace/saved.
All return standardised { error, retryAfterSeconds, limit } with RateLimit-* headers (RFC 6585).

### Cache-Control
- `Cache-Control: no-store` + `Pragma: no-cache` set on every API response.

### Input sanitization (src/lib/sanitize.ts)
- `sanitizeString()`: strips null bytes, control chars, HTML tags; enforces max length.
- `redactSecrets()`: masks nvapi-*, Bearer token patterns from strings before logging.
- Applied to all user-supplied string fields in workspace and search routes.
- URL validation: toolUrl must parse as a valid http/https URL (rejects javascript:, data:, etc.).

### Log hygiene
- Query strings stripped from logged URLs (may contain OIDC auth codes).
- `Authorization` header value never logged (only `hasAuth: bool` field).
- `redactSecrets()` applied to all NVIDIA error messages before logging.

### Global error handler
- 4-parameter Express error handler at bottom of app.ts.
- In production: returns generic "An unexpected error occurred" — no stack traces.
- In development: includes stack for debugging.

### Drizzle ORM
- All DB queries use parameterised statements — no raw SQL, no injection surface.

## Outstanding gaps (future work)
- Session cleanup job: expired rows accumulate in `sessions` table; needs a periodic purge.
- Dependency audit / SAST scan not yet run.
- No formal threat model document.

**Why these controls:** SOC2 Type II readiness — rate limiting (availability), input validation (integrity), secret redaction (confidentiality), security headers (XSS/clickjacking defence), CORS allowlist (prevents CSRF from unrelated origins).
