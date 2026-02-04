# Frontend (client-side code)

- **core/** — Core shared code (formerly `lib`): content, assets, utils, config (env), components (e.g. NetworkStatusBar), paths (route constants).
- **features/** — Feature-first modules (auth, home, etc.). Auth feature uses server action for login and stores tokens in `localStorage`; **AuthProvider** wraps the app in root layout; use **useAuth** in components. Other API calls use the token on the client.
- **components/** — Shared UI (e.g. shadcn components under `ui/`).
