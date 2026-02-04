/**
 * Route definitions: path + middleware options only (no React).
 * Safe to import from Edge middleware. Add path → screen mapping in routes.tsx.
 */

export interface RouteMiddleware {
  /** Require auth; redirect to loginPath if not authenticated */
  authRequired?: boolean;
  /** Redirect to this path when condition fails (e.g. when already logged in) */
  redirectTo?: string;
}

export interface RouteDefinition {
  path: string;
  middleware?: RouteMiddleware;
}

export const routeDefinitions: RouteDefinition[] = [
  { path: "/", middleware: {} },
  { path: "/home", middleware: {} },
  // Add more routes and middleware as needed, e.g.:
  // { path: "/account", middleware: { authRequired: true } },
  // { path: "/login", middleware: { redirectTo: "/" } },
];

/** Paths that require auth (for middleware) */
export function getProtectedPaths(): string[] {
  return routeDefinitions
    .filter((r) => r.middleware?.authRequired)
    .map((r) => r.path);
}

export function getRouteDefinition(
  pathname: string
): RouteDefinition | undefined {
  return routeDefinitions.find((r) => r.path === pathname);
}
