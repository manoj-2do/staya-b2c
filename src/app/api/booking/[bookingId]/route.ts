/**
 * GET /api/booking/[bookingId]
 * Fetches booking details for a given booking ID.
 * Expects traceId in query params or headers.
 */

import { NextResponse } from "next/server";
import { getBookingDetails } from "@/backend/hotels/getBookingDetails";

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
        const result = await getBookingDetails(bookingId, traceId);

        if (result.ok) {
            return NextResponse.json(result.data);
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status }
        );
    } catch (err) {
        console.error("[API] booking/details:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
