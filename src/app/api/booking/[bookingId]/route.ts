/**
 * GET /api/booking/[bookingId]
 * Fetches booking details for a given booking ID.
 * Expects traceId in query params or headers.
 */

import { NextResponse } from "next/server";
import { getBookingDetails } from "@/lib/api/hotels/getBookingDetails";
import { getAccessTokenFromRequest, responseHeadersWithNewToken } from "@/lib/utils/apiResponse";

export async function GET(
    request: Request,
    { params }: { params: { bookingId: string } }
) {
    const { bookingId } = params;

    if (!bookingId) {
        return NextResponse.json(
            { error: "Booking ID is required" },
            { status: 400 }
        );
    }

    const { searchParams } = new URL(request.url);
    const traceId = searchParams.get("traceId") || request.headers.get("traceId");

    if (!traceId) {
        return NextResponse.json(
            { error: "traceId is required" },
            { status: 400 }
        );
    }

    try {
        const accessToken = getAccessTokenFromRequest(request);
        const result = await getBookingDetails(bookingId, traceId, accessToken);
        const headers = responseHeadersWithNewToken(result.newAccessToken);

        if (result.ok) {
            return NextResponse.json(result.data, { headers });
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status, headers }
        );
    } catch (err) {
        console.error("[API] booking/details:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
