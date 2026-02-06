/**
 * POST /api/check-price
 * Receives price check request payload and forwards to TravClan.
 */

import { NextResponse } from "next/server";
import { postPriceCheck } from "@/backend/hotels/postPriceCheck";
import type { PriceCheckPayload } from "@/frontend/features/home/models/PriceCheck";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const payload = body as PriceCheckPayload;
        const result = await postPriceCheck(payload);
        console.log("Result: ", result);
        if (result.ok) {
            return NextResponse.json(result.data);
        }

        return NextResponse.json(
            { error: result.error, details: result.details },
            { status: result.status }
        );
    } catch (err) {
        console.error("[API] check-price:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
