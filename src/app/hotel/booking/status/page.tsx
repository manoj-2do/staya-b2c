"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { appApiPaths } from "@/backend/apiPaths";
import { BookingDetails } from "@/frontend/features/hotels/models/BookingDetails";
import { BookingSuccess } from "@/frontend/features/hotels/scenes/HotelBooking/components/BookingSuccess";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { CompactHeader } from "@/frontend/features/hotels/scenes/HotelDetails/components/CompactHeader";

export default function BookingStatusPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // We expect bookingId explicitly or we might fall back to a hardcoded one for MVP/Demo if needed
    // Requirement says: "Call this API ... booking-code-1"
    // Ideally, the previous page should pass ?bookingId=...
    // For now, if not present, I will default to "booking-code-1" to satisfy the "Call this API" requirement for the demo.
    const bookingIdParam = searchParams.get("bookingId");
    // Also need traceId for the API header
    const traceIdParam = searchParams.get("traceId");

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<BookingDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                // FALLBACK for DEMO: if no params, use hardcoded values to show valid UI
                const bookingId = bookingIdParam || "booking-code-1";
                const traceId = traceIdParam || "demo-trace-id";

                const response = await fetch(`${appApiPaths.bookingDetails}/${bookingId}?traceId=${traceId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch booking details");
                }

                const json: BookingDetails = await response.json();

                // Check for error in the response if it was a 200 OK but handled as error in my API?
                // My API returns { error: ..., details: ... } with status != 200 usually.
                // But just in case, straightforward valid json is expected here.
                // The previous check `if (json.error)` applied to BookingDetailsResponse.
                // The BookingDetails interface does NOT have an 'error' property.
                // So I will assume if response.ok, it is the correct object.

                setData(json);
            } catch (err) {
                console.error("Booking fetch error:", err);
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }

        };

        fetchBooking();
    }, [bookingIdParam, traceIdParam]);

    console.log("Booking Data: ", data);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <CompactHeader />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-500 font-medium">Retrieving your booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <CompactHeader />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="p-4 bg-red-100 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Unable to load booking</h2>
                    <p className="text-gray-600 max-w-md">{error || "We couldn't find the booking details you were looking for."}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <div className="print:hidden">
                <CompactHeader />
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <BookingSuccess
                    booking={data}
                />
            </main>
        </div>
    );
}
