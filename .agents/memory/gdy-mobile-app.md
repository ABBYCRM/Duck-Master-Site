---
name: GDY Mobile app
description: Architecture and key decisions for the GDY companion Expo mobile app (artifacts/gdy-mobile).
---

## Architecture

- Expo SDK 54, New Architecture enabled, React Native 0.81.5
- 4 tabs: Browse (module grid), Search (offline keyword filter), Saved (API-synced), Profile (auth)
- Stack screen: `app/module/[id].tsx` — module detail with all tools and save/unsave

## Auth

- Mobile PKCE via `expo-auth-session@~7.0.11` + `expo-crypto@~15.0.9` (SDK 54 compatible versions)
- Issuer: `https://replit.com/oidc`, clientId: `EXPO_PUBLIC_REPL_ID`
- Code exchange via POST `/api/mobile-auth/token-exchange` → returns `{ token: sid }`
- Token stored in AsyncStorage (`@gdy/auth_token`), sent as `Authorization: Bearer <sid>`
- Module-level `getStoredAuthToken()` in `contexts/AuthContext.tsx` wired to `setAuthTokenGetter` at app startup

**Why:** The API server's `getSessionId()` reads `Authorization: Bearer` header first, so Bearer token works without cookies.

## API client

- `setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`)` called at module level in `app/_layout.tsx`
- `setAuthTokenGetter(() => getStoredAuthToken())` wires auth to all generated hooks automatically
- Generated hooks used: `useGetCurrentAuthUser`, `useGetSavedTools`, `useGetSearchHistory`, `useSaveTool`, `useRemoveSavedTool`, `useExchangeMobileAuthorizationCode`, `useLogoutMobileSession`

## Design

- Dark navy theme: background `#0d1117`, card `#161c2d`, primary `#6366f1` (indigo), accent `#8b5cf6` (violet)
- Both `light` and `dark` keys in `constants/colors.ts` use the same navy palette (app is dark-first)
- 25 CATEGORY_COLORS array in `constants/colors.ts` maps each module to a distinct hue
- Duck mascot + GDY logo in `assets/images/` (copied from duck-master/public)

## Key files

- `contexts/AuthContext.tsx` — PKCE auth, token management, `getStoredAuthToken()` module export
- `constants/tools.ts` — mirrored CATEGORIES + `getAllTools()`, `filterTools()` helpers
- `constants/colors.ts` — dark navy palette + CATEGORY_COLORS array

## Package versions that matter

- `expo-auth-session@~7.0.11` — SDK 54 compatible (not v57 which is SDK 53)
- `expo-crypto@~15.0.9` — SDK 54 compatible (not v57)
