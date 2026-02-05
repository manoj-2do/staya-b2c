/**
 * Backend — server-side only.
 * Rooms and rates: POST request to TravClan Rooms and Rates API.
 * Auth Interceptor handles token + 401 refresh/retry via requestManager.
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";
import type { RoomsAndRatesPayload } from "@/frontend/features/home/models/RoomsAndRates";

export type PostRoomsAndRatesResult =
    | { ok: true; data: unknown }
    | { ok: false; status: number; error: string; details?: unknown };

/**
 * Sends rooms and rates request to TravClan API.
 */
export async function postRoomsAndRates(
    payload: RoomsAndRatesPayload
): Promise<PostRoomsAndRatesResult> {
    const base = (env.travclan.voltLiteApiUrl ?? "").replace(/\/$/, "");
    const url = `${base}/${travclanPaths.roomsAndRates}`;

    console.log("payload", JSON.stringify(payload));

    const result = await request<unknown>({
        method: "POST",
        url,
        headers: {},
        body: JSON.stringify(payload),
    });

    if (result.status >= 200 && result.status < 300) {
        return {
            ok: true,
            data: result.data ?? {},
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
    };
}
