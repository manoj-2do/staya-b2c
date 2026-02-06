/**
 * Interface definition for Rooms and Rates API response.
 * Based on the JSON structure provided by the user.
 */

export interface RoomOccupancy {
    roomId: string;
    stdRoomId: string;
    numOfAdults: string;
    numOfChildren: string;
}

export interface RateBoardBasis {
    description: string;
    type: string;
}

export interface CancellationPolicy {
    estimatedValue: number;
    start: string;
    end: string;
}

export interface RatePolicy {
    type: string;
    text: string;
}

export interface HotelRate {
    availability: string;
    needsPriceCheck: boolean;
    isPackageRate: boolean;
    occupancies: RoomOccupancy[];
    currency: string;
    refundable: boolean;
    refundability: "NonRefundable" | "Refundable" | string;
    allGuestsInfoRequired: boolean;
    boardBasis: RateBoardBasis;
    cancellationPolicies: CancellationPolicy[];
    IsPassportMandatory: boolean;
    IsPANMandatory: boolean;
    providerHotelId: string;
    policies: RatePolicy[];
    finalRate: number;
}

export interface RateOption {
    rate: HotelRate;
}

export interface RoomDefinition {
    id: string;
    name: string;
    description: string;
    beds: unknown[];
    smokingAllowed: boolean;
    facilities: unknown[];
    views: unknown[];
}

export interface StandardizedRoomImage {
    caption: string;
    links: { url: string; size: string }[];
}

export interface StandardizedRoomFacility {
    name: string;
}

export interface StandardizedRoomBed {
    type: string;
    count: string;
}

export interface StandardizedRoom {
    id: string;
    name: string;
    images: StandardizedRoomImage[];
    facilities: StandardizedRoomFacility[];
    maxGuestAllowed: string;
    maxAdultAllowed: string;
    maxChildrenAllowed: string;
    area: { squareFeet: string };
    views: string[];
    type: string;
    beds: StandardizedRoomBed[];
    mappedRoomRates: unknown[];
    attributes: unknown[];
}

export interface RoomsAndRatesResults {
    options: Record<string, RateOption>; // Key is UUID
    rooms: Record<string, RoomDefinition>; // Key is UUID
    standardizedRooms: Record<string, StandardizedRoom>; // Key is ID "1", "2" etc
}

export interface RoomsAndRatesResponse {
    message: string;
    error: boolean;
    code: number;
    results: RoomsAndRatesResults;
}
