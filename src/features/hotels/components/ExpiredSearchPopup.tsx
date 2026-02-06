"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";

interface ExpiredSearchPopupProps {
  open: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
}

export function ExpiredSearchPopup({
  open,
  onDismiss,
  title = "Search expired",
  message = "This search has expired. Please perform a new search.",
}: ExpiredSearchPopupProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expired-popup-title"
    >
      <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="expired-popup-title"
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={onDismiss}>
            {content.nav.bookNow}
          </Button>
        </div>
      </div>
    </div>
  );
}
