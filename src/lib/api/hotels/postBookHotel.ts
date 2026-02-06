/**
 * Server-side only. POST hotel booking to TravClan API.
 */

import { env } from "@/lib/env";
import { request } from "@/lib/api/requestManager";
import { travclanPaths } from "@/lib/api/apiPaths";
import type { BookHotelPayload, BookHotelResponse } from "@/features/hotels/models/BookHotel";

export type PostBookHotelResult =
  | { ok: true; data: BookHotelResponse; newAccessToken?: string }
  | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

export async function postBookHotel(
  payload: BookHotelPayload,
  accessToken?: string | null
): Promise<PostBookHotelResult> {
  const base = (env.travclan.voltLiteApiUrl ?? "").replace(/\/$/, "");
  const url = `${base}/${travclanPaths.book}`;

  console.log("[BE] Booking Payload:", JSON.stringify(payload));

  const result = await request<BookHotelResponse>({
    method: "POST",
    url,
    body: JSON.stringify(payload),
    headers: {
      "Authorization-Type": "external-service",
      source: "website",
    },
    accessToken,
  });

  if (result.status >= 200 && result.status < 300 && result.data) {
    return {
      ok: true,
      data: result.data,
      ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
    };
  }

  return {
    ok: false,
    status: result.status,
    error: "Booking failed",
    details: result.errorBody,
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
