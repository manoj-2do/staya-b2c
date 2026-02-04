/**
 * POST /api/hotel-search
 * Receives hotel search request payload and forwards to TravClan.
 * Payload must follow CURRENT_FOCUS.md structure.
 */

import { NextResponse } from "next/server";
import { postHotelSearch } from "@/backend/hotels/postHotelSearch";
import type { HotelSearchPayload } from "@/frontend/features/home/models/HotelSearch";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const payload = body as HotelSearchPayload;
    const result = await postHotelSearch(payload);

    if (result.ok) {
      return NextResponse.json(result.data);
    }

    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status }
    );
  } catch (err) {
    console.error("[API] hotel-search:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
