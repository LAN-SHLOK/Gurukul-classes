"use client";

import { CalendarX } from "lucide-react";
import { memo } from "react";

interface EmptyStateProps {
  standard?: string;
}

const EmptyState = memo(function EmptyState({ standard }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <CalendarX className="w-12 h-12 text-white/20" aria-hidden="true" />
      <p className="text-white/30 font-bold text-xl text-center max-w-md px-4">
        {standard
          ? `No schedule available yet for ${standard}. Check back soon.`
          : "No schedule available yet. Check back soon."}
      </p>
    </div>
  );
});

export default EmptyState;
