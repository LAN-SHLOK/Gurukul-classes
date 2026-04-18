"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, ArrowLeft, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";

export default function ToppersPage() {
  const [toppers, setToppers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { on, off } = useSocket();

  const fetchToppers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/toppers");
      const data = await response.json();
      if (Array.isArray(data)) {
        setToppers(data);
      }
    } catch (error) {
      console.error("Failed to fetch toppers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToppers();
    on("toppers:updated", fetchToppers);
    return () => off("toppers:updated", fetchToppers);
  }, [fetchToppers, on, off]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,49,250,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/">
            <button className="press flex items-center gap-2 px-4 py-2 rounded-xl glass-pill text-white/50 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D31FA]">Wall of Fame</span>
            <div className="flex items-center gap-1.5">
              <span className="collab-dot" style={{ width: 6, height: 6 }} />
              <span className="text-[8px] font-black uppercase tracking-wider text-white/20">Live</span>
            </div>
          </div>
          <h1
            className="font-black tracking-tighter leading-[0.85] uppercase text-white mb-4"
            style={{ fontSize: "clamp(2.8rem, 8vw, 8rem)" }}
          >
            HALL OF<br />
            <span style={{ color: "#2D31FA" }}>ACHIEVERS.</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base font-medium max-w-2xl">
            Celebrating the excellence and dedication of our students who have achieved remarkable success in their academic pursuits.
          </p>
        </motion.div>

        {/* Stats banner */}
        {!loading && toppers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 p-6 rounded-2xl glass-card border border-[#2D31FA]/20"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2D31FA] flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{toppers.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Achievers</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-pill">
                <Sparkles className="w-3.5 h-3.5 text-[#2D31FA]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Excellence Since 2011</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#2D31FA] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Toppers grid */}
        {!loading && toppers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {toppers.map((topper, index) => (
              <motion.div
                key={topper._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10 press h-full flex flex-col">
                  {/* Trophy badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="w-9 h-9 rounded-xl bg-[#2D31FA] flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Image section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={topper.image}
                      alt={topper.name}
                      className="w-full h-full object-cover grayscale-[40%]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.opacity = "0";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    {/* Score overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-[#2D31FA] text-white text-[8px] font-black uppercase tracking-widest">
                          Class of {topper.year}
                        </span>
                      </div>
                      <p className="text-3xl font-black text-white tracking-tighter uppercase italic mb-1">
                        {topper.score}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2D31FA]">
                        {topper.exam}
                      </p>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      {topper.name}
                    </h3>
                    
                    {topper.achievement && (
                      <p className="text-[11px] text-white/40 italic line-clamp-3 flex-1">
                        &quot;{topper.achievement}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-[#2D31FA] pt-2 border-t border-white/5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Platinum Achiever
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && toppers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 text-sm font-medium">No achievers to display yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
