"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { paths } from "@/frontend/core/paths";

export type SearchViewType = "home" | "hotels" | "flights" | "packages";

const PATH_TO_VIEW: Record<string, SearchViewType> = {
  [paths.home]: "home",
  [paths.homePage]: "home",
  [paths.hotelsSearch]: "hotels",
  [paths.flightsSearch]: "flights",
  [paths.packagesSearch]: "packages",
};

/**
 * Returns current search view based on pathname.
 * Updates when path changes via router or history.pushState.
 */
export function useSearchPath(): SearchViewType {
  const pathname = usePathname();
  const [view, setView] = useState<SearchViewType>("home");

  useEffect(() => {
    setView(
      PATH_TO_VIEW[pathname] ??
        PATH_TO_VIEW[window.location?.pathname ?? ""] ??
        "home"
    );
  }, [pathname]);

  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;
      setView(PATH_TO_VIEW[path] ?? "home");
    };
    window.addEventListener("popstate", handlePathChange);
    window.addEventListener("staya:path-changed", handlePathChange);
    return () => {
      window.removeEventListener("popstate", handlePathChange);
      window.removeEventListener("staya:path-changed", handlePathChange);
    };
  }, []);

  return view;
}

/** Update browser path without full navigation (uses history.pushState) */
export function updateSearchPath(path: string): void {
  if (typeof window === "undefined") return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new CustomEvent("staya:path-changed"));
}
