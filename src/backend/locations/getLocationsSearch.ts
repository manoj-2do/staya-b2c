/**
 * Backend — server-side only.
 * Location search: builds URL and calls network manager (Auth Interceptor handles token + 401 refresh/retry).
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";
import type {
  LocationSearchResponse,
  LocationSearchResult,
} from "@/frontend/features/home/models/LocationSearch";

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

/**
 * Fetches location search results from TravClan API.
 */
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
