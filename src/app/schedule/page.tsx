"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { useSocket } from "@/hooks/useSocket";
import { Download, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// ── Helper functions ──────────────────────────────────────────────────────────

function groupByStandard(schedules: any[]): Record<string, any[]> {
  return schedules.reduce((acc, s) => {
    if (!acc[s.standard]) acc[s.standard] = [];
    acc[s.standard].push(s);
    return acc;
  }, {} as Record<string, any[]>);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
  });
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// ── PDF Download ──────────────────────────────────────────────────────────────
function downloadSchedulePDF(standard: string, entries: any[]) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Schedule – ${standard}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; padding: 32px; }
        .header { border-bottom: 3px solid #2D31FA; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 28px; font-weight: 900; color: #2D31FA; letter-spacing: -0.5px; }
        .header p { font-size: 12px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .date-card { margin-bottom: 20px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .date-header { background: #f8f9ff; border-bottom: 1px solid #e5e7eb; padding: 10px 16px; }
        .date-header .date { font-size: 14px; font-weight: 800; color: #111; }
        .date-header .day { font-size: 10px; font-weight: 700; color: #2D31FA; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
        .slots { padding: 12px 16px; }
        .slot { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .slot:last-child { border-bottom: none; }
        .slot .subject { font-size: 13px; font-weight: 700; color: #111; }
        .slot .time { font-size: 12px; color: #666; font-weight: 500; }
        .footer { margin-top: 32px; font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 12px; }
        @media print { body { padding: 16px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Gurukul Classes</h1>
        <p>Lecture Schedule · ${standard}</p>
      </div>
      ${entries.map(entry => `
        <div class="date-card">
          <div class="date-header">
            <div class="date">${formatDate(entry.date)}</div>
            <div class="day">${entry.dayOfWeek}</div>
          </div>
          <div class="slots">
            ${entry.slots?.map((slot: any) => `
              <div class="slot">
                <span class="subject">${slot.subject}</span>
                <span class="time">${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}</span>
              </div>
            `).join("") || ""}
          </div>
        </div>
      `).join("")}
      <div class="footer">Generated from Gurukul Classes · gurukulclasses.in</div>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ── Page component ────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeStandard, setActiveStandard] = useState<string | null>(null);
  const { on, off } = useSocket();
  const { data: session } = useSession();
  const [myStandard, setMyStandard] = useState<string | null>(null);
  const [feePaid, setFeePaid] = useState<boolean | null>(null); // null = loading

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

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  // If logged in, fetch student's standard
  useEffect(() => {
    if (!session) { setFeePaid(false); return; }
    fetch("/api/student/me")
      .then(r => r.json())
      .then(d => {
        setMyStandard(d.standard || null);
        setFeePaid(d.feeStatus === "paid");
      })
      .catch(() => { setFeePaid(false); });
  }, [session]);

  useEffect(() => {
    const handler = () => fetchSchedules();
    on("schedules:updated", handler);
    return () => off("schedules:updated", handler);
  }, [on, off, fetchSchedules]);

  useEffect(() => {
    if (schedules.length > 0 && !activeStandard) {
      const standards = Object.keys(groupByStandard(schedules));
      // If student has a standard assigned, auto-select it
      if (myStandard && standards.includes(myStandard)) {
        setActiveStandard(myStandard);
      } else if (standards.length > 0) {
        setActiveStandard(standards[0]);
      }
    }
  }, [schedules, activeStandard, myStandard]);

  const grouped = groupByStandard(schedules);
  const allStandards = Object.keys(grouped).sort();

  // If student is logged in with a standard + fee paid → only show their standard
  const isStudentView = session && myStandard && feePaid;
  const standards = isStudentView ? [myStandard].filter(s => allStandards.includes(s)) : allStandards;
  const activeSchedules = activeStandard ? (grouped[activeStandard] ?? []) : [];

  return (
    <div className="min-h-screen bg-black pt-28 md:pt-40 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">

        {/* Page header */}
        <div className="mb-12 space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-[#2D31FA]/10 text-[#2D31FA] border-none tracking-[0.3em]">Timetable</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-black text-white tracking-tighter leading-[0.85] uppercase italic"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            LECTURE <span className="text-[#2D31FA]">SCHEDULE.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base font-bold text-white/40 max-w-lg"
          >
            Browse your class timetable by standard. Updated in real-time.
          </motion.p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-40">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#2D31FA] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center py-40">
            <p className="text-white/30 font-bold text-xl text-center">Unable to load schedules. Please try again later.</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && schedules.length === 0 && (
          <div className="flex items-center justify-center py-40">
            <p className="text-white/30 font-bold text-xl text-center">No schedule available yet. Check back soon.</p>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && schedules.length > 0 && (
          <>
            {/* Standard tabs — horizontal scroll on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="mb-6"
            >
              <div className="-mx-4 px-4 overflow-x-auto flex gap-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {standards.map(std => (
                  <button key={std} onClick={() => setActiveStandard(std)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
                      activeStandard === std
                        ? "bg-[#2D31FA] text-white shadow-[0_0_20px_-6px_rgba(45,49,250,0.6)]"
                        : "glass-pill text-white/50 hover:text-white"
                    }`}>
                    {std}
                  </button>
                ))}
              </div>
              {/* Show info if student view is restricted */}
              {isStudentView && (
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2 px-1 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Showing your standard only
                </p>
              )}
            </motion.div>

            {/* Download button for active standard */}
            {activeStandard && activeSchedules.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex justify-end mb-6"
              >
                <button
                  onClick={() => downloadSchedulePDF(activeStandard, activeSchedules)}
                  className="press flex items-center gap-2 px-4 py-2.5 rounded-xl glass-pill text-white/50 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-[#2D31FA]/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
              </motion.div>
            )}

            {/* Empty for selected standard */}
            {activeSchedules.length === 0 && (
              <div className="flex items-center justify-center py-32">
                <p className="text-white/30 font-bold text-xl text-center">No schedule available yet. Check back soon.</p>
              </div>
            )}

            {/* Date cards */}
            <div className="space-y-4">
              {activeSchedules.map((entry: any, i: number) => (
                <motion.div key={entry._id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.04] border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-white font-black text-base tracking-tight">{formatDate(entry.date)}</p>
                      <p className="text-[#2D31FA] text-[10px] font-black uppercase tracking-widest mt-0.5">{entry.dayOfWeek}</p>
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest flex-shrink-0">
                      {entry.slots?.length} lecture{entry.slots?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 mb-4" />
                  <div className="space-y-3">
                    {entry.slots?.map((slot: any, j: number) => (
                      <div key={j} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2D31FA] flex-shrink-0" />
                          <span className="text-white font-bold text-sm truncate">{slot.subject}</span>
                        </div>
                        <span className="text-white/50 text-xs font-medium whitespace-nowrap">
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
