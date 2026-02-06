/**
 * Model definitions for Booking Details response.
 */

export interface BookingGuest {
    title: string;
    firstName: string;
    lastName: string;
    isLeadGuest: boolean;
    type: "Adult" | "Child";
    email: string;
    contactNumber: string;
    age?: number;
}

export interface Bed {
    type: string;
    count: number;
}

export interface RoomDetails {
    name: string;
    description: string;
    beds: Bed[];
    views: string[];
}

export interface RateDetails {
    price: number;
    currency: string;
    refundable: boolean;
    refundPolicy: string;
}

export interface SelectedRoomAndRate {
    rateId: string;
    roomId: string;
    rateDetails: RateDetails;
    roomDetails: RoomDetails;
}

export interface HotelStaticContent {
    name?: string;
    contact?: {
        address?: {
            line1?: string;
            city?: { name: string };
            state?: { code: string };
            country?: { name: string };
            postalCode?: string;
        };
        phones?: string[];
        emails?: string[];
    };
    descriptions?: Array<{ text: string }>;
    images?: Array<{ links: Array<{ url: string; size: string }> }>;
}

export interface BookingDetails {
    bookingCode: string;
    bookingStatus: string;
    traceId: string;
    itineraryCode: string;
    checkInDate: string;
    checkOutDate: string;
    selectedRoomsAndRates: SelectedRoomAndRate[];
    guestData: BookingGuest[];
    hotelStaticContent?: HotelStaticContent;
}

export interface BookingDetailsResponse {
    message: string;
    error: boolean;
    code: number;
    results: BookingDetails;
}
