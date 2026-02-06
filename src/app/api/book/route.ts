/**
 * POST /api/book
 * Proxies the booking request to the backend service.
 */

import { NextResponse } from "next/server";
import { postBookHotel } from "@/backend/hotels/postBookHotel";
import type { BookHotelPayload } from "@/frontend/features/hotels/models/BookHotel";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation could happen here
        if (!body || !body.hotelId || !body.roomDetails) {
            return NextResponse.json(
                { error: "Invalid booking payload" },
                { status: 400 }
            );
        }

        const payload = body as BookHotelPayload;
        const result = await postBookHotel(payload);

        if (result.ok) {
            return NextResponse.json(result.data);
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status }
        );

    } catch (err) {
        console.error("[API] book error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
