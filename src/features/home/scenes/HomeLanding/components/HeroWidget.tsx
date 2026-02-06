"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, Search, Plus, Minus, Loader2, X, User, Baby, BedDouble, ChevronDown, ChevronUp } from "lucide-react";
import { content } from "@/lib/content";
import { dispatchOfflineActionToast, dispatchValidationToast } from "@/components/common/NetworkStatusBar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Calendar as CalendarUi } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { format, startOfDay, addDays } from "date-fns";
import { cn } from "@/lib/utils/cn";
import type { LocationSearchResult } from "@/features/home/models/LocationSearch";
import { LocationType } from "@/features/home/models/LocationSearch";
import { useLocationSearch } from "@/features/home/hooks/useLocationSearch";
import {
  buildHotelSearchPayload,
  type HotelSearchOccupancy,
} from "@/features/home/models/HotelSearch";
import { paths } from "@/lib/paths";
import { storeSearchPayload } from "@/features/hotels/utils/searchParams";
import { saveLastSearchedDestination, getLastSearchedDestination } from "@/features/hotels/utils/lastSearchDestination";
import { updateSearchPath } from "@/features/home/hooks/useSearchPath";

/** Badge accent by location type: green | purple | blue. */
function getLocationTypeBadgeClass(type: string): string {
  const base = "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium";
  switch (type) {
    case LocationType.City:
    case LocationType.Neighborhood:
    case LocationType.Region:
      return `${base} bg-emerald-500/15 text-emerald-700 dark:text-emerald-400`;
    case LocationType.Hotel:
    case LocationType.PointOfInterest:
    case LocationType.MultiCity:
      return `${base} bg-violet-500/15 text-violet-700 dark:text-violet-400`;
    case LocationType.Airport:
    case LocationType.Country:
    case LocationType.State:
    case LocationType.TrainStation:
    case LocationType.Undefined:
    default:
      return `${base} bg-blue-500/15 text-blue-700 dark:text-blue-400`;
  }
}

const iconClass = "h-4 w-4 shrink-0 text-muted-foreground";
const iconStroke = 1.5;

/** Date picker config: default range, allow past dates, min nights (1 = one night stay) */
const DATE_PICKER_CONFIG = {
  allowPastDates: false,
  minNights: 1,
  /** Default range: today + minNights (e.g. 1 night = today → tomorrow). Computed once per mount. */
  getDefaultRange: (): DateRange => {
    const today = startOfDay(new Date());
    return { from: today, to: addDays(today, DATE_PICKER_CONFIG.minNights) };
  },
} as const;

/** Minimum number of calendar days in range for minNights (1 night = 2 days: check-in + check-out). */
const MIN_DAYS_IN_RANGE = DATE_PICKER_CONFIG.minNights + 1;

type Room = { adults: number; childAges: number[] };

export interface HeroWidgetInitialValues {
  where: string;
  dateRange: DateRange;
  rooms: Room[];
  selectedLocation?: LocationSearchResult | null;
  traceId?: string;
}

interface HeroWidgetProps {
  /** Prefill from current search (e.g. when in list/results view) */
  initialValues?: HeroWidgetInitialValues;
  /** Optional callback to intercept search. Return false to cancel search. */
  onBeforeSearch?: () => Promise<boolean> | boolean;
}

function parseLocationFromStorage(
  stored: ReturnType<typeof getLastSearchedDestination>
): LocationSearchResult | null {
  if (!stored?.location) return null;
  const l = stored.location;
  return {
    id: l.id,
    name: l.fullName.split(",")[0]?.trim() ?? l.fullName,
    fullName: l.fullName,
    type: l.type as LocationSearchResult["type"],
    city: null,
    state: null,
    country: l.country,
    coordinates: { lat: 0, long: 0 },
    referenceId: l.referenceId,
    referenceScore: 0,
    isTermMatch: false,
    relevanceScore: 0,
    travclanScore: null,
  };
}

export function HeroWidget(props: HeroWidgetProps) {
  const { initialValues } = props;
  const router = useRouter();
  const [whereOpen, setWhereOpen] = useState(false);
  const [whenOpen, setWhenOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [where, setWhere] = useState(initialValues?.where ?? "");
  /** Only passed to location search API when user types; prevents API call on mount/prefill/selection */
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const whereInputRef = useRef<HTMLInputElement>(null);
  const whereAnchorRef = useRef<HTMLDivElement>(null);
  const whereOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const whereOptionCountRef = useRef(0);
  const [whereHighlightedIndex, setWhereHighlightedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(
    initialValues?.selectedLocation ?? null
  );
  const { results: locationResults, loading: locationLoading } = useLocationSearch(locationSearchQuery, 300);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialValues?.dateRange ?? DATE_PICKER_CONFIG.getDefaultRange()
  );
  const [rooms, setRooms] = useState<Room[]>(
    initialValues?.rooms?.map(r => ({ ...r, childAges: r.childAges || [] })) ?? [{ adults: 2, childAges: [] }]
  );
  const [expandedRooms, setExpandedRooms] = useState<Set<number>>(new Set([0]));

  /** Prefill from localStorage when no initialValues (e.g. fresh home load) */
  useEffect(() => {
    if (initialValues) return;
    const last = getLastSearchedDestination();
    if (last?.where) {
      setWhere(last.where);
      const loc = parseLocationFromStorage(last);
      if (loc) setSelectedLocation(loc);
    }
  }, [initialValues]);

  /** Disable past dates when allowPastDates is false. Evaluated per render so "today" stays current. */
  const disabledDates = DATE_PICKER_CONFIG.allowPastDates
    ? undefined
    : { before: startOfDay(new Date()) };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      dispatchOfflineActionToast();
      return;
    }

    if (!selectedLocation || !where.trim()) {
      dispatchValidationToast(content.validation.selectDestination);
      return;
    }

    const checkIn = dateRange?.from;
    const checkOut = dateRange?.to;
    const locationId =
      selectedLocation.id != null && selectedLocation.id !== undefined
        ? String(selectedLocation.id)
        : null;

    const hotelIds =
      selectedLocation.type === LocationType.Hotel &&
        selectedLocation.referenceId &&
        selectedLocation.referenceId.trim()
        ? [selectedLocation.referenceId]
        : undefined;

    if (!checkIn || !checkOut) {
      return;
    }

    // Intercept search if prop provided
    if (initialValues && typeof (props as any).onBeforeSearch === 'function') {
      const shouldProceed = await (props as any).onBeforeSearch();
      if (!shouldProceed) return;
    }

    const occupancies: HotelSearchOccupancy[] = rooms.map((r) => ({
      numOfAdults: r.adults,
      childAges: [...r.childAges],
    }));

    const payload = buildHotelSearchPayload({
      checkIn,
      checkOut,
      locationId,
      hotelIds,
      nationality: "IN",
      occupancies,
      page: 1,
      traceId: initialValues?.traceId,
    });

    setSearchLoading(true);
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("staya:hotel-search-start"));
      }

      // Store payload logic...
      storeSearchPayload(payload);
      const query = new URLSearchParams({
        checkIn: format(checkIn, "yyyy-MM-dd"),
        checkOut: format(checkOut, "yyyy-MM-dd"),
        where: where.trim(),
        searchId: String(Date.now()), // Force URL change to trigger re-search even with same params
      });
      if (locationId != null) query.set("locationId", String(locationId));
      if (hotelIds?.length) query.set("hotelIds", hotelIds.join(","));

      saveLastSearchedDestination(where.trim(), selectedLocation);

      // Wait a small tick to allow UI to transition state
      await new Promise((r) => setTimeout(r, 100));

      const targetPath = `${paths.hotelsSearch}?${query.toString()}`;
      router.push(targetPath);
      // Manually trigger local path update for immediate feedback if on same page
      updateSearchPath(targetPath);

      // Force path change event to ensure listeners pick it up immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("staya:path-changed"));
      }

    } catch (err) {
      console.error("[HeroWidget] Navigation error:", err);
      // Only disable loading on error here, otherwise wait for complete event
      setSearchLoading(false);
    }
  };

  // Listen for search complete event to stop loading state
  useEffect(() => {
    const handleComplete = () => setSearchLoading(false);
    window.addEventListener("staya:hotel-search-complete", handleComplete);
    // Safety timeout to prevent infinite loading state
    let safetyTimer: NodeJS.Timeout;
    if (searchLoading) {
      safetyTimer = setTimeout(() => setSearchLoading(false), 15000);
    }
    return () => {
      window.removeEventListener("staya:hotel-search-complete", handleComplete);
      clearTimeout(safetyTimer);
    };
  }, [searchLoading]);


  const whenLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
      : dateRange?.from
        ? format(dateRange.from, "MMM d")
        : content.hero.whenPlaceholder;

  const totalGuests = rooms.reduce(
    (sum, r) => sum + r.adults + (r.childAges?.length ?? 0),
    0
  );
  const roomCount = rooms.length;
  const whoLabel =
    roomCount === 0 && totalGuests === 0
      ? content.hero.whoPlaceholder
      : `${roomCount} ${roomCount === 1 ? "Room" : "Rooms"} | ${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"}`;

  const addRoom = () => {
    setRooms((prev) => [...prev, { adults: 1, childAges: [] }]);
    setExpandedRooms(new Set([rooms.length]));
  };

  const toggleRoomExpanded = (index: number) => {
    setExpandedRooms((prev) => {
      if (prev.has(index)) {
        return new Set();
      }
      return new Set([index]);
    });
  };

  const removeRoom = (index: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
    setExpandedRooms((prev) =>
      new Set(
        Array.from(prev)
          .filter((i) => i !== index)
          .map((i) => (i > index ? i - 1 : i))
      )
    );
  };

  const updateRoomAdults = (index: number, delta: number) => {
    setRooms((prev) =>
      prev.map((r, i) =>
        i !== index ? r : { ...r, adults: Math.max(0, r.adults + delta) }
      )
    );
  };

  const addChild = (roomIndex: number) => {
    setRooms((prev) =>
      prev.map((r, i) =>
        i !== roomIndex
          ? r
          : { ...r, childAges: [...r.childAges, 4] }
      )
    );
  };

  const removeChild = (roomIndex: number, childIndex: number) => {
    setRooms((prev) =>
      prev.map((r, i) =>
        i !== roomIndex
          ? r
          : { ...r, childAges: r.childAges.filter((_, j) => j !== childIndex) }
      )
    );
  };

  const updateChildAge = (
    roomIndex: number,
    childIndex: number,
    delta: number
  ) => {
    setRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIndex) return r;
        const nextAges = [...r.childAges];
        const current = nextAges[childIndex] ?? 0;
        nextAges[childIndex] = Math.max(1, Math.min(17, current + delta));
        return { ...r, childAges: nextAges };
      })
    );
  };

  /** On Where popover close: if they had picked a result, keep it; if dropdown was empty, clear the field (no default text). */
  const handleWhereOpenChange = (open: boolean) => {
    if (!open) {
      setWhereHighlightedIndex(-1);
      setLocationSearchQuery("");
      const firstResult = locationResults[0];
      if (firstResult) {
        setSelectedLocation(firstResult);
        setWhere(firstResult.fullName);
      } else {
        setSelectedLocation(null);
        setWhere("");
      }
    }
    setWhereOpen(open);
  };

  const hasSearchQuery = where.trim().length > 0;
  const isLocationResults = locationResults.length > 0;
  const showEmptyState = hasSearchQuery && !locationLoading && !isLocationResults;
  const whereOptionCount = isLocationResults ? locationResults.length : 0;
  const wherePopoverWide = isLocationResults;
  const wherePopoverWidthClass = wherePopoverWide
    ? "w-[calc(var(--radix-popover-trigger-width)*1.9)]"
    : "w-[200px]";
  if (whereOptionCountRef.current !== whereOptionCount) {
    whereOptionCountRef.current = whereOptionCount;
    whereOptionRefs.current = [];
  }

  const handleWhereKeyDown = (e: React.KeyboardEvent) => {
    if (!whereOpen || whereOptionCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = whereHighlightedIndex < whereOptionCount - 1 ? whereHighlightedIndex + 1 : 0;
      setWhereHighlightedIndex(next);
      whereOptionRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = whereHighlightedIndex <= 0 ? whereOptionCount - 1 : whereHighlightedIndex - 1;
      setWhereHighlightedIndex(prev);
      whereOptionRefs.current[prev]?.focus();
    } else if (e.key === "Enter" && whereHighlightedIndex >= 0 && locationResults[whereHighlightedIndex]) {
      e.preventDefault();
      const item = locationResults[whereHighlightedIndex];
      setSelectedLocation(item);
      setWhere(item.fullName);
      setLocationSearchQuery("");
      setWhereOpen(false);
      whereInputRef.current?.focus();
    }
  };

  const handleWhereOptionKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = index < whereOptionCount - 1 ? index + 1 : 0;
      setWhereHighlightedIndex(next);
      whereOptionRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = index <= 0 ? whereOptionCount - 1 : index - 1;
      setWhereHighlightedIndex(prev);
      whereOptionRefs.current[prev]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = locationResults[index];
      if (item) {
        setSelectedLocation(item);
        setWhere(item.fullName);
        setLocationSearchQuery("");
        setWhereOpen(false);
        whereInputRef.current?.focus();
      }
    }
  };

  return (
    <div className="rounded-[3rem] overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-shadow duration-300">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-stretch">
        {/* Where — user can type and select from list; no focus ring; on dismiss default to first suggestion */}
        <Popover open={whereOpen} onOpenChange={handleWhereOpenChange}>
          <PopoverAnchor asChild>
            <div
              ref={whereAnchorRef}
              role="combobox"
              aria-expanded={whereOpen}
              aria-haspopup="listbox"
              aria-label={content.hero.whereLabel}
              onClick={(e) => {
                e.preventDefault();
                whereInputRef.current?.focus();
              }}
              className="flex flex-1 min-w-0 flex items-center gap-3 pl-4 pr-3 py-3 lg:py-4 lg:min-h-[56px] bg-transparent hover:bg-muted/30 transition-colors rounded-none rounded-l-[2rem] cursor-text"
            >
              <MapPin className={iconClass} strokeWidth={iconStroke} />
              <input
                ref={whereInputRef}
                type="text"
                value={where}
                onChange={(e) => {
                  const value = e.target.value;
                  setWhere(value);
                  // Only trigger API search if 3 or more chars
                  if (value.trim().length >= 3) {
                    setLocationSearchQuery(value);
                  } else {
                    setLocationSearchQuery("");
                  }

                  if (value.trim().length > 0) {
                    setWhereOpen(true);
                  } else {
                    setWhereOpen(false);
                  }
                  requestAnimationFrame(() => whereInputRef.current?.focus());
                }}
                placeholder={content.hero.wherePlaceholder}
                autoComplete="off"
                onFocus={(e) => {
                  const el = e.target as HTMLInputElement;
                  const len = el.value.length;
                  el.setSelectionRange(len, len);
                  el.scrollLeft = el.scrollWidth;
                }}
                onClick={(e) => {
                  const el = e.currentTarget;
                  const len = el.value.length;
                  el.setSelectionRange(len, len);
                  el.scrollLeft = el.scrollWidth;
                }}
                onKeyDown={handleWhereKeyDown}
                className={cn(
                  "flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
                aria-autocomplete="list"
                aria-controls={whereOpen ? "where-listbox" : undefined}
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            className={cn(wherePopoverWidthClass, "p-0")}
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => {
              if (whereAnchorRef.current?.contains(e.target as Node)) {
                e.preventDefault();
              }
            }}
          >
            <ul
              id="where-listbox"
              role="listbox"
              className="max-h-[280px] overflow-auto py-2 divide-y divide-border"
              aria-label={content.hero.whereLabel}
            >
              {(locationLoading || (where.trim().length > 0 && where.trim().length < 3)) ? (
                <li className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground" role="status" aria-busy="true">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Searching…
                </li>
              ) : showEmptyState ? (
                <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                  No Results found.
                </li>
              ) : isLocationResults ? (
                locationResults.map((item, index) => (
                  <li
                    key={item.fullName + (item.referenceId ?? item.id ?? "")}
                    role="option"
                    aria-selected={whereHighlightedIndex === index}
                  >
                    <button
                      ref={(el) => {
                        (whereOptionRefs.current as (HTMLButtonElement | null)[])[index] = el;
                      }}
                      type="button"
                      className="w-full px-5 py-3.5 flex flex-col items-stretch gap-2 text-left text-sm hover:bg-muted/80 focus:bg-muted/80 focus:outline-none focus-visible:outline-none"
                      onClick={() => {
                        setSelectedLocation(item);
                        setWhere(item.fullName);
                        setLocationSearchQuery("");
                        setWhereOpen(false);
                      }}
                      onKeyDown={(e) => handleWhereOptionKeyDown(e, index)}
                    >
                      <span className="font-medium truncate min-w-0">{item.fullName}</span>
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        {item.type && (
                          <span className={getLocationTypeBadgeClass(item.type)}>
                            {item.type}
                          </span>
                        )}
                        {item.country && (
                          <span className="text-muted-foreground text-xs truncate">
                            {item.country}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                  Type to search for a destination
                </li>
              )}
            </ul>
          </PopoverContent>
        </Popover>

        <div
          className="hidden lg:block w-px bg-border flex-shrink-0 self-center min-h-[24px] my-2"
          aria-hidden
        />
        {/* When */}
        <Popover open={whenOpen} onOpenChange={setWhenOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex flex-1 min-w-0 flex items-center gap-3 pl-3 pr-3 py-3 lg:py-4 lg:min-h-[56px] bg-transparent hover:bg-muted/30 transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-none"
              aria-label={content.hero.whenLabel}
              aria-haspopup="dialog"
              aria-expanded={whenOpen}
            >
              <Calendar className={iconClass} strokeWidth={iconStroke} />
              <span
                className={cn(
                  "text-sm truncate flex-1 min-w-0",
                  dateRange?.from ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {whenLabel}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="center"
            sideOffset={8}
          >
            <CalendarUi
              mode="range"
              selected={dateRange}
              onSelect={(range, selectedDay) => {
                // Better range handling: if we have a From and valid To, resets.
                // If we select a day before From, it resets start.
                // Standard behavior + smart reset.
                if (dateRange?.from && dateRange?.to) {
                  setDateRange({ from: selectedDay, to: undefined });
                } else {
                  setDateRange(range);
                }
              }}
              numberOfMonths={2}
              defaultMonth={dateRange?.from ?? new Date()}
              disabled={disabledDates}
            // min={2} // Removing strict min enforcement here to allow user to pick dates freely, validation happens on Search
            />
          </PopoverContent>
        </Popover>

        <div
          className="hidden lg:block w-px bg-border flex-shrink-0 self-center min-h-[24px] my-2"
          aria-hidden
        />
        {/* Who */}
        <Popover open={whoOpen} onOpenChange={setWhoOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex flex-1 min-w-0 flex items-center gap-3 pl-3 pr-3 py-3 lg:py-4 lg:min-h-[56px] bg-transparent hover:bg-muted/30 transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-none"
              aria-label={content.hero.whoLabel}
              aria-haspopup="dialog"
              aria-expanded={whoOpen}
            >
              <Users className={iconClass} strokeWidth={iconStroke} />
              <span className="text-sm truncate flex-1 min-w-0 text-foreground">
                {whoLabel}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[320px] p-4"
            align="center"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col max-h-[60vh] overflow-hidden">
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
                {rooms.map((room, index) => {
                  const isExpanded = expandedRooms.has(index);
                  const guestCount = room.adults + room.childAges.length;
                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-border overflow-hidden shrink-0"
                    >
                      <button
                        type="button"
                        onClick={() => toggleRoomExpanded(index)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <BedDouble className="h-4 w-4 text-muted-foreground" />
                          {content.hero.roomLabel} {index + 1}
                          <span className="text-muted-foreground font-normal">
                            ({guestCount} {guestCount === 1 ? "guest" : "guests"})
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRoom(index);
                              }}
                              aria-label="Remove room"
                            >
                              <X className="h-3.5 w-3.5" strokeWidth={2} />
                            </Button>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border bg-muted/20">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              {content.hero.adultsLabel}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateRoomAdults(index, -1)}
                                disabled={room.adults <= 0}
                                aria-label={`Decrease ${content.hero.adultsLabel}`}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="w-6 text-center text-sm tabular-nums">
                                {room.adults}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateRoomAdults(index, 1)}
                                aria-label={`Increase ${content.hero.adultsLabel}`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Baby className="h-4 w-4" />
                                {content.hero.childrenLabel}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => addChild(index)}
                                aria-label={`Add ${content.hero.child}`}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add
                              </Button>
                            </div>
                            {room.childAges.length > 0 && (
                              <div className="space-y-2">
                                {room.childAges.map((age, childIdx) => (
                                  <div
                                    key={childIdx}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <span className="text-xs text-muted-foreground">
                                      {content.hero.child} {childIdx + 1} (age)
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() =>
                                          updateChildAge(index, childIdx, -1)
                                        }
                                        disabled={age <= 1}
                                        aria-label={`Decrease age for child ${childIdx + 1}`}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-5 text-center text-sm tabular-nums">
                                        {age}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() =>
                                          updateChildAge(index, childIdx, 1)
                                        }
                                        disabled={age >= 17}
                                        aria-label={`Increase age for child ${childIdx + 1}`}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeChild(index, childIdx)}
                                        aria-label={`Remove child ${childIdx + 1}`}
                                      >
                                        <X className="h-3.5 w-3.5" strokeWidth={2} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-center border border-dashed border-border shrink-0"
                  onClick={addRoom}
                >
                  {content.hero.addRoom}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* No divider between Who and Search — remove right border from Guest field */}
        {/* Search — circular, purple */}
        {/* Search — circular, purple */}
        <div className="flex items-center p-1 ml-2">
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            aria-label={content.hero.searchButton}
            disabled={searchLoading}
          >
            {searchLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" strokeWidth={2} aria-hidden />
            ) : (
              <Search className="h-7 w-7" strokeWidth={2.5} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
