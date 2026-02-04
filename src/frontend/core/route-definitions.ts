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
  { path: "/hotels", middleware: {} },
  { path: "/hotels/search", middleware: {} },
  { path: "/flights/search", middleware: {} },
  { path: "/packages/search", middleware: {} },
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
