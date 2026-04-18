"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glass?: boolean;
  neuro?: boolean;
}

export const Card = ({ children, className, delay = 0, glass = false, neuro = false }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${x}%`);
    el.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group overflow-hidden transition-all duration-500",
        "rounded-[40px] p-10",
        // Base styles
        !glass && !neuro && "bg-white border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]",
        // Glassmorphic variant
        glass && "glass",
        // Neumorphic variant
        neuro && "neuro-light",
        // Hover lift
        "hover:scale-[1.01] hover:-translate-y-0.5",
        className
      )}
      style={{
        // Spotlight gradient follows cursor
        backgroundImage: glass
          ? "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(45,49,250,0.06) 0%, transparent 60%)"
          : undefined,
      }}
    >
      {/* Shimmer border on hover */}
      <div className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(45,49,250,0.08) 0%, transparent 50%, rgba(45,49,250,0.04) 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
