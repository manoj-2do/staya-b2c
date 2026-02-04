# Backend (server-side only)

- **Auth / App token**: TravClan auth is called here only. `getAppToken()` in `auth/travclanAuth.ts` is used by the API route `POST /api/auth/login`.
- Do **not** import from this folder in client/frontend code. Use the internal API route from the frontend instead.
