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
  | { ok: true; data: LocationSearchResponse }
  | { ok: false; status: number; error: string; details?: unknown };

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
 * Uses network manager: token from file, on 401 refresh and retry (handled in requestManager).
 */
export async function getLocationsSearch(
  searchString: string
): Promise<GetLocationsSearchResult> {
  const base = (env.travclan.apiBaseUrl ?? "").replace(/\/$/, "");
  const path = travclanPaths.locationsSearch;
  const url = buildSearchUrl(base, path, searchString);

  const result = await request<
    LocationSearchResponse & { data?: LocationSearchResult[] }
  >({
    method: "GET",
    url,
    headers: {
      accept: "application/json",
      "Authorization-Type": "external-service",
      source: env.travclan.source ?? "website",
    },
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
  };
}
