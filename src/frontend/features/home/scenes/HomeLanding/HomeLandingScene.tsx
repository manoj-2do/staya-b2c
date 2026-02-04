import React from "react";
import { HomeHeader } from "./components/HomeHeader";

export function HomeLandingScene() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomeHeader />

      {/* 3. Page body — empty/minimal for now (CURRENT_FOCUS: no hero image, no promotional sections) */}
      <main className="flex-1" aria-label="Page content">
        {/* Focus is header + search only; body left minimal */}
      </main>
    </div>
  );
}
