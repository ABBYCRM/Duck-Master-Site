---
name: Duck Master auth + multi-tenancy
description: How authentication and tenant isolation are implemented in Duck Master.
---

## Architecture

- Auth: Replit Auth (OIDC/PKCE) via `openid-client` v6 on the Express API server.
- Sessions: stored in PostgreSQL `sessions` table (lib/db/src/schema/auth.ts). Cookie: `sid` (httpOnly, secure, sameSite: lax).
- User upsert on every login into `users` table.
- Frontend: `@workspace/replit-auth-web` → `useAuth()` hook; login/logout are full-page redirects to `/api/login` and `/api/logout`.

## Tenant isolation

- `savedToolsTable` and `searchHistoryTable` have a `userId` FK with `onDelete: cascade`.
- Every workspace route gates with `req.isAuthenticated()` then queries with `WHERE userId = req.user.id`.
- The DELETE route additionally scopes by userId so users cannot delete other users' rows even with a valid row ID.

**Why:** structural DB-level isolation — no filtering bug can ever expose cross-user data.

## Key files

- lib/db/src/schema/auth.ts — sessions + users tables (mandatory, do not drop)
- lib/db/src/schema/workspace.ts — savedTools + searchHistory tables
- artifacts/api-server/src/lib/auth.ts — session CRUD + OIDC config
- artifacts/api-server/src/middlewares/authMiddleware.ts — loads user on every request
- artifacts/api-server/src/routes/auth.ts — /login /callback /logout /mobile-auth/*
- artifacts/api-server/src/routes/workspace.ts — /workspace/saved + /workspace/history
- lib/replit-auth-web/ — useAuth() hook for duck-master frontend
