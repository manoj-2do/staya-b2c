"use client";

import React from "react";
import { content } from "@/frontend/core/content";
import { TypingText } from "./TypingText";

/**
 * Hero section — home data area. Hidden when list view is shown.
 */
export function HeroSection() {
  return (
    <section
      className="flex-1 flex flex-col px-4 sm:px-6 py-12 max-w-7xl mx-auto w-full gap-16"
      aria-label="Hero content"
    >

      <div className="flex flex-col items-center justify-center text-center py-20 gap-0 animate-in fade-in zoom-in duration-700 font-koulen leading-[0.7]">
        {/* Line 1: BOOK + Animation */}
        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 text-6xl sm:text-7xl md:text-8xl tracking-tight uppercase items-baseline">
          <h1 className="font-normal text-foreground">
            BOOK
          </h1>
          <div className="font-normal text-primary min-w-[5ch] text-left">
            <TypingText
              words={["HOTELS", "FLIGHTS", "HOLIDAYS"]}
              typingSpeed={120}
              deletingSpeed={60}
              pauseTime={2000}
              cursorClassName="bg-primary h-[0.75em] w-[8px] ml-2"
            />
          </div>
        </div>

        {/* Line 2: IN A + Logo */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2 text-6xl sm:text-7xl md:text-8xl tracking-tight uppercase">
          <h1 className="font-normal text-foreground">
            IN A
          </h1>

          <img src="/logo/logo.png" className="h-[1.1em] w-auto object-contain" alt="Snap Logo" />
        </div>
      </div>
    </section>
  );
}
