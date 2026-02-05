"use client";

import React from "react";
import { HotelDetailsScene } from "@/frontend/features/hotels/scenes/HotelDetails/HotelDetailsScene";

interface HotelDetailPageProps {
    params: {
        hotelId: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function HotelDetailPage({ params, searchParams }: HotelDetailPageProps) {
    const traceId = typeof searchParams?.traceId === "string" ? searchParams.traceId : undefined;
    return <HotelDetailsScene hotelId={params.hotelId} traceId={traceId} />;
}

