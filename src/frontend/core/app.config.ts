/**
 * App-level config: name, initial route, etc.
 * Used by layout (metadata), middleware (redirects), and routes.
 */

export const appConfig = {
  /** App display name */
  appName: "Staya",

  /**
   * Initial route when user hits "/".
   * Use "/" to show home at root, or "/home" to redirect "/" → "/home".
   */
  initialRoute: "/" as "/" | "/home",

  /** Path to redirect to when auth is required but user is not authenticated */
  loginPath: "/login",
} as const;

export type AppConfig = typeof appConfig;
