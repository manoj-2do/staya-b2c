"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { locationsSearchAction } from "@/backend/locations/locationsSearchAction";
import { ensureAccessToken, setAccessToken } from "@/frontend/core/auth/authToken";
import type { LocationSearchResult } from "@/frontend/features/home/models/LocationSearch";

export interface UseLocationSearchReturn {
  results: LocationSearchResult[];
  loading: boolean;
  error: string | null;
}

/**
 * Location search: input is NOT debounced (caller updates on every keystroke).
 * Only the API call is debounced — no blocking or delaying of typing.
 */
export function useLocationSearch(
  searchString: string,
  debounceMs: number = 300
): UseLocationSearchReturn {
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const callApi = useCallback(async (query: string) => {
    const queryTrimmed = query.trim();
    if (!queryTrimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const accessToken = await ensureAccessToken();
    const outcome = await locationsSearchAction(queryTrimmed, accessToken);
    setLoading(false);
    if (outcome.newAccessToken) {
      setAccessToken(outcome.newAccessToken);
    }
    if (outcome.ok) {
      setResults(outcome.results);
      setError(null);
    } else {
      setResults([]);
      setError(outcome.error ?? "Search failed");
    }
  }, []);

  // Debounce only the API call. searchString (input value) updates immediately in parent.
  useEffect(() => {
    const trimmed = searchString.trim();
    if (apiTimeoutRef.current) {
      clearTimeout(apiTimeoutRef.current);
      apiTimeoutRef.current = null;
    }
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    apiTimeoutRef.current = setTimeout(() => {
      apiTimeoutRef.current = null;
      void callApi(trimmed);
    }, debounceMs);
    return () => {
      if (apiTimeoutRef.current) {
        clearTimeout(apiTimeoutRef.current);
      }
    };
  }, [searchString, debounceMs, callApi]);

  return { results, loading, error };
}
