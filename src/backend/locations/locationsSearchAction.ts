"use server";

/**
 * Server action: location search for the hero "Where" field.
 * Calls TravClan Locations Search API; credentials stay server-side.
 */

import { getLocationsSearch } from "./getLocationsSearch";
import type { LocationSearchResult } from "@/frontend/features/home/models/LocationSearch";

export type LocationsSearchActionResult =
  | { ok: true; results: LocationSearchResult[] }
  | { ok: false; error: string; results: [] };

export async function locationsSearchAction(
  searchString: string
): Promise<LocationsSearchActionResult> {
  const trimmed = (searchString ?? "").trim();
  if (!trimmed) {
    return { ok: true, results: [] };
  }

  const result = await getLocationsSearch(trimmed);
  if (result.ok) {
    return {
      ok: true,
      results: result.data.results ?? [],
    };
  }
  return {
    ok: false,
    error: result.error,
    results: [],
  };
}
