/**
 * Simple runtime store for search state.
 * This avoids passing traceId and other search params via URL query strings excessively.
 * Note: This state is cleared on page refresh.
 */

interface SearchStore {
    traceId: string | null;
    setTraceId: (id: string | null) => void;
    getTraceId: () => string | null;
}

let _traceId: string | null = null;

export const searchStore: SearchStore = {
    getTraceId: () => _traceId,
    setTraceId: (id: string | null) => {
        _traceId = id;
    },
    traceId: null, // Initial value property, though getter is preferred for latest
};

// Also export a function to easily set it from consumers without importing full store object if preferred
export function setGlobalTraceId(id: string | null) {
    _traceId = id;
}

// Shared variable for selected hotel (simple runtime store)
let _selectedHotel: { name: string; id: string; stars?: number } | null = null;

export function setSelectedHotel(hotel: { name: string; id: string; stars?: number } | null) {
    _selectedHotel = hotel;
}

export function getSelectedHotel() {
    return _selectedHotel;
}

export function getGlobalTraceId(): string | null {
    return _traceId;
}
