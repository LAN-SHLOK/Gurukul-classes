"use client";

import { use, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import StandardSelector from "@/components/schedule/StandardSelector";
import LoadingState from "@/components/schedule/LoadingState";
import EmptyState from "@/components/schedule/EmptyState";
import ErrorState from "@/components/schedule/ErrorState";

// ── Helper functions ──────────────────────────────────────────────────────────

function groupByStandard(schedules: any[]): Record<string, any[]> {
  return schedules.reduce((acc, s) => {
    if (!acc[s.standard]) acc[s.standard] = [];
    acc[s.standard].push(s);
    return acc;
  }, {} as Record<string, any[]>);
}

function slugToStandard(slug: string, standards: string[]): string | null {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");
  return standards.find((s) => s.toLowerCase() === decoded.toLowerCase()) ?? null;
}

// ── Page component ────────────────────────────────────────────────────────────

export default function StandardSchedulePage({
  params,
}: {
  params: Promise<{ standard: string }>;
}) {
  const { standard: slug } = use(params);

  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [myStandard, setMyStandard] = useState<string | null>(null);
  const [feePaid, setFeePaid] = useState(false);

  const { on, off } = useSocket();
  const { data: session } = useSession();

  // Fetch student's own standard if logged in
  useEffect(() => {
    if (!session) return;
    fetch("/api/student/me")
      .then(r => r.json())
      .then(d => { setMyStandard(d.standard || null); setFeePaid(d.feeStatus === "paid"); })
      .catch(() => {});
  }, [session]);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/schedules");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    const handler = () => fetchSchedules();
    on("schedules:updated", handler);
    return () => off("schedules:updated", handler);
  }, [on, off, fetchSchedules]);

  const grouped = groupByStandard(schedules);
  const standards = Object.keys(grouped);
  const matchedStandard = loading ? null : slugToStandard(slug, standards);
  const entries = matchedStandard ? (grouped[matchedStandard] ?? []) : [];

  // Block logged-in fee-paid students from viewing other standards
  const isBlocked = session && feePaid && myStandard && matchedStandard && myStandard !== matchedStandard;
  
  // Determine if standard selector should be restricted
  const isRestricted = !!(session && feePaid && myStandard !== null);

  // Handler for standard selection
  const handleStandardSelect = () => {
    // Navigation is handled inside StandardSelector component
  };

  return (
    <div className="min-h-screen bg-black pt-28 md:pt-40 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">

        {/* Back link with enhanced hover effects */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <Link 
            href="/schedule" 
            className="group inline-flex items-center gap-2 text-white/40 hover:text-white font-bold text-sm tracking-wide transition-all duration-300 hover:gap-3"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="relative">
              All Schedules
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#2D31FA] transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </motion.div>

        {/* Access blocked for students viewing wrong standard */}
        {isBlocked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-32 gap-4 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
            >
              <Lock className="w-7 h-7 text-red-400" />
            </motion.div>
            <h2 className="text-2xl font-black text-white tracking-tighter">Access Restricted</h2>
            <p className="text-white/40 font-medium max-w-xs">
              You are enrolled in <span className="text-[#2D31FA] font-black">{myStandard}</span>. You can only view your own standard&apos;s schedule.
            </p>
            <Link 
              href={`/schedule/${myStandard!.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-6 py-3 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest hover:bg-[#2D31FA]/90 hover:shadow-[0_0_24px_-4px_rgba(45,49,250,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Go to My Schedule
            </Link>
          </motion.div>
        )}

        {!isBlocked && loading && <LoadingState />}

        {/* Error state */}
        {!isBlocked && !loading && error && <ErrorState onRetry={fetchSchedules} />}

        {/* Standard not found */}
        {!isBlocked && !loading && !error && !matchedStandard && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-40 gap-4"
          >
            <p className="text-white/30 font-bold text-xl tracking-tight text-center">
              Standard not found.{" "}
              <Link 
                href="/schedule" 
                className="text-[#2D31FA] hover:text-[#2D31FA]/80 transition-colors duration-200 underline decoration-[#2D31FA]/30 hover:decoration-[#2D31FA] underline-offset-4"
              >
                View all schedules.
              </Link>
            </p>
          </motion.div>
        )}

        {/* Main content */}
        {!loading && !error && matchedStandard && (
          <>
            {/* Standard Selector with enhanced transitions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <StandardSelector
                standards={standards}
                activeStandard={matchedStandard}
                onSelect={handleStandardSelect}
                isRestricted={isRestricted}
              />
            </motion.div>

            {/* Page header with enhanced animations */}
            <div className="mb-16 space-y-5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Badge className="bg-[#2D31FA]/10 text-[#2D31FA] border-none tracking-[0.3em] hover:bg-[#2D31FA]/20 transition-colors duration-300">
                  Timetable
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-white tracking-tighter leading-[0.85] uppercase italic"
                style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
              >
                {matchedStandard}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg font-bold text-white/40 max-w-lg"
              >
                Lecture schedule updated in real-time.
              </motion.p>
            </div>

            {/* Empty state */}
            {entries.length === 0 && <EmptyState standard={matchedStandard} />}

            {/* Date cards */}
            <div className="space-y-4">
              {entries.map((entry: any, i: number) => (
                <ScheduleCard
                  key={entry._id}
                  date={entry.date}
                  dayOfWeek={entry.dayOfWeek}
                  slots={entry.slots || []}
                  index={i}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
