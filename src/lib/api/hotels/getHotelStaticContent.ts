/**
 * Server-side only. GET hotel static content from TravClan API.
 */

import { env } from "@/lib/env";
import { request } from "@/lib/api/requestManager";
import { travclanPaths } from "@/lib/api/apiPaths";

export interface HotelStaticContentResult {
  ok: boolean;
  status?: number;
  data?: unknown;
  error?: string;
  details?: unknown;
  newAccessToken?: string;
}

export async function getHotelStaticContent(
  hotelId: string,
  accessToken?: string | null
): Promise<HotelStaticContentResult> {
  const base = (env.travclan.apiBaseUrl ?? "").replace(/\/$/, "");
  const path = `${travclanPaths.hotelBase}/${hotelId}/static-content-1`;
  const url = `${base}/${path}`;

  const result = await request<unknown>({
    method: "GET",
    url,
    headers: {},
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
        : "Getting hotel static content failed",
    details: result.errorBody,
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
