"use client";

import React from "react";
import { Plane } from "lucide-react";
import { content } from "@/frontend/core/content";

/**
 * Flights list view — placeholder. Shown when flights search is performed.
 */
export function FlightsListView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
      <Plane className="h-12 w-12 text-muted-foreground/50" />
      <h2 className="text-lg font-semibold text-foreground">
        {content.nav.flights} — Coming soon
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Flights search will be available soon.
      </p>
    </div>
  );
}
