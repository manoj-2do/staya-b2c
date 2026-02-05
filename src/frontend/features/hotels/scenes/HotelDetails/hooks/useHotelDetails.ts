"use client";

import { useState, useEffect } from "react";
import { HotelDetailViewModel, HotelHeaderViewModel, HotelImageViewModel, HotelInfoViewModel, RoomRateViewModel } from "../models/HotelDetailViewModel";
import { HotelStaticContentResponse, HotelData } from "../models/HotelStaticContent";
import { RoomsAndRatesResponse, HotelRate } from "../models/RoomsAndRatesResponse";
import { getGlobalTraceId } from "@/frontend/core/store/searchStore";

export function useHotelDetails(hotelId: string, traceId?: string): HotelDetailViewModel {
    const [viewModel, setViewModel] = useState<HotelDetailViewModel>({
        isLoadingStatic: true,
        isLoadingRates: true,
    });

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchStaticContent() {
            try {
                const res = await fetch(`/api/hotels/${hotelId}/static-content`, { signal });
                const json = (await res.json()) as HotelStaticContentResponse;

                if (json.code === 200 && json.results?.[0]?.data?.[0]) {
                    const data = json.results[0].data[0];
                    const vm = transformStaticContentToViewModel(data);

                    if (isMounted) {
                        setViewModel((prev) => ({
                            ...prev,
                            isLoadingStatic: false,
                            header: vm.header,
                            images: vm.images,
                            info: vm.info,
                        }));
                    }
                } else {
                    // Start: Non-blocking error handling
                    console.warn("Static content not found");
                    if (isMounted) setViewModel(prev => ({ ...prev, isLoadingStatic: false }));
                    // End: Non-blocking error handling
                }
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                console.error("Failed to fetch static content", err);
                // Start: Non-blocking error handling
                if (isMounted) setViewModel(prev => ({ ...prev, isLoadingStatic: false }));
                // End: Non-blocking error handling
            }
        }

        async function fetchRoomsAndRates() {
            // Use global traceId if not passed (though we removed it from props, we still support overload if needed, or just prioritize global)
            const currentTraceId = traceId || getGlobalTraceId();

            // If traceId is missing, we can't fetch rates
            if (!currentTraceId) {
                if (isMounted) setViewModel(prev => ({ ...prev, isLoadingRates: false, errorRates: "Missing traceId" }));
                return;
            }

            try {
                const payload = {
                    traceId: currentTraceId,
                    hotelId: hotelId
                };

                const res = await fetch('/api/rooms-and-rates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal
                });

                const json = (await res.json()) as RoomsAndRatesResponse;

                if (json.code === 200 && json.results) {
                    const rooms = transformRoomsAndRatesToViewModel(json.results);
                    if (isMounted) {
                        setViewModel(prev => ({
                            ...prev,
                            isLoadingRates: false,
                            rooms: rooms
                        }));
                    }
                } else {
                    if (isMounted) setViewModel(prev => ({ ...prev, isLoadingRates: false, errorRates: "No rooms available" }));
                }

            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                console.error("Failed to fetch rooms and rates", err);
                if (isMounted) setViewModel(prev => ({ ...prev, isLoadingRates: false, errorRates: "Failed to check rates" }));
            }
        }

        // Trigger both in parallel
        fetchStaticContent();
        fetchRoomsAndRates();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [hotelId, traceId]);

    return viewModel;
}

// --- Transformers ---

function transformStaticContentToViewModel(data: HotelData): {
    header: HotelHeaderViewModel;
    images: HotelImageViewModel[];
    info: HotelInfoViewModel;
} {
    // Header
    const header: HotelHeaderViewModel = {
        name: data.name,
        rating: parseRating(data.reviews?.[0]?.rating),
        reviewCount: parseInt(data.reviews?.[0]?.count || "0", 10),
        address: formatAddress(data),
        tags: data.tags || [],
        shareUrl: window.location.href, // Simplification
    };

    // Images
    const images: HotelImageViewModel[] = [];
    // Add hero/main images
    const allImages = data.images || [];

    // Try to find high-res images
    allImages.forEach(img => {
        // Prefer 'b' (big) or 'z' (standard) or 'Standard' size if available
        const standardLink = img.links.find(l => l.size === "Standard" || l.size === "z" || l.size === "b") || img.links[0];
        if (standardLink) {
            images.push({
                url: standardLink.url.replace("_t.jpg", "_b.jpg").replace("_s.jpg", "_b.jpg"), // Try to enforce high res
                caption: img.caption,
                size: "secondary"
            });
        }
    });

    // Limit to 5 for grid
    const limitedImages = images.slice(0, 5);
    if (limitedImages.length > 0) limitedImages[0].size = "hero";

    // Info
    const info: HotelInfoViewModel = {
        description: data.descriptions?.find(d => d.type === "Description" || d.type === "HotelDescription")?.text || "No description available.",
        amenities: data.facilities?.map(f => ({ name: f.name })) || [],
    };

    return { header, images: limitedImages, info };
}

function transformRoomsAndRatesToViewModel(results: RoomsAndRatesResponse["results"]): RoomRateViewModel[] {
    const viewModels: RoomRateViewModel[] = [];

    // Iterate over options (rates)
    Object.entries(results.options || {}).forEach(([optionId, option]) => {
        const rate = option.rate;
        // Assume first occupancy/room for mapping room details (simplification)
        const firstOccupancy = rate.occupancies?.[0];
        if (!firstOccupancy) return;

        const roomId = firstOccupancy.roomId;
        const stdRoomId = firstOccupancy.stdRoomId;

        // Try to find room details in standardizedRooms first, then rooms
        const stdRoom = results.standardizedRooms?.[stdRoomId];
        const rawRoom = results.rooms?.[roomId];

        const roomName = stdRoom?.name || rawRoom?.name || "Room";
        const roomDesc = rawRoom?.description || stdRoom?.name || "";

        // Images
        const images: string[] = [];
        stdRoom?.images?.forEach(img => {
            const link = img.links.find(l => l.size === "Standard") || img.links[0];
            if (link) images.push(link.url);
        });

        // Facilities
        const facilities: string[] = [];
        stdRoom?.facilities?.forEach(f => facilities.push(f.name));
        if (facilities.length === 0) {
            // fallback
            if (rate.boardBasis?.description) facilities.push(rate.boardBasis.description);
        }

        // Collect all rooms for this rate
        const rateRooms = rate.occupancies.map((occ, index) => {
            const rId = occ.roomId;
            const sId = occ.stdRoomId;
            const sRoom = results.standardizedRooms?.[sId];
            const rRoom = results.rooms?.[rId];
            const rName = sRoom?.name || rRoom?.name || `Room ${index + 1}`;

            return {
                id: `${optionId}-${index}`,
                name: rName,
                occupancy: {
                    adults: parseInt(occ.numOfAdults || "1", 10),
                    children: parseInt(occ.numOfChildren || "0", 10)
                }
            };
        });

        viewModels.push({
            id: optionId,
            name: roomName, // Primary name (usually first room)
            description: roomDesc,
            price: rate.finalRate,
            currency: rate.currency,
            refundable: rate.refundable,
            boardBasis: rate.boardBasis?.description || "Room Only",
            cancellationPolicy: rate.refundable
                ? `Free cancellation until ${formatDate(rate.cancellationPolicies?.[0]?.start)}`
                : "Non-refundable",
            maxOccupancy: {
                adults: parseInt(firstOccupancy.numOfAdults || "2", 10),
                children: parseInt(firstOccupancy.numOfChildren || "0", 10)
            },
            images: images,
            facilities: facilities,
            buttonLabel: "Reserve",
            rateRooms: rateRooms
        });
    });

    return viewModels;
}

function parseRating(ratingStr?: string): number {
    if (!ratingStr) return 0;
    const n = parseFloat(ratingStr);
    return isNaN(n) ? 0 : n;
}

function formatAddress(data: HotelData): string {
    const parts = [
        data.contact?.address?.line1,
        data.contact?.address?.city?.name,
        data.contact?.address?.country?.name
    ].filter(Boolean);
    return parts.join(", ");
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
        return "";
    }
}
