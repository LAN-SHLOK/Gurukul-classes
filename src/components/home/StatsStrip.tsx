"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { annotate } from "rough-notation";
// @ts-ignore
import Atropos from "atropos/react";
import "atropos/css";
import { useSocket } from "@/hooks/useSocket";

const LOADING_STATS = [
  { value: "...", label: "Students Enrolled" },
  { value: "...", label: "Expert Faculty"    },
  { value: "...", label: "Result Rate"       },
  { value: "12+", label: "Years of Legacy"  },
];

function StatCard({ value, label, delay, index }: {
  value: string; label: string; delay: number; index: number;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const annotated = useRef(false);
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (!valueRef.current || annotated.current || value === "...") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !annotated.current) {
        annotated.current = true;
        const ann = annotate(valueRef.current!, {
          type: "underline",
          color: "#2D31FA",
          strokeWidth: 3,
          animationDuration: 800,
        });
        ann.show();
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(valueRef.current);
    return () => observer.disconnect();
  }, [value]);

  const mobileCard = (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative neuro-card-dark rounded-[28px] p-5 text-center overflow-hidden press micro-glow"
    >
      {/* Glassmorphic glow accent */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          background: index % 2 === 0
            ? "radial-gradient(ellipse at 50% 0%, rgba(45,49,250,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 100%, rgba(129,140,248,0.08) 0%, transparent 70%)"
        }}
      />

      {/* Real-time collab dot — top right */}
      <div className="absolute top-3 right-3">
        <div className="collab-dot" style={{ width: 6, height: 6 }} />
      </div>

      {/* Value with rough-notation */}
      <p className="text-3xl font-black text-white tracking-tighter mb-1">
        <span ref={valueRef}>{value}</span>
      </p>
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/35">{label}</p>
    </motion.div>
  );

  const desktopCard = (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 text-center backdrop-blur-xl hover:bg-white/10 transition-colors duration-500 cursor-default">
      <p className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-3">
        <span ref={valueRef}>{value}</span>
      </p>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</p>
    </div>
  );

  if (isTouch) return mobileCard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Atropos className="rounded-[40px]" activeOffset={20} shadowScale={1.02} rotateXMax={8} rotateYMax={8}>
        {desktopCard}
      </Atropos>
    </motion.div>
  );
}

export default function StatsStrip() {
  const [stats, setStats] = useState(LOADING_STATS);
  const { on, off } = useSocket();

  const fetchStats = () => {
    Promise.allSettled([
      fetch("/api/admin/faculty").then((r) => r.json()),
      fetch("/api/admin/toppers").then((r) => r.json()),
    ]).then(([facRes]) => {
      const facultyCount = facRes.status === "fulfilled" && Array.isArray(facRes.value)
        ? facRes.value.length : null;
      setStats([
        { value: "1200+", label: "Students Enrolled" },
        { value: facultyCount ? `${facultyCount}+` : "15+", label: "Expert Faculty" },
        { value: "98%",   label: "Result Rate"       },
        { value: "12+",   label: "Years of Legacy"   },
      ]);
    });
  };

  useEffect(() => { fetchStats(); }, []);

  // Real-time updates via socket
  useEffect(() => {
    const handler = () => fetchStats();
    on("faculty:updated", handler);
    on("toppers:updated", handler);
    return () => { off("faculty:updated", handler); off("toppers:updated", handler); };
  }, [on, off]);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Mobile: 2-column neumorphic grid */}
        <div className="grid grid-cols-2 md:hidden gap-3">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} delay={i * 0.08} index={i} />
          ))}
        </div>

        {/* Desktop: original 4-column */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} delay={i * 0.1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
