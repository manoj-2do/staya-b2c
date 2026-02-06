/**
 * Backend — server-side only.
 * Static content: GET request to TravClan Hotel Static Content API.
 * Auth Interceptor handles token + 401 refresh/retry via requestManager.
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";

export interface HotelStaticContentResult {
    ok: boolean;
    status?: number;
    data?: unknown;
    error?: string;
    details?: unknown;
    newAccessToken?: string;
}

/**
 * Fetches hotel static content from TravClan API.
 */
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
