import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, PhoneCall } from "lucide-react";
import { content } from "../../../../../lib/content";
import { assets } from "../../../../../lib/assets";
import { Button } from "@/components/ui/button";
import { HeroWidget } from "./HeroWidget";

const navIconSize = 35;

function Logo() {
  return (
    <Link
      href="/"
      className="text-xl font-black italic text-foreground tracking-tighter hover:opacity-80 transition-opacity"
    >
      {content.app.name}
    </Link>
  );
}

export function HomeHeader() {
  return (
    <header className="border-b border-border bg-neutral-50/90 shadow-sm pb-6">
      {/* 1. Navigation row — category tabs; reduced top/bottom padding */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 pt-3 pb-0">
        <Logo />

        <nav
          className="flex items-end gap-3.5"
          aria-label={content.nav.travelCategoriesAriaLabel}
        >
            <Button asChild variant="ghost" size="sm" className="gap-1 relative h-auto font-medium text-base text-foreground hover:bg-muted/50 hover:text-foreground flex flex-row items-center justify-end pb-2.5 pt-2 pl-1 pr-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:block after:h-1 after:rounded-full after:bg-primary after:content-['']" aria-current="page">
              <Link href="/" className="flex items-center justify-end w-full">
                <Image src={assets.icons.hotel} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain" />
                <span className="hidden sm:inline text-sm">{content.nav.hotels}</span>
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto font-medium text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-end pb-2.5 pt-2 disabled:opacity-50 inline-flex flex-row items-center gap-1 pl-1 pr-4"
              disabled
              aria-label={content.nav.flightsComingSoonAria}
            >
              <Image src={assets.icons.flight} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain opacity-80" />
              <span className="hidden sm:inline text-sm">{content.nav.flights}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto font-medium text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-end pb-2.5 pt-2 disabled:opacity-50 inline-flex flex-row items-center gap-1 pl-1 pr-4"
              disabled
              aria-label={content.nav.holidaysComingSoonAria}
            >
              <Image src={assets.icons.holidays} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain opacity-80" />
              <span className="hidden sm:inline text-sm">{content.nav.holidays}</span>
            </Button>
          </nav>

          <div className="flex items-center gap-1.5 pb-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80"
              aria-label={content.nav.moreMenuAria}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </Button>

          </div>
      </div>

      {/* 2. Search widget row — max 50vw width, centered; spacing below tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
        <div className="w-full max-w-[50vw] mx-auto">
          <HeroWidget />
        </div>
      </div>
    </header>
  );
}
