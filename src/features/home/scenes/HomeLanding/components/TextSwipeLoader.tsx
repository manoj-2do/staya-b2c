import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

const MESSAGES = [
    "Curating best hotels...",
    "Checking real-time availability...",
    "Finding exclusive deals...",
    "Almost there...",
];

export function TextSwipeLoader() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Determine the total duration of one cycle in ms
        // The CSS animation duration is 2s. We want to switch text exactly when it fades out.
        // However, with CSS animation iterating, we need to sync React state update.
        // To make it simpler, we just render the *current* message and let it animate once, 
        // but React re-render triggers new animation? No, key change does.

        // Strategy: We change the `key` of the text element every 2s.
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 2000); // Sync with CSS animation duration

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[50vh]">
            <div className="h-8 overflow-hidden relative w-full max-w-md text-center">
                <p
                    key={index} // Force re-mount to re-trigger animation
                    className="text-lg font-medium text-foreground animate-swipe-up absolute inset-0 flex items-center justify-center"
                >
                    {MESSAGES[index]}
                </p>
            </div>
        </div>
    );
}
