"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Users, Search, Menu } from "lucide-react";
import { content } from "@/frontend/core/content";
import { updateSearchPath } from "@/frontend/features/home/hooks/useSearchPath";

interface DockedSearchBarProps {
  where: string;
  dateRange: string;
  guestCount: number;
  roomCount: number;
  searchParams: string;
  /** When true, only render the center search bar (parent provides Logo + More) */
  centerOnly?: boolean;
}

export function DockedSearchBar({
  where,
  dateRange,
  guestCount,
  roomCount,
  centerOnly = false,
}: DockedSearchBarProps) {
  const whoLabel = `${roomCount} ${roomCount === 1 ? "Room" : "Rooms"} | ${guestCount} ${guestCount === 1 ? "Guest" : "Guests"}`;

  const searchBar = (
    <button
      type="button"
      onClick={() => updateSearchPath("/")}
      className="flex flex-1 min-w-0 max-w-[50vw] items-center gap-3 rounded-[2rem] overflow-hidden border border-border bg-card px-4 py-3 lg:py-4 min-h-[56px] shadow-sm hover:bg-muted/30 transition-colors text-left w-full"
    >
      <span className="flex items-center gap-2 min-w-0 flex-1">
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{where}</span>
      </span>
      <span className="hidden sm:flex items-center gap-2 shrink-0 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {dateRange}
      </span>
      <span className="hidden md:flex items-center gap-2 shrink-0 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        {whoLabel}
      </span>
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );

  if (centerOnly) {
    return <div className="w-full flex justify-center">{searchBar}</div>;
  }

  return (
    <div className="flex items-center gap-4 w-full">
      <Link href="/" className="focus:outline-none shrink-0">
        <Image
          src="/logo/logo.png"
          alt={content.app.name}
          width={40}
          height={40}
          className="h-10 w-auto object-contain"
        />
      </Link>
      {searchBar}
      <button type="button" className="shrink-0 rounded-full p-2 hover:bg-muted/80 transition-colors" aria-label={content.nav.moreMenuAria}>
        <Menu className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </button>
    </div>
  );
}
