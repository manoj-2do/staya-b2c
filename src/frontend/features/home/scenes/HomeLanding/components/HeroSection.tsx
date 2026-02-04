"use client";

import React from "react";
import { content } from "@/frontend/core/content";

/**
 * Hero section — home data area. Hidden when list view is shown.
 */
export function HeroSection() {
  return (
    <section
      className="flex-1 flex flex-col px-4 sm:px-6 py-12 max-w-7xl mx-auto w-full gap-16"
      aria-label="Hero content"
    >
      {/* <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-backwards delay-100">
        <h2 className="text-2xl font-semibold text-foreground">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Goa", "Mumbai", "Jaipur", "Kerala"].map((city) => (
            <div key={city} className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer">
              <img
                src={`https://source.unsplash.com/800x600/?${city.toLowerCase()},travel`}
                alt={city}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-medium text-lg">{city}</span>
            </div>
          ))}
        </div>
      </div> */}

      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-backwards delay-200">
        <h2 className="text-2xl font-semibold text-foreground">Exclusive Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-8 text-white flex flex-col justify-center items-start shadow-lg">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-4 backdrop-blur-sm">Limited Time</span>
            <h3 className="text-3xl font-bold mb-2">Summer Sale</h3>
            <p className="text-white/90 mb-6 max-w-sm">Get up to 25% off on your first booking with Staya.</p>
            <button className="px-6 py-2.5 bg-white text-violet-600 rounded-full font-medium hover:bg-white/90 transition-colors">
              Book Now
            </button>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white flex flex-col justify-center items-start shadow-lg">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-4 backdrop-blur-sm">New User</span>
            <h3 className="text-3xl font-bold mb-2">Travel More</h3>
            <p className="text-white/90 mb-6 max-w-sm">Earn double rewards points on all weekend stays.</p>
            <button className="px-6 py-2.5 bg-white text-blue-600 rounded-full font-medium hover:bg-white/90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
