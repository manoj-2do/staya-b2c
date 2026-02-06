/**
 * Runtime store for search state. Cleared on page refresh.
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
  traceId: null,
};

export function setGlobalTraceId(id: string | null) {
  _traceId = id;
}

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

let _selectedRate: any | null = null;

export function setSelectedRate(rate: any | null) {
  _selectedRate = rate;
}

export function getSelectedRate() {
  return _selectedRate;
}
