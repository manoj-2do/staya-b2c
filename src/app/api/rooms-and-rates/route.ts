/**
 * POST /api/rooms-and-rates
 * Receives rooms and rates request payload and forwards to TravClan.
 */

import { NextResponse } from "next/server";
import { postRoomsAndRates } from "@/backend/hotels/postRoomsAndRates";
import { getAccessTokenFromRequest, responseHeadersWithNewToken } from "@/backend/utils/apiResponse";
import type { RoomsAndRatesPayload } from "@/frontend/features/home/models/RoomsAndRates";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const accessToken = getAccessTokenFromRequest(request);
        const payload = body as RoomsAndRatesPayload;
        const result = await postRoomsAndRates(payload, accessToken);
        const headers = responseHeadersWithNewToken(result.newAccessToken);

        if (result.ok) {
            return NextResponse.json(result.data, { headers });
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status, headers }
        );
    } catch (err) {
        console.error("[API] rooms-and-rates:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
