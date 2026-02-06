"use server";

/**
 * Server action: location search for the hero "Where" field.
 * Calls TravClan Locations Search API; credentials stay server-side.
 */

import { getLocationsSearch } from "./getLocationsSearch";
import type { LocationSearchResult } from "@/frontend/features/home/models/LocationSearch";

export type LocationsSearchActionResult =
  | { ok: true; results: LocationSearchResult[]; newAccessToken?: string }
  | { ok: false; error: string; results: []; newAccessToken?: string };

export async function locationsSearchAction(
  searchString: string,
  accessToken?: string | null
): Promise<LocationsSearchActionResult> {
  const trimmed = (searchString ?? "").trim();
  if (!trimmed) {
    return { ok: true, results: [] };
  }

  const result = await getLocationsSearch(trimmed, accessToken);
  if (result.ok) {
    return {
      ok: true,
      results: result.data.results ?? [],
      ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
    };
  }
  return {
    ok: false,
    error: result.error,
    results: [],
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
