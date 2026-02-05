"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { content } from "@/frontend/core/content";
import { assets } from "@/frontend/core/assets";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/core/utils";
import { HeroWidget, type HeroWidgetInitialValues } from "./HeroWidget";
import { updateSearchPath } from "@/frontend/features/home/hooks/useSearchPath";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover";
import { SupportMenuContent } from "./SupportMenuContent";

// ... (existing imports and component implementation)

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
      className="focus:outline-none"
      aria-label="Go to Home"
    >
      <Image
        src="/logo/logo.png"
        alt={content.app.name}
        width={120}
        height={120}
        className="h-10 w-auto object-contain"
        priority
      />
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
    <header className="sticky top-0 z-40 border-b border-white/20 bg-gray-50/80 backdrop-blur-md shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 w-full min-h-[56px]">
          {/* Logo */}
          <div className="self-start pt-0.5 transform transition-transform hover:scale-105 origin-left">
            <Logo />
          </div>

          <div className="flex-1 min-w-0 flex justify-center items-center">
            {/* ... (existing nav logic) ... */}
            <div className={cn("w-full max-w-[50vw] flex flex-col", showTabs ? "gap-4" : "gap-0")}>
              <nav
                className={cn(
                  "flex items-end justify-center gap-3.5 transition-all duration-500 ease-in-out overflow-hidden",
                  showTabs ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
                )}
                aria-label={content.nav.travelCategoriesAriaLabel}
                aria-hidden={!showTabs}
              >
                {/* ... (existing nav buttons) ... */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1 relative h-auto font-medium text-base text-foreground hover:bg-muted/50 hover:text-foreground flex flex-row items-center justify-end pb-2.5 pt-2 pl-1 pr-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:block after:h-1 after:rounded-full after:bg-primary after:content-['']"
                  aria-current="page"
                  onClick={() => updateSearchPath("/")}
                  tabIndex={showTabs ? 0 : -1}
                >
                  <Image src={assets.icons.hotel} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain" />
                  <span className="hidden sm:inline text-sm">{content.nav.hotels}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto font-medium text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-end pb-2.5 pt-2 disabled:opacity-80 inline-flex flex-row items-center gap-1 pl-1 pr-4 relative min-w-[120px]"
                  disabled
                  aria-label={content.nav.flightsComingSoonAria}
                  tabIndex={-1}
                >
                  <Image src={assets.icons.flight} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain opacity-50 grayscale" />
                  <span className="hidden sm:inline text-sm text-muted-foreground/70">{content.nav.flights}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto font-medium text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground flex flex-col items-center justify-end pb-2.5 pt-2 disabled:opacity-80 inline-flex flex-row items-center gap-1 pl-1 pr-4 relative min-w-[120px]"
                  disabled
                  aria-label={content.nav.holidaysComingSoonAria}
                  tabIndex={-1}
                >
                  <Image src={assets.icons.holidays} alt="" width={navIconSize} height={navIconSize} className="shrink-0 object-contain opacity-50 grayscale" />
                  <span className="hidden sm:inline text-sm text-muted-foreground/70">{content.nav.holidays}</span>
                </Button>
              </nav>
              <div className="w-full">
                <HeroWidget key={isResultsView ? "results" : "home"} initialValues={heroInitialValues} />
              </div>
            </div>
          </div>

          <div className="self-start pt-0.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-muted-foreground bg-slate-200 hover:bg-slate-300 hover:text-foreground shrink-0 transition-colors"
                  aria-label={content.nav.moreMenuAria}
                >
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
                <SupportMenuContent />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
