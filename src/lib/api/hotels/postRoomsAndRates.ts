/**
 * Server-side only. POST rooms and rates to TravClan API.
 */

import { env } from "@/lib/env";
import { request } from "@/lib/api/requestManager";
import { travclanPaths } from "@/lib/api/apiPaths";
import type { RoomsAndRatesPayload } from "@/features/home/models/RoomsAndRates";

export type PostRoomsAndRatesResult =
  | { ok: true; data: unknown; newAccessToken?: string }
  | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

export async function postRoomsAndRates(
  payload: RoomsAndRatesPayload,
  accessToken?: string | null
): Promise<PostRoomsAndRatesResult> {
  const base = (env.travclan.voltLiteApiUrl ?? "").replace(/\/$/, "");
  const url = `${base}/${travclanPaths.roomsAndRates}`;

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
        : "Getting rooms and rates failed",
    details: result.errorBody,
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
