"use client";

import React from "react";
import { Package } from "lucide-react";
import { content } from "@/frontend/core/content";

/**
 * Packages list view — placeholder. Shown when packages search is performed.
 */
export function PackagesListView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
      <Package className="h-12 w-12 text-muted-foreground/50" />
      <h2 className="text-lg font-semibold text-foreground">
        {content.nav.holidays} — Coming soon
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Holiday packages search will be available soon.
      </p>
    </div>
  );
}
