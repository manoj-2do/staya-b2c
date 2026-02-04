/**
 * App route paths. Use these instead of hardcoding path strings.
 * Keep in sync with route-definitions.ts and routes.tsx.
 */

export const paths = {
  home: "/",
  homePage: "/home",
  // Add more as routes are added, e.g.:
  // hotels: "/hotels",
  // flights: "/flights",
  // auth: { login: "/login", signUp: "/signup" },
} as const;

export type PathKey = keyof typeof paths;
