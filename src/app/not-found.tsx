"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

// ─── Isometric Block ──────────────────────────────────────────────────────────
function IsometricBlock({
  x, y, delay, color, size = 48,
}: {
  x: number; y: number; delay: number; color: string; size?: number;
}) {
  const depth = size * 0.375;
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        left: x, top: y,
        width: size, height: size,
        transformStyle: "preserve-3d",
        transform: `rotateX(30deg) rotateZ(-45deg)`,
      }}
    >
      {/* Top face */}
      <motion.div
        animate={{ filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: delay * 0.5, ease: "easeInOut" }}
        style={{
          position: "absolute", width: size, height: size,
          background: color,
          transform: `translateZ(${depth}px)`,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 4,
        }}
      />
      {/* Right face */}
      <div style={{
        position: "absolute", width: depth, height: size,
        background: color,
        filter: "brightness(0.55)",
        transform: `rotateY(-90deg) translateZ(${size}px)`,
        border: "1px solid rgba(255,255,255,0.05)",
      }} />
      {/* Bottom face */}
      <div style={{
        position: "absolute", width: size, height: depth,
        background: color,
        filter: "brightness(0.38)",
        transform: `rotateX(90deg) translateZ(${size}px)`,
        border: "1px solid rgba(255,255,255,0.04)",
      }} />
    </motion.div>
  );
}


const BLOCKS = [
  { x: 20,  y: 50,  color: "#2D31FA", delay: 0,    size: 44 },
  { x: 76,  y: 22,  color: "#4f46e5", delay: 0.07, size: 44 },
  { x: 132, y: 50,  color: "#2D31FA", delay: 0.14, size: 44 },
  { x: 48,  y: 88,  color: "#6366f1", delay: 0.21, size: 44 },
  { x: 104, y: 88,  color: "#4338ca", delay: 0.28, size: 44 },
  { x: 76,  y: 126, color: "#2D31FA", delay: 0.35, size: 44 },
  { x: 20,  y: 126, color: "#1e1b4b", delay: 0.42, size: 36 },
  { x: 132, y: 126, color: "#1e1b4b", delay: 0.49, size: 36 },
  { x: 76,  y: 158, color: "#0f0d3a", delay: 0.56, size: 32 },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center overflow-hidden">

      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(45,49,250,0.08) 0%, transparent 65%)"
        }}
      />

      {/* ── Isometric 404 sculpture ── */}
      <div className="relative w-72 h-72 mb-10" style={{ perspective: "900px" }}>
        {BLOCKS.map((b, i) => (
          <IsometricBlock key={i} {...b} />
        ))}

        {/* Glassmorphic floating 404 badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="px-5 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px -8px rgba(45,49,250,0.3)",
            }}
          >
            <motion.span
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl font-black text-white select-none"
              style={{ letterSpacing: "-0.04em" }}
            >
              404
            </motion.span>
          </div>
        </motion.div>

        {/* Ambient ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "transparent",
            boxShadow: "0 0 60px -20px rgba(45,49,250,0.4)",
            margin: "auto",
            width: 180, height: 180,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* ── Message ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3 max-w-xs"
      >
        {/* Expressive typography — gradient shimmer on mobile */}
        <h1 className="text-4xl font-black tracking-tighter leading-[0.9]">
          <span className="gradient-text">PAGE NOT</span><br />
          <span className="text-[#2D31FA]">FOUND.</span>
        </h1>
        <p className="text-white/35 font-bold leading-relaxed text-sm">
          This page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
      </motion.div>

      {/* ── Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex items-center gap-3 mt-8"
      >
        <Link href="/"
          className="press micro-glow flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-widest shadow-[0_0_30px_-8px_rgba(45,49,250,0.6)] active:scale-95 transition-transform"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="press flex items-center gap-2 px-5 py-3 rounded-2xl glass-pill text-white/60 text-xs font-black uppercase tracking-widest neuro-btn active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </motion.div>

      {/* ── Subtle typing dots (real-time collaborative feel) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-1.5 mt-8"
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="typing-dot w-1.5 h-1.5 rounded-full bg-white/20"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15 ml-2">
          Searching for page
        </span>
      </motion.div>
    </div>
  );
}
