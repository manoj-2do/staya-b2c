/**
 * App-level config: name, initial route, etc.
 */

export const appConfig = {
  appName: "Staya",
  initialRoute: "/" as "/" | "/home",
  loginPath: "/login",
} as const;

export type AppConfig = typeof appConfig;
