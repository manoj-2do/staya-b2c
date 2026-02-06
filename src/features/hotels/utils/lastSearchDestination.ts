/**
 * Last searched hotel/destination — stored in localStorage for prefilling.
 */

import type { LocationSearchResult } from "@/features/home/models/LocationSearch";

const STORAGE_KEY = "staya:lastSearchedDestination";

export interface LastSearchedDestination {
  where: string;
  location?: {
    id: number | null;
    fullName: string;
    type: string;
    country: string;
    referenceId: string | null;
  };
}

export function saveLastSearchedDestination(
  where: string,
  location?: LocationSearchResult | null
): void {
  if (typeof window === "undefined") return;
  try {
    const data: LastSearchedDestination = {
      where,
      ...(location && {
        location: {
          id: location.id,
          fullName: location.fullName,
          type: location.type,
          country: location.country,
          referenceId: location.referenceId,
        },
      }),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getLastSearchedDestination(): LastSearchedDestination | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastSearchedDestination;
  } catch {
    return null;
  }
}
