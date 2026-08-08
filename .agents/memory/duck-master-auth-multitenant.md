---
name: Duck Master auth + multi-tenancy
description: Replit Auth OIDC/PKCE setup, session handling, and all-user data scoping patterns
---

## Auth stack
- Replit Auth (OpenID Connect + PKCE) via `openid-client`
- Sessions stored in PostgreSQL (`sessions` table) with cookie referencing `sid`
- `authMiddleware.ts` reads the cookie, loads the session, refreshes the token if expired, attaches `req.user`

## Key rules
- All user data scoped by `userId` at the DB layer (Drizzle `eq(table.userId, req.user.id)` on every query)
- `SESSION_COOKIE` and `SESSION_TTL` constants live in `lib/auth.ts`
- `getSessionId(req)` reads the cookie; `clearSession(res, sid)` deletes + clears it

## Error handling (post-audit hardening)
- `authMiddleware`: outer try/catch forwards all unexpected errors to `next(err)`
- `refreshIfExpired`: token refresh failures are logged as WARN and return null (treated as unauthenticated)
- `/login`, `/logout`, `/callback` (post-token-exchange), `/mobile-auth/logout`: all wrapped in try/catch
  - `/login` failure → 500 "Authentication unavailable"
  - `/callback` DB failure → redirect `/api/login`
  - `/logout` OIDC failure → best-effort cookie clear + redirect home
  - `/mobile-auth/logout` DB failure → still returns `{ success: true }` (client should treat itself as logged out)

**Why:** DB or OIDC provider failures in async route handlers that lack try/catch become unhandled promise rejections, which in older Node/Express versions hang the request or crash the process.

## workspace.ts
All 4 DB routes (GET/POST /workspace/saved, DELETE /workspace/saved/:id, GET /workspace/history) are wrapped in try/catch returning 500 JSON. Previously bare awaits could crash the process on DB failure.

## Auth gate pattern
- Directory (App.tsx `ToolCard`): intercept click, store `sessionStorage('gdy_pending_tool')`, open LoginModal
- Module pages (ModulePage.tsx): same pattern — `onClick` calls `handleToolClick`, stores pending URL, opens LoginModal
- `unsaveTool` now checks `res.ok` and throws on failure so the UI does not remove the bookmark silently
- Post-auth redirect: `useEffect` in App.tsx reads `gdy_pending_tool` from sessionStorage and calls `window.location.assign()`; `closeLogin` clears the key on dismiss
