# lib

Shared code used across the app. No `frontend/` or `backend/` — server-only code lives under `lib/api/` and `lib/auth/` (TravClan, request manager, server actions); client-safe code in `lib/auth/` (authToken, fetchWithAuth), `lib/config/`, `lib/store/`, etc.

- **api/** — TravClan API: apiPaths, requestManager, hotels/*, locations/*
- **auth/** — TravClan auth (server), login/refresh actions (server), authToken & fetchWithAuth (client)
- **env.ts** — Environment config (server-safe; TravClan keys server-only)
- **types/** — Shared DTOs (e.g. locationSearch). Features can re-export from their models.
- **utils/** — apiResponse (API routes), cn (classnames)
- **config/**, **paths.ts**, **route-definitions.ts**, **content.ts**, **assets.ts**, **app.config.ts**, **store/**, **App.tsx**, **routes.tsx**
