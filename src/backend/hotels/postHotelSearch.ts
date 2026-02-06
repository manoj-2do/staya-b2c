/**
 * Backend — server-side only.
 * Hotel search: POST request to TravClan Hotel Search API.
 * Auth Interceptor handles token + 401 refresh/retry via requestManager.
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";
import type { HotelSearchPayload } from "@/frontend/features/home/models/HotelSearch";

export type PostHotelSearchResult =
  | { ok: true; data: unknown; newAccessToken?: string }
  | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

/**
 * Sends hotel search request to TravClan API.
 * Payload must follow CURRENT_FOCUS.md (only defined fields, dates YYYY-MM-DD).
 */
export async function postHotelSearch(
  payload: HotelSearchPayload,
  accessToken?: string | null
): Promise<PostHotelSearchResult> {
  const base = (env.travclan.voltLiteApiUrl ?? "").replace(/\/$/, "");
  const url = `${base}/${travclanPaths.hotelSearch}`;

  console.log("payload", JSON.stringify(payload));

  const result = await request<unknown>({
    method: "POST",
    url,
    headers: {},
    body: JSON.stringify(payload),
    accessToken,
  });

  if (result.status >= 200 && result.status < 300) {
    return {
      ok: true,
      data: result.data ?? {},
      ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
    };
  }

  return {
    ok: false,
    status: result.status,
    error:
      result.status === 401
        ? "Authentication required. Please try again."
        : "Hotel search failed",
    details: result.errorBody,
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
