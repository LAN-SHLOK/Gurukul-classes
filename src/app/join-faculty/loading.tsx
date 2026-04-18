"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(45,49,250,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-20 h-20 rounded-full border-4 border-[#2D31FA]/20 border-t-[#2D31FA] flex items-center justify-center"
        >
          <Briefcase className="w-8 h-8 text-[#2D31FA]" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-sm font-black uppercase tracking-widest"
        >
          Loading Application...
        </motion.p>
      </div>
    </div>
  );
}
