"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2, MapPin } from "lucide-react";
import { content } from "@/frontend/core/content";
import { DockedSearchBar } from "../../components/DockedSearchBar";
import { HotelCard } from "../../components/HotelCard";
import { ExpiredSearchPopup } from "../../components/ExpiredSearchPopup";
import { useHotelSearch } from "../../hooks/useHotelSearch";
import { getSearchPayload } from "../../utils/searchParams";
import { paths } from "@/frontend/core/paths";
import { Button } from "@/frontend/components/ui/button";

const CARDS_PER_ROW = 5;
const CARD_MIN_HEIGHT = 320;
const CARD_GAP = 16;

export function HotelResultsScene() {
  const searchParams = useSearchParams();
  const parentRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const payload = useMemo(() => getSearchPayload(), []);

  useEffect(() => {
    if (!payload) {
      window.location.href = paths.home;
    }
  }, [payload]);
  const {
    hotels,
    loading,
    loadingMore,
    empty,
    hasMore,
    search,
    loadMore,
    traceId,
  } = useHotelSearch(payload);

  const where = searchParams?.get("where") ?? "Destination";
  const checkIn = searchParams?.get("checkIn") ?? "";
  const checkOut = searchParams?.get("checkOut") ?? "";
  const guestCount = payload?.occupancies?.reduce(
    (s, o) => s + o.numOfAdults + o.childAges.length,
    0
  ) ?? 1;
  const roomCount = payload?.occupancies?.length ?? 1;

  const hasSearched = useRef(false);
  useEffect(() => {
    if (payload && !hasSearched.current) {
      hasSearched.current = true;
      search(payload);
    }
  }, [payload, search]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = observerTargetRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  const rowCount = Math.ceil(hotels.length / CARDS_PER_ROW);
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_MIN_HEIGHT + CARD_GAP,
    overscan: 2,
  });

  const dateRange = checkIn && checkOut
    ? `${checkIn.split("-").slice(1).join("/")} – ${checkOut.split("-").slice(1).join("/")}`
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <DockedSearchBar
            where={where}
            dateRange={dateRange}
            guestCount={guestCount}
            roomCount={roomCount}
            searchParams={searchParams?.toString() ?? ""}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto" ref={parentRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Searching hotels…</p>
          </div>
        ) : empty ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-lg font-semibold text-foreground">
              {content.hotelResults.emptyTitle}
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {content.hotelResults.emptyMessage}
            </p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const startIdx = virtualRow.index * CARDS_PER_ROW;
                const rowHotels = hotels.slice(
                  startIdx,
                  startIdx + CARDS_PER_ROW
                );
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                  >
                    {rowHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                      />
                    ))}
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div
                ref={observerTargetRef}
                className="flex justify-center py-8"
              >
                {loadingMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">
                      {content.hotelResults.loadingMore}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <ExpiredSearchPopup
        open={false}
        onDismiss={() => { }}
      />
    </div>
  );
}
