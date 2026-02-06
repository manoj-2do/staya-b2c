/**
 * Route → screen mapping. Used by App and catch-all page.
 */

import type { ComponentType } from "react";
import { HomeLandingScene } from "@/features/home";
import { routeDefinitions } from "./route-definitions";

export type RouteScreen = ComponentType;

const pathToScreen: Record<string, RouteScreen> = {
  "/": HomeLandingScene,
  "/home": HomeLandingScene,
  "/hotels": HomeLandingScene,
  "/hotels/search": HomeLandingScene,
  "/flights/search": HomeLandingScene,
  "/packages/search": HomeLandingScene,
};

export function getScreenForPath(path: string): RouteScreen | null {
  return pathToScreen[path] ?? null;
}

export function getDefinedPaths(): string[] {
  return routeDefinitions.map((r) => r.path);
}
