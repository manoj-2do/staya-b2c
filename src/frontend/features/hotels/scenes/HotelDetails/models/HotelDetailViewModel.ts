/**
 * View Model for the Hotel Detail Page.
 * Transforms the API responses into a structure easier for UI components to consume.
 */

import { HotelStaticContentResponse } from "./HotelStaticContent";
import { RoomsAndRatesResponse } from "./RoomsAndRatesResponse";

export interface HotelHeaderViewModel {
    name: string;
    rating: number; // 4.4
    reviewCount: number; // 5
    address: string; // "155 Sunazi, Takasu, Kochi, Japan"
    tags: string[]; // ["Luxury Stay", "Top Pick"]
    shareUrl: string;
}

export interface HotelImageViewModel {
    url: string;
    caption: string;
    size: "hero" | "secondary";
}

export interface HotelInfoViewModel {
    description: string;
    amenities: { name: string; icon?: string }[];
    checkIn?: string;
    checkOut?: string;
    host?: string;
}

export interface RoomRateViewModel {
    id: string; // optionId
    name: string; // from standardizedRoom or room
    description: string;
    price: number;
    currency: string;
    refundable: boolean;
    boardBasis: string; // "Room Only"
    cancellationPolicy: string;
    maxOccupancy: { adults: number; children: number };
    images: string[];
    facilities: string[];
    buttonLabel: string; // "Reserve"

    // Multiple rooms breakdown
    rateRooms: {
        id: string; // roomId or unique key
        name: string;
        occupancy: { adults: number; children: number };
    }[];
}

export interface HotelDetailViewModel {
    isLoadingStatic: boolean;
    isLoadingRates: boolean;
    errorStatic?: string;
    errorRates?: string;

    header?: HotelHeaderViewModel;
    images?: HotelImageViewModel[];
    info?: HotelInfoViewModel;
    rooms?: RoomRateViewModel[];
}
