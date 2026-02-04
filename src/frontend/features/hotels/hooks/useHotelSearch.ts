"use client";

import { useState, useCallback } from "react";
import type {
  HotelSearchResponse,
  HotelSearchResultItem,
  TraceIdDetails,
} from "../models/HotelSearchResponse";
import type { HotelSearchPayload } from "@/frontend/features/home/models/HotelSearch";
import { apiPaths } from "@/frontend/core/config/apiPaths";
import { env } from "@/frontend/core/config/env";
import { getMockHotelSearchResponse } from "@/mock-data/hotelSearchResponse";

export interface UseHotelSearchState {
  hotels: HotelSearchResultItem[];
  loading: boolean;
  loadingMore: boolean;
  empty: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  traceId: string | null;
  traceIdDetails: TraceIdDetails | null;
  error: string | null;
}

export interface UseHotelSearchReturn extends UseHotelSearchState {
  search: (payload: HotelSearchPayload) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

const initialState: UseHotelSearchState = {
  hotels: [],
  loading: false,
  loadingMore: false,
  empty: false,
  totalCount: 0,
  totalPages: 0,
  currentPage: 0,
  hasMore: false,
  traceId: null,
  traceIdDetails: null,
  error: null,
};

export function useHotelSearch(
  initialPayload: HotelSearchPayload | null
): UseHotelSearchReturn {
  const [state, setState] = useState<UseHotelSearchState>(initialState);
  const [payload, setPayload] = useState<HotelSearchPayload | null>(
    initialPayload
  );

  const search = useCallback(async (searchPayload: HotelSearchPayload) => {
    setPayload(searchPayload);
    setState((s) => ({ ...s, loading: true, error: null, empty: false }));

    try {
      let response: HotelSearchResponse;

      if (env.useMockHotelSearch) {
        await new Promise((r) => setTimeout(r, 2000));
        response = getMockHotelSearchResponse(1, 5);
      } else {
        const res = await fetch(apiPaths.hotelSearch, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...searchPayload, page: 1 }),
        });

        const data = (await res.json()) as
          | HotelSearchResponse
          | { error: string };

        if (!res.ok) {
          const err = (data as { error?: string }).error ?? "Search failed";
          setState((s) => ({
            ...s,
            loading: false,
            error: err,
            hotels: [],
            empty: true,
          }));
          return;
        }

        response = data as HotelSearchResponse;
      }
      const results = response?.results;
      const items = results?.data ?? [];
      const traceDetails = results?.traceIdDetails ?? null;

      setState({
        hotels: items,
        loading: false,
        loadingMore: false,
        empty: items.length === 0,
        totalCount: results?.totalCount ?? 0,
        totalPages: results?.totalPages ?? 1,
        currentPage: results?.currentPage ?? 1,
        hasMore: (results?.nextPage ?? null) != null,
        traceId: traceDetails?.id ?? null,
        traceIdDetails: traceDetails,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Search failed",
        empty: true,
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!payload || state.loadingMore || !state.hasMore) return;
    if (!env.useMockHotelSearch && !state.traceId) return;

    const nextPage = state.currentPage + 1;
    setState((s) => ({ ...s, loadingMore: true }));

    try {
      let response: HotelSearchResponse;

      if (env.useMockHotelSearch) {
        await new Promise((r) => setTimeout(r, 400));
        response = getMockHotelSearchResponse(nextPage, 5);
      } else {
        const res = await fetch(apiPaths.hotelSearch, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            page: nextPage,
            traceId: state.traceId,
          }),
        });

        const data = (await res.json()) as
          | HotelSearchResponse
          | { error: string };

        if (!res.ok) {
          setState((s) => ({ ...s, loadingMore: false }));
          return;
        }

        response = data as HotelSearchResponse;
      }
      const results = response?.results;
      const newItems = results?.data ?? [];

      setState((s) => ({
        ...s,
        hotels: [...s.hotels, ...newItems],
        loadingMore: false,
        currentPage: results?.currentPage ?? nextPage,
        hasMore: (results?.nextPage ?? null) != null,
      }));
    } catch {
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [
    payload,
    state.loadingMore,
    state.hasMore,
    state.traceId,
    state.currentPage,
  ]);

  const reset = useCallback(() => {
    setState(initialState);
    setPayload(null);
  }, []);

  return { ...state, search, loadMore, reset };
}
