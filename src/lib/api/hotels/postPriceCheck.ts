/**
 * Server-side only. POST price check to TravClan API.
 */

import { env } from "@/lib/env";
import { request } from "@/lib/api/requestManager";
import { travclanPaths } from "@/lib/api/apiPaths";
import type { PriceCheckPayload } from "@/features/home/models/PriceCheck";

export type PostPriceCheckResult =
  | { ok: true; data: unknown; newAccessToken?: string }
  | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

export async function postPriceCheck(
  payload: PriceCheckPayload,
  accessToken?: string | null
): Promise<PostPriceCheckResult> {
  const base = (env.travclan.voltLiteApiUrl ?? "").replace(/\/$/, "");
  const url = `${base}/${travclanPaths.checkPrice}`;

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
        : "Price check failed",
    details: result.errorBody,
    ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
  };
}
