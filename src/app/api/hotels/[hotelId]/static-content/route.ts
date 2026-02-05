/**
 * GET /api/hotels/[hotelId]/static-content
 * Fetches hotel static content from TravClan.
 */

import { NextResponse } from "next/server";
import { getHotelStaticContent } from "@/backend/hotels/getHotelStaticContent";

interface RouteParams {
    params: {
        hotelId: string;
    };
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { hotelId } = params;

        if (!hotelId) {
            return NextResponse.json(
                { error: "Hotel ID is required" },
                { status: 400 }
            );
        }

        const result = await getHotelStaticContent(hotelId);

        if (result.ok) {
            return NextResponse.json(result.data);
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status }
        );
    } catch (err) {
        console.error("[API] hotel-static-content:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
