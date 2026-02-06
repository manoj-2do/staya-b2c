"use client";

import React from "react";
import { CompactHeader } from "./components/CompactHeader";
import { PageLoader } from "./components/PageLoader";
import { HotelImageGrid } from "./components/HotelImageGrid";
import { HotelInfoSection } from "./components/HotelInfoSection";
import { RoomsSection } from "./components/RoomsSection";
import { BookingSummaryCard } from "./components/BookingSummaryCard";
import { useHotelDetails } from "./hooks/useHotelDetails";

import { useRouter } from "next/navigation";
import { GenericErrorModal } from "@/frontend/components/common/GenericErrorModal";
import { paths } from "@/frontend/core/paths";

interface HotelDetailsSceneProps {
    hotelId: string;
    traceId?: string;
}

import { getSearchPayload } from "@/frontend/features/hotels/utils/searchParams";
import { getSelectedHotel } from "@/frontend/core/store/searchStore";
import { format } from "date-fns";

export function HotelDetailsScene({ hotelId, traceId }: HotelDetailsSceneProps) {
    const router = useRouter();
    const {
        isLoadingStatic,
        isLoadingRates,
        errorStatic,
        errorRates,
        header,
        images,
        info,
        rooms
    } = useHotelDetails(hotelId, traceId);

    // Get search details from payload/store
    const payload = getSearchPayload();
    const selectedHotel = getSelectedHotel();

    // Fallback hotel name if not in store (e.g. refresh) - dynamic content might load it later if static worked, 
    // but static is disabled/broken. so we rely on store or placeholder.
    const hotelName = selectedHotel?.name || header?.name || "Hotel Details";
    const stars = selectedHotel?.stars || header?.rating || 0;

    // Subtitle logic
    const guests = payload?.occupancies?.reduce((acc, curr) => acc + (curr.numOfAdults || 0) + (curr.childAges?.length || 0), 0) || 2;
    const roomCount = payload?.occupancies?.length || 1;
    let dateRange = "Select dates";
    if (payload?.checkIn && payload?.checkOut) {
        try {
            const inDate = new Date(payload.checkIn);
            const outDate = new Date(payload.checkOut);
            dateRange = `${format(inDate, "d MMM")} - ${format(outDate, "d MMM")}`;
        } catch (e) { /* ignore */ }
    }

    const subtitle = `${guests} Guests | ${dateRange} | ${roomCount} Room${roomCount > 1 ? 's' : ''}`;

    // State for selected room
    const [selectedRoom, setSelectedRoom] = React.useState<any | null>(null);

    // Auto-select first room when rooms load
    React.useEffect(() => {
        if (rooms && rooms.length > 0 && !selectedRoom) {
            // Select first room as requested
            setSelectedRoom(rooms[0]);
        }
    }, [rooms, selectedRoom]);

    // Show error modal if traceId is missing (handled by hook returning errorRates = Missing traceId)
    // We can rely on errorRates for this notification now
    const showTraceIdError = IsTraceIdMissing(errorRates);

    // Show error modal if rates failed (static content failure is ignored)
    const showRateError = !isLoadingRates && !!errorRates;

    if (showTraceIdError || showRateError) {
        let title = "Something went wrong";
        let message = "We encountered an unexpected error. Please try again later.";
        let actionLabel = "Go Home";
        let onAction = () => router.push(paths.home || "/");

        if (showTraceIdError) {
            title = "Invalid Session";
            message = "We encountered an issue with your search session. Please try searching again.";
            actionLabel = "Back to Search";
        } else if (showRateError) {
            title = "No Rates Available";
            message = errorRates || "We couldn't find any available rooms for this hotel at the moment.";
            // actionLabel = "Back to Search";
            // onAction = () => router.push(paths.home || "/"); 
        }

        return (
            <GenericErrorModal
                open={true}
                title={title}
                message={message}
                actionLabel={actionLabel}
                onAction={onAction}
            />
        );
    }

    if (isLoadingStatic && isLoadingRates) {
        return <PageLoader text="Finding the best rates..." />;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <CompactHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
                {/* Basic Header Info (Static Content Replacement) */}
                <div className="py-6 border-b border-gray-100 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{hotelName}</h1>
                    <div className="flex items-center text-gray-600 text-sm md:text-base gap-2">
                        {/* <span>{stars} Stars</span>
                        <span className="mx-1">·</span> */}
                        <span className="font-medium">{subtitle}</span>
                    </div>
                </div>

                {/* {/* Images Grid - Commented out as requested */}
                {/* {images && images.length > 0 ? (
                    <HotelImageGrid images={images} />
                ) : (
                    !isLoadingStatic && <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">No images available</div>
                )} */}

                {/* content grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
                    {/* Left Column: Info & Rooms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Info Section - Commented out as requested
                        {(header || info) && <HotelInfoSection header={header} info={info} />}
                        */}

                        {/* If static content failed, show a small warning maybe? or just nothing. Request implied "load page and wait". */}
                        {/* errorStatic handling removed or minimal */}

                        <div id="rooms-section">
                            <RoomsSection
                                rooms={rooms}
                                loading={isLoadingRates}
                                selectedRoomId={selectedRoom?.id}
                                onSelectRoom={setSelectedRoom}
                            />
                        </div>
                    </div>

                    {/* Right Column: Sticky Reservation Card */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-24">
                            <div className="mb-4">
                                <BookingSummaryCard
                                    selectedRoom={selectedRoom}
                                    hotelId={hotelId}
                                    traceId={traceId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function IsTraceIdMissing(error?: string): boolean {
    return error === "Missing traceId";
}
