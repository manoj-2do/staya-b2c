/**
 * GET /api/hotels/[hotelId]/static-content
 * Fetches hotel static content from TravClan.
 */

import { NextResponse } from "next/server";
import { getHotelStaticContent } from "@/lib/api/hotels/getHotelStaticContent";
import { getAccessTokenFromRequest, responseHeadersWithNewToken } from "@/lib/utils/apiResponse";

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

        const accessToken = getAccessTokenFromRequest(request);
        const result = await getHotelStaticContent(hotelId, accessToken);
        const headers = responseHeadersWithNewToken(result.newAccessToken);

        if (result.ok) {
            return NextResponse.json(result.data, { headers });
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status, headers }
        );
    } catch (err) {
        console.error("[API] hotel-static-content:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
