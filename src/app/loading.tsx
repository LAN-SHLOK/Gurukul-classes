"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(45,49,250,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo/icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-24 h-24 rounded-full border-4 border-[#2D31FA]/20 border-t-[#2D31FA]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-[#2D31FA]" />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-3"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
            Loading<span className="text-[#2D31FA]">...</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Please wait
          </p>
        </motion.div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-2.5 h-2.5 rounded-full bg-[#2D31FA]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
