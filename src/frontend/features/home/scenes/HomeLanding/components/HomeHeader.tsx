"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { content } from "@/frontend/core/content";
import { assets } from "@/frontend/core/assets";
import { Button } from "@/frontend/components/ui/button";
import { HeroWidget, type HeroWidgetInitialValues } from "./HeroWidget";
import { updateSearchPath } from "@/frontend/features/home/hooks/useSearchPath";

const navIconSize = 35;

interface HomeHeaderProps {
  isResultsView?: boolean;
  heroInitialValues?: HeroWidgetInitialValues;
}

/** Logo — left side, always visible. Uses updateSearchPath to avoid full navigation. */
function Logo() {
  return (
    <button
      type="button"
      onClick={() => updateSearchPath("/")}
      className="text-xl font-black italic text-foreground tracking-tighter hover:opacity-80 transition-opacity shrink-0 text-left"
    >
      {content.app.name}
    </button>
  );
}

export function HomeHeader({
  isResultsView = false,
  heroInitialValues,
}: HomeHeaderProps) {
  const [showTabs, setShowTabs] = useState(true);

  useEffect(() => {
    if (isResultsView) setShowTabs(false);
    else setShowTabs(true);
  }, [isResultsView]);

  useEffect(() => {
    const handleSearchStart = () => setShowTabs(false);
    window.addEventListener("staya:hotel-search-start", handleSearchStart);
    return () => window.removeEventListener("staya:hotel-search-start", handleSearchStart);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-neutral-50/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Logo (left, top-aligned) | Center | More (right) */}
        <div className="flex items-center gap-4 w-full min-h-[56px]">
          <div className="self-start pt-0.5">
            <Logo />
          </div>

          <div className="flex-1 min-w-0 flex justify-center items-center">
            <div className="w-full max-w-[50vw] flex flex-col gap-4">
              {showTabs && (
                <nav
                  className="flex items-end justify-center gap-3.5 transition-opacity duration-300"
                  aria-label={content.nav.travelCategoriesAriaLabel}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 relative h-auto font-medium text-base text-foreground hover:bg-muted/50 hover:text-foreground flex flex-row items-center justify-end pb-2.5 pt-2 pl-1 pr-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:block after:h-1 after:rounded-full after:bg-primary after:content-['']"
                    aria-current="page"
                    onClick={() => updateSearchPath("/")}
                  >
                    <Image src={assets.icons.hotel} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain" />
                    <span className="hidden sm:inline text-sm">{content.nav.hotels}</span>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-auto font-medium text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-end pb-2.5 pt-2 disabled:opacity-50 inline-flex flex-row items-center gap-1 pl-1 pr-4" disabled aria-label={content.nav.flightsComingSoonAria}>
                    <Image src={assets.icons.flight} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain opacity-80" />
                    <span className="hidden sm:inline text-sm">{content.nav.flights}</span>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-auto font-medium text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-end pb-2.5 pt-2 disabled:opacity-50 inline-flex flex-row items-center gap-1 pl-1 pr-4" disabled aria-label={content.nav.holidaysComingSoonAria}>
                    <Image src={assets.icons.holidays} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain opacity-80" />
                    <span className="hidden sm:inline text-sm">{content.nav.holidays}</span>
                  </Button>
                </nav>
              )}
              <div className="w-full">
                <HeroWidget key={isResultsView ? "results" : "home"} initialValues={heroInitialValues} />
              </div>
            </div>
          </div>

          <div className="self-start pt-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 shrink-0"
              aria-label={content.nav.moreMenuAria}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
