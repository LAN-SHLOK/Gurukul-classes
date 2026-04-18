"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface LectureSlot {
  subject: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

interface ScheduleCardProps {
  date: string; // ISO date string
  dayOfWeek: string;
  slots: LectureSlot[];
  index: number; // For staggered animation
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const ScheduleCard = memo(function ScheduleCard({
  date,
  dayOfWeek,
  slots,
  index,
}: ScheduleCardProps) {
  const slotCount = slots?.length || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(45,49,250,0.15)] group"
    >
      {/* Date header */}
      <header className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-white font-black text-base tracking-tight group-hover:text-white transition-colors duration-300">
              {formatDate(date)}
            </h2>
            <p className="text-[#2D31FA] text-xs font-bold uppercase tracking-widest mt-0.5 group-hover:text-[#2D31FA]/80 transition-colors duration-300">
              {dayOfWeek}
            </p>
          </div>
          {slotCount > 0 && (
            <span className="text-white/40 text-xs font-medium whitespace-nowrap">
              {slotCount} {slotCount === 1 ? "lecture" : "lectures"}
            </span>
          )}
        </div>
      </header>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-4" />

      {/* Lecture slots */}
      {slotCount === 0 ? (
        <p className="text-white/30 text-sm font-medium text-center py-2">
          No lectures scheduled
        </p>
      ) : (
        <ul className="space-y-3">
          {slots.map((slot, j) => (
            <li key={j} className="flex items-center gap-3 group/item">
              {/* Visual indicator dot with glow effect */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#2D31FA] flex-shrink-0 group-hover/item:shadow-[0_0_8px_rgba(45,49,250,0.8)] transition-shadow duration-300" />
              
              <div className="flex items-center justify-between gap-4 flex-1 min-w-0">
                <span className="text-white font-bold text-sm truncate group-hover/item:text-white/90 transition-colors duration-200">
                  {slot.subject}
                </span>
                <time className="text-white/50 text-xs font-medium whitespace-nowrap tabular-nums group-hover/item:text-white/70 transition-colors duration-200">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
});

export default ScheduleCard;
