export interface BookHotelGuest {
    title: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    isLeadGuest: boolean;
    type: "Adult" | "Child";
    email: string;
    isdCode?: string;
    contactNumber?: string;
    age?: number;
    passportNumber?: string;
    passportExpiry?: string;
    passportIssue?: string;
    passportFrontImage?: string;
    passportBackImage?: string;
    panCardNumber?: string;
    panCardName?: string;
}

export interface BookHotelRoom {
    roomId: string; // Changed back to roomId based on API error "('roomDetails', 0, 'roomId') required"
    guests: BookHotelGuest[];
}

export interface BookHotelSpecialRequest {
    description: string;
}

export interface BookHotelPayload {
    recommendationId?: string;
    traceId: string;
    specialRequests?: BookHotelSpecialRequest[]; // Changed to object array based on API error
    hotelId: string;
    roomDetails: BookHotelRoom[];
    bookingCode?: string;
    optionId: string; // Added optionId based on API error "('optionId',) Field required"
}

export interface RoomConfirmation {
    rateId: string;
    roomId: string;
    providerConfirmationNumber: string;
    hotelConfirmationNumber: string;
    bookingStatus: string;
}

export interface BookHotelResultData {
    status: string;
    bookingRefId: string;
    providerConfirmationNumber: string;
    roomConfirmation: RoomConfirmation[];
}

export interface BookHotelResultItem {
    provider: number;
    traceId: string;
    itineraryCode: string;
    data: BookHotelResultData[];
}

export interface BookHotelResponse {
    message?: string;
    error?: boolean;
    code?: number;
    results: BookHotelResultItem[];
}
