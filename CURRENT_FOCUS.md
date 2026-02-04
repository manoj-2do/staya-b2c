# Current Focus — Homescreen & API Integration

## Structure (backend vs frontend)
- **`src/backend/`** — Server-side only. **App token (auth) call** happens here: `getAppToken()` in `auth/travclanAuth.ts`. Server action `loginAction` calls it; frontend auth service invokes the action. No `app/api` folder.
- **`src/frontend/`** — Client-side code: `core/` (content, assets, utils, config, paths), `features/` (auth, home), `components/` (UI). **AuthProvider** wraps every route in root layout. Auth feature calls backend `loginAction`, stores tokens in `localStorage`; **all other API calls** are made from the client using the token.

## App Router: paths & middleware
- **`src/frontend/core/paths.ts`** — Route path constants; use in middleware and links.
- **`src/middleware.ts`** — Runs on every request; use for auth redirects, headers. Imports `paths` from core. AuthProvider in layout handles client-side auth context.

## Done
- Env: TravClan in `src/frontend/core/config/env.ts` and `.env.example`.
- Backend auth: TravClan app token in `src/backend/auth/travclanAuth.ts`; `loginAction` (server action) uses it.
- Frontend auth: `src/frontend/features/auth/` — types, `authService`, `useAuthLogin`, **AuthProvider** / **useAuth**; token stored in client.
- **lib → core**: Renamed and moved to `src/frontend/core/` (content, assets, utils, config, components).

## Next
- Wire login into UI (e.g. header or sign-in flow).
- Client-side TravClan API calls (hotel/search, etc.) using stored token.
