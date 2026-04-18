"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Hero3D from "./Hero3D";
import gsap from "gsap";
import Typed from "typed.js";

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const typedElRef  = useRef<HTMLSpanElement>(null);
  const typedRef    = useRef<Typed | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = prefersReduced ? 0 : 1;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current,    { opacity: 0, y: prefersReduced ? 0 : 20, duration: dur * 0.6 })
        .from(titleRef.current,    { opacity: 0, y: prefersReduced ? 0 : 60, duration: dur },      "-=0.3")
        .from(subtitleRef.current, { opacity: 0, y: prefersReduced ? 0 : 20, duration: dur * 0.8 }, "-=0.6")
        .from(ctaRef.current,      { opacity: 0, y: prefersReduced ? 0 : 20, duration: dur * 0.6 }, "-=0.4")
        .add(() => {
          // Start Typed.js after GSAP finishes
          if (typedElRef.current) {
            typedRef.current = new Typed(typedElRef.current, {
              strings: [
                "Elite JEE &amp; NEET Coaching.",
                "Grade 1–12 Gujarat Board &amp; NCERT.",
                "Offline. Personal. Proven.",
              ],
              typeSpeed: prefersReduced ? 0 : 50,
              backSpeed: prefersReduced ? 0 : 30,
              loop: true,
              backDelay: 2000,
              showCursor: true,
              cursorChar: "|",
            });
          }
        });
    }, sectionRef);

    return () => {
      ctx.revert();
      typedRef.current?.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-20 px-4 md:px-6 overflow-hidden"
    >
      {/* 3D particle sphere */}
      <Hero3D />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10 text-center">

        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 text-[#2D31FA]"
        >
          <Sparkles className="w-4 h-4" />
          The Future of Education
        </div>

        {/* Main title — mobile gets gradient-text shimmer */}
        <h1
          ref={titleRef}
          className="font-black tracking-tighter leading-[0.85] mb-8 md:mb-12 text-white selection:bg-[#2D31FA] md:text-white gradient-text md:[background:none] md:[-webkit-text-fill-color:white]"
          style={{ fontSize: "clamp(3rem, 12vw, 12rem)" }}
        >
          BEYOND<br />
          LIMITS<span className="text-[#2D31FA] [-webkit-text-fill-color:#2D31FA]">.</span>
        </h1>

        {/* Typed.js subtitle */}
        <div
          ref={subtitleRef}
          className="max-w-2xl mx-auto text-base md:text-xl lg:text-2xl text-gray-400 font-bold mb-10 md:mb-16 leading-tight tracking-tight min-h-[2.5rem]"
        >
          <span ref={typedElRef} />
        </div>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link href="/admissions" className="w-full sm:w-auto">
            <button className="press micro-glow w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#2D31FA] text-white text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_40px_-8px_rgba(45,49,250,0.7)] active:scale-95 transition-transform">
              JOIN THE ELITE
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="press flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[#2D31FA] transition-colors group min-h-[44px]">
            <div className="w-12 h-12 rounded-full glass-pill flex items-center justify-center group-hover:border-[#2D31FA]/40 transition-all neuro-btn">
              <PlayCircle className="w-5 h-5 text-current" />
            </div>
            Watch Showreel
          </button>
        </div>

        {/* Mobile scrollytelling hint — only mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-2 md:hidden"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[#2D31FA]/60" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 md:px-8 hidden md:flex justify-between items-center text-white/20 pointer-events-none"
      >
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Est. 2011</span>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Ahmedabad / Gujarat</span>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase">Premium Offline</span>
      </motion.div>
    </section>
  );
}
