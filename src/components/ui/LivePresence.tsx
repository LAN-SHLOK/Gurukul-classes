"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export default function LivePresence() {
  const { isConnected, on, off } = useSocket();
  const [count, setCount] = useState(1);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show after a second
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (n: number) => setCount(n);
    on("presence", handler);
    return () => off("presence", handler);
  }, [on, off]);

  return (
    <AnimatePresence>
      {show && isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[90] flex items-center gap-2 glass-dark rounded-full px-3 py-1.5 pointer-events-none"
        >
          <span className="presence-dot flex-shrink-0" />
          <Users className="w-3 h-3 text-white/40" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
            {count} {count === 1 ? "viewer" : "viewers"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
