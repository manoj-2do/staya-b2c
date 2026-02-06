import { cn } from "@/lib/utils/cn";

export function HotelCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm w-full h-full",
        className
      )}
    >
      {/* Image Area - Aspect 4/3 - Static Grey */}
      <div className="relative aspect-[4/3] bg-gray-200 w-full" />

      <div className="flex flex-1 flex-col p-3 gap-2">
        <div className="space-y-3">
          {/* Title Row */}
          <div className="flex justify-between items-start gap-2">
            <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
            <div className="h-4 w-8 bg-gray-200 rounded-full shrink-0" />
          </div>

          {/* Subtitle/Location */}
          <div className="h-4 w-1/2 bg-gray-200 rounded-full" />

          {/* Date */}
          <div className="h-4 w-1/3 bg-gray-200 rounded-full mt-1" />
        </div>

        {/* Footer: Price and Icons */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />

          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
