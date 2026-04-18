"use client";

import { memo } from "react";

const LoadingState = memo(function LoadingState() {
  return (
    <div className="flex items-center justify-center py-40">
      <div className="flex gap-2" role="status" aria-label="Loading schedules">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#2D31FA] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Loading schedules...</span>
      </div>
    </div>
  );
});

export default LoadingState;
