"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface SearchProgressBarProps {
    loading: boolean;
    className?: string; // Allow minimal styling override
}

export function SearchProgressBar({ loading, className }: SearchProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (loading) {
            setIsVisible(true);
            setProgress(0);
            // Start slightly delayed to allow UI render
            const startTimeout = setTimeout(() => {
                setProgress(15); // Jump start
            }, 50);

            // Smoothly increment to 90%
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    // Logarithmic-ish slowdown: add less as we get closer to 90
                    const remaining = 90 - prev;
                    const step = Math.max(0.5, remaining / 20);
                    return prev + step;
                });
            }, 100);

            return () => {
                clearTimeout(startTimeout);
                clearInterval(interval);
            };
        } else {
            // When loading finishes, go to 100% then hide
            if (isVisible) {
                setProgress(100);
                const hideTimeout = setTimeout(() => {
                    setIsVisible(false);
                    setProgress(0);
                }, 500); // Wait for transition to finish before hiding
                return () => clearTimeout(hideTimeout);
            }
        }
    }, [loading, isVisible]);

    if (!isVisible && progress === 0) return null;

    return (
        <div
            className={cn(
                "h-1 w-full bg-muted/30 overflow-hidden relative",
                className
            )}
            aria-hidden="true"
        >
            <div
                className="h-full bg-primary transition-all ease-out"
                style={{
                    width: `${progress}%`,
                    transitionDuration: loading ? "300ms" : "500ms",
                }}
            />
        </div>
    );
}
