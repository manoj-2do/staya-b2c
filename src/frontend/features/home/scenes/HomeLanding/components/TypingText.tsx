"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/frontend/core/utils";

interface TypingTextProps {
    words: string[];
    className?: string; // Class for the typing text itself
    cursorClassName?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseTime?: number;
}

export function TypingText({
    words,
    className,
    cursorClassName,
    typingSpeed = 150,
    deletingSpeed = 100,
    pauseTime = 2000,
}: TypingTextProps) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout2 = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(timeout2);
    }, []);

    useEffect(() => {
        if (index >= words.length) {
            // Loop back to start (shouldn't happen with % logic below but safe guard)
            setIndex(0);
            return;
        }

        const currentWord = words[index];

        if (subIndex === currentWord.length + 1 && !reverse) {
            // Word fully typed, pause before deleting
            const timeout = setTimeout(() => {
                setReverse(true);
            }, pauseTime);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            // Word fully deleted, move to next
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words, typingSpeed, deletingSpeed, pauseTime]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            {words[index].substring(0, subIndex)}
            <span
                className={cn(
                    "ml-1 w-[3px] h-[1em] bg-foreground block",
                    blink ? "opacity-100" : "opacity-0",
                    cursorClassName
                )}
            />
        </span>
    );
}
