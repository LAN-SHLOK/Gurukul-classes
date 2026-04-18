"use client";

import { AlertCircle } from "lucide-react";
import { memo } from "react";

interface ErrorStateProps {
  onRetry?: () => void;
}

const ErrorState = memo(function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <AlertCircle className="w-12 h-12 text-red-400/80" aria-hidden="true" />
      <div className="flex flex-col items-center gap-3">
        <p className="text-white/70 font-bold text-xl text-center max-w-md px-4">
          Failed to load schedule data
        </p>
        <p className="text-white/40 text-sm text-center max-w-md px-4">
          There was an error fetching the schedule. Please check your connection and try again.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-full bg-[#2D31FA] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#2D31FA]/90 hover:shadow-[0_0_24px_-4px_rgba(45,49,250,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2D31FA] focus:ring-offset-2 focus:ring-offset-black transform-gpu"
          aria-label="Retry loading schedule"
        >
          Retry
        </button>
      )}
    </div>
  );
});

export default ErrorState;
