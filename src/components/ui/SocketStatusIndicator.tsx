"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, X } from "lucide-react";

export default function SocketStatusIndicator() {
  const { isConnected } = useSocket();
  const [showIndicator, setShowIndicator] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show indicator if socket is disconnected after initial mount
    // Wait 3 seconds to avoid showing during initial connection
    const timer = setTimeout(() => {
      if (!isConnected && !isDismissed) {
        setShowIndicator(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isConnected, isDismissed]);

  useEffect(() => {
    // Hide indicator when connection is restored
    if (isConnected) {
      setShowIndicator(false);
    }
  }, [isConnected]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowIndicator(false);
  };

  return (
    <AnimatePresence>
      {showIndicator && !isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 right-4 md:right-6 z-[90] flex items-center gap-2 glass-dark rounded-lg px-3 py-2 shadow-lg border border-white/10"
        >
          <WifiOff className="w-4 h-4 text-orange-400/80 flex-shrink-0" />
          <span className="text-xs text-white/70 pr-2">
            Real-time updates unavailable
          </span>
          <button
            onClick={handleDismiss}
            className="ml-1 p-0.5 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5 text-white/50 hover:text-white/80" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
