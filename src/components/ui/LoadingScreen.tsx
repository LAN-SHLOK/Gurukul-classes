"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING");

  useEffect(() => {
    const texts = ["INITIALIZING", "LOADING ASSETS", "PREPARING", "ALMOST READY"];
    let textIndex = 0;

    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setLoadingText(texts[textIndex]);
    }, 400);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15 + 8;
      });
    }, 100);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(45,49,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,49,250,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Radial glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,49,250,0.2) 0%, transparent 70%)",
            }}
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#2D31FA] rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * -200 - 100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated logo with text - New elegant animation */}
            <div className="relative flex items-center justify-center">
              
              {/* Animated corner brackets - top left */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -left-8 md:-top-12 md:-left-12"
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M0 20 L0 0 L20 0" stroke="#2D31FA" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Animated corner brackets - top right */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-8 -right-8 md:-top-12 md:-right-12"
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M60 0 L60 20 M60 0 L40 0" stroke="#2D31FA" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Animated corner brackets - bottom left */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12"
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M0 40 L0 60 L20 60" stroke="#2D31FA" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Animated corner brackets - bottom right */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12"
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M60 60 L60 40 M60 60 L40 60" stroke="#2D31FA" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Scanning line effect */}
              <motion.div
                animate={{
                  y: ["-100%", "100%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(45, 49, 250, 0.3) 50%, transparent 100%)",
                  height: "200%",
                }}
              />

              {/* Orbiting particles */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-full h-full"
                  style={{
                    width: 400 + i * 50,
                    height: 400 + i * 50,
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-[#2D31FA]"
                    style={{
                      boxShadow: "0 0 10px rgba(45, 49, 250, 0.8)",
                      opacity: 0.6 - i * 0.1,
                    }}
                  />
                </motion.div>
              ))}

              {/* GURUKUL text - Enhanced */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="relative text-center z-10 px-8"
              >
                {/* Main GURUKUL text with gradient and effects */}
                <div className="relative flex items-center justify-center">
                  <h2 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase whitespace-nowrap"
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 40px rgba(45, 49, 250, 0.8)) drop-shadow(0 0 80px rgba(45, 49, 250, 0.4))",
                    }}
                  >
                    GURUKUL
                  </h2>
                  
                  {/* Accent dot after GURUKUL */}
                  <motion.span
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#2D31FA] ml-2"
                    style={{
                      boxShadow: "0 0 20px rgba(45, 49, 250, 0.8), 0 0 40px rgba(45, 49, 250, 0.4)",
                    }}
                  />
                  
                  {/* Animated shine effect overlay */}
                  <motion.div
                    animate={{
                      x: ["-200%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                      width: "50%",
                    }}
                  />
                  
                  {/* Subtle inner glow */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(45, 49, 250, 0.2) 0%, transparent 70%)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Sparkle effect - floating */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-16 -right-16 md:-top-20 md:-right-20"
              >
                <Sparkles className="w-10 h-10 text-[#2D31FA]" style={{ filter: "drop-shadow(0 0 10px rgba(45, 49, 250, 0.8))" }} />
              </motion.div>

              {/* Additional sparkle */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-12 -left-12 md:-bottom-16 md:-left-16"
              >
                <Sparkles className="w-7 h-7 text-[#2D31FA]" style={{ filter: "drop-shadow(0 0 8px rgba(45, 49, 250, 0.8))" }} />
              </motion.div>
            </div>

            {/* Animated loading text */}
            <motion.div
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                {loadingText}
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 md:w-80 space-y-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                {/* Background shimmer */}
                <motion.div
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />

                {/* Progress fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-[#2D31FA] via-indigo-500 to-[#2D31FA] rounded-full relative overflow-hidden"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
              </div>

              {/* Progress percentage */}
              <motion.p
                className="text-center text-xs font-black text-white/30 tracking-widest"
                key={Math.floor(progress)}
              >
                {Math.floor(Math.min(progress, 100))}%
              </motion.p>
            </div>

            {/* Bouncing dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 rounded-full bg-[#2D31FA]"
                />
              ))}
            </div>
          </div>

          {/* Bottom text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 text-center"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
              Foundation for Future
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
