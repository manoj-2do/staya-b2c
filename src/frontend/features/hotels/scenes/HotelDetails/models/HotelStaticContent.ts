/**
 * Interface definition for Hotel Static Content API response.
 * Based on the JSON structure provided by the user.
 */

export interface GeoCode {
    lat: string;
    long: string;
}

export interface Address {
    line1: string;
    city: { name: string };
    state: { name: string };
    country: { code: string; name: string };
    postalCode: string;
}

export interface Contact {
    address: Address;
    phones: string[];
    fax: string[];
}

export interface Description {
    type: string;
    text: string;
}

export interface Policy {
    type: string;
    text: string;
}

export interface Facility {
    id: string;
    groupId: string;
    name: string;
}

export interface FacilityGroup {
    id: string;
    name: string;
    culture: string;
    type: string;
    facilities?: Facility[];
    imageUrl?: string;
}

export interface RoomBed {
    Type: string;
    Size: string;
    Count: string;
}

export interface RoomStatic {
    roomId: string; // "318140286"
    type: string; // "Standard Single Room..."
    facilities: Facility[];
    beds: RoomBed[];
    area: { squareMeters: string; squareFeet: string };
    maxGuestAllowed: string;
    maxAdultAllowed: string;
    maxChildrenAllowed: string;
}

export interface ImageLink {
    size: "Standard" | "Xs" | "Xxl" | string;
    url: string;
}

export interface HotelImage {
    links: ImageLink[];
    caption: string;
    roomCodes: string[];
}

export interface NearbyAttraction {
    name: string;
    distance: string; // "1"
    unit: string; // "Km"
}

export interface ReviewCategoryRating {
    category: string;
    rating: string;
}

export interface Review {
    provider: string;
    count: string;
    rating: string;
    categoryratings: ReviewCategoryRating[];
}

export interface ImagesAndCaptions {
    [key: string]: {
        captionLabel: string;
        images: HotelImage[];
    };
}

export interface Attribute {
    key: string;
    value: string;
}

export interface HotelData {
    id: string;
    name: string;
    providerId: number;
    providerHotelId: string;
    providerName: string;
    language: string;
    geoCode: GeoCode;
    contact: Contact;
    descriptions: Description[];
    policies: Policy[];
    facilities: Facility[];
    facilityGroups: FacilityGroup[];
    rooms: RoomStatic[];
    images: HotelImage[];
    nearByAttractions: NearbyAttraction[];
    reviews: Review[];
    imagesAndCaptions: ImagesAndCaptions;
    attributes: Attribute[];
    groupedFacilities: FacilityGroup[];
    fees: unknown[];
    badges: string[];
    tags: string[];
    category: string;
    starRating: string;
    heroImage: string;
}

export interface HotelResult {
    provider: number;
    traceId: string | null;
    hotelId: string;
    data: HotelData[];
}

export interface HotelStaticContentResponse {
    message: string;
    error: boolean;
    code: number;
    results: HotelResult[];
}
