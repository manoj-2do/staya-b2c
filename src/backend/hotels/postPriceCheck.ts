/**
 * Backend — server-side only.
 * Price check: POST request to TravClan Price Check API.
 * Auth Interceptor handles token + 401 refresh/retry via requestManager.
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";
import type { PriceCheckPayload } from "@/frontend/features/home/models/PriceCheck";

export type PostPriceCheckResult =
    | { ok: true; data: unknown; newAccessToken?: string }
    | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

/**
 * Sends price check request to TravClan API.
 */
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
