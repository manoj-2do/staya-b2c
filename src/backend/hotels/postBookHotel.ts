/**
 * Backend — server-side only.
 * POST Hotel Booking to TravClan API.
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";
import type { BookHotelPayload, BookHotelResponse } from "@/frontend/features/hotels/models/BookHotel";

export type PostBookHotelResult =
    | { ok: true; data: BookHotelResponse }
    | { ok: false; status: number; error: string; details?: unknown };

export async function postBookHotel(
    payload: BookHotelPayload
): Promise<PostBookHotelResult> {
    const base = (env.travclan.voltLiteApiUrl ?? "").replace(/\/$/, "");
    const url = `${base}/${travclanPaths.book}`;

    console.log("[BE] Booking Payload:", JSON.stringify(payload));

    const result = await request<BookHotelResponse>({
        method: "POST",
        url,
        body: JSON.stringify(payload),
        headers: {
            "Authorization-Type": "external-service", // Explicitly ensuring this
            source: "website"
        }
    });

    if (result.status >= 200 && result.status < 300 && result.data) {
        return {
            ok: true,
            data: result.data,
        };
    }

    return {
        ok: false,
        status: result.status,
        error: "Booking failed",
        details: result.errorBody,
    };
}
