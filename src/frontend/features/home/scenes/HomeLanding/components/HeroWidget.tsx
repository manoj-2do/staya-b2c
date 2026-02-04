"use client";

import React, { useState, useRef } from "react";
import { MapPin, Calendar, Users, Search, Plus, Minus } from "lucide-react";
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
  const whoLabel =
    totalGuests === 0
      ? content.hero.whoPlaceholder
      : totalGuests === 1
        ? "1 Guest"
        : `${totalGuests} Guests`;

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

  /** On Where popover close without selection: default to first suggestion. */
  const handleWhereOpenChange = (open: boolean) => {
    if (!open) {
      const first = content.hero.whereSuggestions[0];
      if (first) setWhere(first);
    }
    setWhereOpen(open);
  };

  return (
    <div className="rounded-[2rem] overflow-hidden border border-border bg-card shadow-sm">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-stretch">
        {/* Where — user can type and select from list; no focus ring; on dismiss default to first suggestion */}
        <Popover open={whereOpen} onOpenChange={handleWhereOpenChange}>
          <PopoverAnchor asChild>
            <div
              role="combobox"
              aria-expanded={whereOpen}
              aria-haspopup="listbox"
              aria-label={content.hero.whereLabel}
              onClick={() => whereInputRef.current?.focus()}
              className="flex flex-1 min-w-0 flex items-center gap-3 pl-4 pr-3 py-3 lg:py-4 lg:min-h-[56px] bg-transparent hover:bg-muted/30 transition-colors rounded-none rounded-l-[2rem] cursor-text"
            >
              <MapPin className={iconClass} strokeWidth={iconStroke} />
              <input
                ref={whereInputRef}
                type="text"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                onFocus={() => setWhereOpen(true)}
                placeholder={content.hero.wherePlaceholder}
                className={cn(
                  "flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
                aria-autocomplete="list"
                aria-controls={whereOpen ? "where-listbox" : undefined}
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            sideOffset={8}
          >
            <ul
              id="where-listbox"
              role="listbox"
              className="max-h-[280px] overflow-auto py-2"
              aria-label={content.hero.whereLabel}
            >
              {content.hero.whereSuggestions.map((suggestion) => (
                <li key={suggestion} role="option">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/80 focus:bg-muted/80 outline-none"
                    onClick={() => {
                      setWhere(suggestion);
                      setWhereOpen(false);
                    }}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
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
            align="start"
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
            align="start"
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
