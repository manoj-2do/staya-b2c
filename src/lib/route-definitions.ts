/**
 * Route definitions: path + middleware options only (no React).
 */

export interface RouteMiddleware {
  authRequired?: boolean;
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
