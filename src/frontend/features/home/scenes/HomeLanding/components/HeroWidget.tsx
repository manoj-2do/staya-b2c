"use client";

import React, { useState, useRef } from "react";
import { MapPin, Calendar, Users, Search, Plus, Minus, Loader2 } from "lucide-react";
import { content } from "@/frontend/core/content";
import { dispatchOfflineActionToast } from "@/frontend/core/components/NetworkStatusBar";
import { Button } from "@/frontend/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/frontend/components/ui/popover";
import { Calendar as CalendarUi } from "@/frontend/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { format, startOfDay, addDays } from "date-fns";
import { cn } from "@/frontend/core/utils";
import type { LocationSearchResult } from "@/frontend/features/home/models/LocationSearch";
import { LocationType } from "@/frontend/features/home/models/LocationSearch";
import { useLocationSearch } from "@/frontend/features/home/hooks/useLocationSearch";

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

type Room = { adults: number; children: number };

export function HeroWidget() {
  const [whereOpen, setWhereOpen] = useState(false);
  const [whenOpen, setWhenOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);

  const [where, setWhere] = useState("");
  const whereInputRef = useRef<HTMLInputElement>(null);
  const whereAnchorRef = useRef<HTMLDivElement>(null);
  const whereOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const whereOptionCountRef = useRef(0);
  const [whereHighlightedIndex, setWhereHighlightedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const { results: locationResults, loading: locationLoading } = useLocationSearch(where, 300);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    DATE_PICKER_CONFIG.getDefaultRange
  );
  const [rooms, setRooms] = useState<Room[]>([{ adults: 1, children: 0 }]);

  /** Disable past dates when allowPastDates is false. Evaluated per render so "today" stays current. */
  const disabledDates = DATE_PICKER_CONFIG.allowPastDates
    ? undefined
    : { before: startOfDay(new Date()) };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      dispatchOfflineActionToast();
    }
  };

  const whenLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
      : dateRange?.from
        ? format(dateRange.from, "MMM d")
        : content.hero.whenPlaceholder;

  const totalGuests = rooms.reduce(
    (sum, r) => sum + r.adults + r.children,
    0
  );
  const roomCount = rooms.length;
  const whoLabel =
    roomCount === 0 && totalGuests === 0
      ? content.hero.whoPlaceholder
      : `${roomCount} ${roomCount === 1 ? "Room" : "Rooms"} | ${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"}`;

  const addRoom = () => {
    setRooms((prev) => [...prev, { adults: 1, children: 0 }]);
  };

  const updateRoom = (index: number, key: keyof Room, delta: number) => {
    setRooms((prev) => {
      const next = prev.map((r, i) => {
        if (i !== index) return r;
        if (key === "adults") {
          return { ...r, adults: Math.max(0, r.adults + delta) };
        }
        return { ...r, children: Math.max(0, r.children + delta) };
      });
      return next;
    });
  };

  /** On Where popover close: if they had picked a result, keep it; if dropdown was empty, clear the field (no default text). */
  const handleWhereOpenChange = (open: boolean) => {
    if (!open) {
      setWhereHighlightedIndex(-1);
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
        setWhereOpen(false);
        whereInputRef.current?.focus();
      }
    }
  };

  return (
    <div className="rounded-[2rem] overflow-hidden border border-border bg-card shadow-sm">
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
              {locationLoading ? (
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
              onSelect={setDateRange}
              numberOfMonths={2}
              defaultMonth={dateRange?.from ?? new Date()}
              disabled={disabledDates}
              min={MIN_DAYS_IN_RANGE}
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
          >
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col gap-3",
                    index > 0 && "pt-3 border-t border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {content.hero.roomLabel} {index + 1}
                    </span>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground h-8 text-xs"
                        onClick={() =>
                          setRooms((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      {content.hero.adultsLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateRoom(index, "adults", -1)}
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
                        onClick={() => updateRoom(index, "adults", 1)}
                        aria-label={`Increase ${content.hero.adultsLabel}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      {content.hero.childrenLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateRoom(index, "children", -1)}
                        disabled={room.children <= 0}
                        aria-label={`Decrease ${content.hero.childrenLabel}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums">
                        {room.children}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateRoom(index, "children", 1)}
                        aria-label={`Increase ${content.hero.childrenLabel}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-center border border-dashed border-border"
                onClick={addRoom}
              >
                {content.hero.addRoom}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* No divider between Who and Search — remove right border from Guest field */}
        {/* Search — circular, purple */}
        <div className="p-2 lg:pl-2 lg:pr-2 lg:py-2 flex items-center">
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label={content.hero.searchButton}
          >
            <Search className="h-5 w-5" strokeWidth={iconStroke} />
          </Button>
        </div>
      </form>
    </div>
  );
}
