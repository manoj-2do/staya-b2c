"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/frontend/core/utils";

interface PageLoaderProps {
    text?: string;
    fullScreen?: boolean;
}

export function PageLoader({ text = "Loading hotel details...", fullScreen = true }: PageLoaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center bg-background z-50",
                fullScreen ? "fixed inset-0" : "flex-1 min-h-[400px]"
            )}
        >
            {/* Top Progress Bar - Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 overflow-hidden">
                <div className="h-full bg-primary animate-progress-indeterminate origin-left" />
            </div>

            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                </div>

                {text && (
                    <div className="overflow-hidden h-8">
                        <p className="text-lg font-medium text-muted-foreground animate-pulse text-center">
                            {text}
                        </p>
                    </div>
                )}
            </div>

            <style jsx global>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.5); }
          100% { transform: translateX(100%) scaleX(0.2); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
      `}</style>
        </div>
    );
}

export function SectionLoader({ height = "400px" }: { height?: string }) {
    return (
        <div
            className="w-full bg-gray-50 animate-pulse rounded-xl flex items-center justify-center border border-gray-100"
            style={{ height }}
        >
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
    );
}
