"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";

interface StandardSelectorProps {
  standards: string[];
  activeStandard: string | null;
  onSelect: (standard: string) => void;
  isRestricted?: boolean;
}

const StandardSelector = memo(function StandardSelector({
  standards,
  activeStandard,
  onSelect,
  isRestricted = false,
}: StandardSelectorProps) {
  const router = useRouter();

  const handleSelect = (standard: string) => {
    if (isRestricted) return;
    onSelect(standard);
    // Navigate to the selected standard
    const slug = standard.toLowerCase().replace(/\s+/g, "-");
    router.push(`/schedule/${slug}`);
  };

  if (standards.length === 0) {
    return (
      <div className="text-white/30 text-sm font-bold text-center py-4">
        No standards available
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        role="tablist"
        aria-label="Select class standard"
        className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {standards.map((standard) => {
          const isActive = activeStandard === standard;
          return (
            <button
              key={standard}
              role="tab"
              aria-selected={isActive}
              aria-controls={`schedule-${standard}`}
              onClick={() => handleSelect(standard)}
              disabled={isRestricted && !isActive}
              className={`
                px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest
                transition-all duration-300 whitespace-nowrap flex-shrink-0
                transform-gpu
                ${
                  isActive
                    ? "bg-[#2D31FA] text-white shadow-[0_0_20px_-6px_rgba(45,49,250,0.6)] scale-105"
                    : "glass-pill text-white/50 hover:text-white hover:bg-white/[0.08] hover:scale-105 hover:shadow-[0_0_16px_-8px_rgba(255,255,255,0.3)]"
                }
                ${isRestricted && !isActive ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95"}
                focus:outline-none focus:ring-2 focus:ring-[#2D31FA] focus:ring-offset-2 focus:ring-offset-black
              `}
            >
              {standard}
            </button>
          );
        })}
      </div>
      {isRestricted && (
        <p className="text-white/30 text-xs font-medium mt-3 text-center">
          You can only view your enrolled standard&apos;s schedule
        </p>
      )}
    </div>
  );
});

export default StandardSelector;
