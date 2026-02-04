"use client";

import React from "react";
import { content } from "@/frontend/core/content";

/**
 * Hero section — home data area. Hidden when list view is shown.
 */
export function HeroSection() {
  return (
    <section
      className="flex-1 flex flex-col items-center justify-center px-4 py-16"
      aria-label="Hero content"
    >
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {content.hero.headline}
      </h2>
      <p className="text-muted-foreground text-sm text-center max-w-md">
        {content.app.tagline}
      </p>
    </section>
  );
}
