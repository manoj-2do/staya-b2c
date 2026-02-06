export interface PriceCheckResponse {
    status: number;
    error?: string; // Failure case from our API wrapper
    data?: {      // Success case (or nested error)
        message: string;
        error: boolean;
        code: number;
        results: PriceCheckResults;
    };
}

export interface PriceCheckResults {
    options: Record<string, PriceCheckOption>;
    rooms: Record<string, PriceCheckRoom>;
    priceChangeData: PriceChangeData;
    traceId: string;
}

export interface PriceCheckOption {
    rate: {
        availability: string;
        needsPriceCheck: boolean;
        isPackageRate: boolean;
        occupancies: any[];
        currency: string;
        refundable: boolean;
        refundability: string;
        allGuestsInfoRequired: boolean;
        policies: any[];
        boardBasis: {
            description: string;
            type: string;
        };
        cancellationPolicies: any[];
        finalRate: number;
        providerHotelId: string;
    };
}

export interface PriceCheckRoom {
    id: string;
    name: string;
    description: string;
    // Add other fields as necessary based on Usage
}

export interface PriceChangeData {
    isPriceChanged: boolean;
    oldPrice: number;
    newPrice: number;
}
