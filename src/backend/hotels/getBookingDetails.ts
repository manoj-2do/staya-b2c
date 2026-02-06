/**
 * Backend — server-side only.
 * Get Booking Details: GET request to TravClan Booking API.
 */

import { env } from "@/frontend/core/config/env";
import { request } from "@/backend/network/requestManager";
import { travclanPaths } from "@/backend/apiPaths";
import { BookingDetails, BookingGuest, SelectedRoomAndRate } from "@/frontend/features/hotels/models/BookingDetails";

export type GetBookingDetailsResult =
    | { ok: true; data: BookingDetails; newAccessToken?: string }
    | { ok: false; status: number; error: string; details?: unknown; newAccessToken?: string };

/**
 * Fetches booking details from TravClan API.
 * @param bookingId - Booking code (bookingRefId) used in API path
 * @param traceId - Request trace ID
 * @param accessToken - Auth token
 */
export async function getBookingDetails(
    bookingId: string,
    traceId: string,
    accessToken?: string | null
): Promise<GetBookingDetailsResult> {
    const base = (env.travclan.apiBaseUrl ?? "").replace(/\/$/, "");
    const url = `${base}/${travclanPaths.bookingDetails}/${bookingId}`;

    const headers: Record<string, string> = {
        "Authorization-Type": "external-service",
        "source": "website",
        "accept": "application/json"
    };

    if (traceId) {
        headers["traceId"] = traceId;
    }

    const result = await request<any>({
        method: "GET",
        url,
        headers: headers,
        accessToken,
    });

    if (result.status >= 200 && result.status < 300) {
        const rawData = result.data;

        // Transform the raw API response to BookingDetails
        let bookingDetails: BookingDetails | null = null;

        try {
            // Check if we have the new structure
            // rawData is { status: 200, data: { results: { ... } } }
            // So we need to access rawData.data.results
            console.log("[BE] Debug Booking Details Raw:", JSON.stringify(rawData, null, 2));
            const results = rawData?.data?.results || rawData?.results; // Try both paths
            const hotelItinerary = results?.hotel_itinerary?.[0];
            console.log("[BE] Debug Hotel Itinerary Found:", !!hotelItinerary);

            if (hotelItinerary) {
                // Map the new structure
                const item = hotelItinerary.items?.[0];
                const rawRooms = item?.selectedRoomsAndRates || [];

                // Map rooms
                const selectedRoomsAndRates: SelectedRoomAndRate[] = rawRooms.map((r: any) => ({
                    rateId: r.rate?.id,
                    roomId: r.room?.id,
                    rateDetails: {
                        price: r.rate?.totalRate || r.rate?.finalRate || 0,
                        currency: r.rate?.currency || "INR",
                        refundable: r.rate?.isRefundable || false,
                        refundPolicy: r.rate?.cancellationPolicies?.[0]?.text || ""
                    },
                    roomDetails: {
                        name: r.room?.name || "Room",
                        description: r.room?.description || "",
                        beds: r.room?.beds || [],
                        views: r.room?.views || []
                    }
                }));

                // Map guests (flatten across all rooms)
                let guestData: BookingGuest[] = [];
                rawRooms.forEach((r: any) => {
                    const roomGuests = r.room?.guests || [];
                    roomGuests.forEach((g: any) => {
                        guestData.push({
                            title: g.title,
                            firstName: g.firstName,
                            lastName: g.lastName,
                            isLeadGuest: g.isLeadGuest,
                            type: g.type,
                            email: g.hms_guestadditionaldetail?.email || "",
                            contactNumber: g.hms_guestadditionaldetail?.contactNumber || "",
                            age: g.hms_guestadditionaldetail?.age
                        });
                    });
                });

                // Map Static Content
                const staticContent = hotelItinerary.staticContent?.[0];
                let hotelStaticContent = undefined;
                if (staticContent) {
                    hotelStaticContent = {
                        name: staticContent.name,
                        contact: staticContent.contact,
                        descriptions: staticContent.descriptions,
                        images: staticContent.images
                    };
                }

                const displayBookingCode =
                    (hotelItinerary as Record<string, unknown>).bookingRefId ??
                    (hotelItinerary as Record<string, unknown>).booking_ref_id ??
                    bookingId;
                bookingDetails = {
                    bookingCode: typeof displayBookingCode === "string" ? displayBookingCode : bookingId,
                    bookingStatus: results?.status || "Confirmed",
                    traceId: hotelItinerary.traceId,
                    itineraryCode: hotelItinerary.code,
                    checkInDate: hotelItinerary.checkInDate || item?.checkInDate || results?.searchRequest?.checkInDate || "",
                    checkOutDate: hotelItinerary.checkOutDate || item?.checkOutDate || results?.searchRequest?.checkOutDate || "",
                    selectedRoomsAndRates,
                    guestData,
                    hotelStaticContent
                };
            } else {
                // Fallback attempt: check if rawData itself is the structure or rawData.results (for old behavior)
                // console.warn("New structure mapping failed or not found, data:", JSON.stringify(rawData).slice(0, 100));
            }
        } catch (e) {
            console.error("Error mapping booking details", e);
        }

        if (bookingDetails) {
            return {
                ok: true,
                data: bookingDetails,
                ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
            };
        } else {
            return {
                ok: false,
                status: 500,
                error: "Failed to map API response to BookingDetails model. Data not found or invalid structure.",
                // details: rawData // Removed as per user request to avoid large payload
            };
        }
    }

    return {
        ok: false,
        status: result.status,
        error: "API request failed",
        details: result.errorBody || result.data,
        ...(result.newAccessToken && { newAccessToken: result.newAccessToken }),
    };
}
