/**
 * Route → screen mapping. Which route renders which screen.
 * Used by App.tsx and the catch-all page. Middleware uses route-definitions.ts.
 */

import type { ComponentType } from "react";
import { HomeLandingScene } from "@/frontend/features/home";
import { routeDefinitions } from "./route-definitions";

export type RouteScreen = ComponentType;

const pathToScreen: Record<string, RouteScreen> = {
  "/": HomeLandingScene,
  "/home": HomeLandingScene,
};

/** Get the screen component for a path, or null if not found */
export function getScreenForPath(path: string): RouteScreen | null {
  return pathToScreen[path] ?? null;
}

/** All defined route paths (for 404 check) */
export function getDefinedPaths(): string[] {
  return routeDefinitions.map((r) => r.path);
}
