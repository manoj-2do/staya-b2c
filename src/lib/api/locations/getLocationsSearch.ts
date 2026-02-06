/**
 * Server-side only. Location search: GET TravClan Locations Search API.
 */

import { env } from "@/lib/env";
import { request } from "@/lib/api/requestManager";
import { travclanPaths } from "@/lib/api/apiPaths";
import type {
  LocationSearchResponse,
  LocationSearchResult,
} from "@/lib/types/locationSearch";

export type GetLocationsSearchResult =
  | { ok: true; data: LocationSearchResponse; newAccessToken?: string }
  | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

function buildSearchUrl(
  base: string,
  path: string,
  searchString: string
): string {
  const trimmed = searchString.trim();
  if (!trimmed) return `${base}/${path}`;
  const encoded = encodeURIComponent(trimmed);
  return `${base}/${path}?searchString=${encoded}`;
}

export async function getLocationsSearch(
  searchString: string,
  accessToken?: string | null
): Promise<GetLocationsSearchResult> {
  const base = (env.travclan.apiBaseUrl ?? "").replace(/\/$/, "");
  const path = travclanPaths.locationsSearch;
  const url = buildSearchUrl(base, path, searchString);

  const result = await request<
    LocationSearchResponse & { data?: LocationSearchResult[] }
  >({
    method: "GET",
    url,
    accessToken,
  });

  if (result.status >= 200 && result.status < 300 && result.data) {
    const parsed = result.data;
    const list = Array.isArray(parsed.results)
      ? parsed.results
      : Array.isArray(parsed.data)
        ? parsed.data
        : [];
    return {
      ok: true,
      data: { ...parsed, results: list as LocationSearchResult[] },
      ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
    };
  }

  return {
    ok: false,
    status: result.status,
    error:
      result.status === 401
        ? "Authentication required. Please try again."
        : "Locations search failed",
    details: result.errorBody,
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
