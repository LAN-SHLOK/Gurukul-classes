"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Dawn → Noon → Dusk → Night sky progression
// Each keyframe = a page section crossing 50% of the viewport
const SKY_KEYFRAMES = [
  // 0 — Hero (midnight black)
  { bg: "#000000", glow1: "rgba(45,49,250,0.15)", glow2: "transparent",           star: 0.8 },
  // 1 — Stats (pre-dawn deep blue)
  { bg: "#020818", glow1: "rgba(45,49,250,0.25)", glow2: "rgba(100,80,200,0.08)", star: 0.6 },
  // 2 — Toppers (dawn purple-blue)
  { bg: "#08051A", glow1: "rgba(80,40,180,0.30)", glow2: "rgba(200,100,50,0.06)", star: 0.3 },
  // 3 — AI (soft dawn orange horizon)
  { bg: "#0D0818", glow1: "rgba(200,80,30,0.20)", glow2: "rgba(45,49,250,0.15)",  star: 0.1 },
  // 4 — Faculty (day — light warm)
  { bg: "#F0EEE8", glow1: "transparent",          glow2: "transparent",            star: 0   },
  // 5 — Events (dusk)
  { bg: "#060614", glow1: "rgba(200,60,20,0.15)", glow2: "rgba(45,49,250,0.20)",  star: 0.4 },
  // 6 — Reviews (twilight warm grey)
  { bg: "#EEEDE8", glow1: "transparent",          glow2: "transparent",            star: 0   },
];

const SECTION_IDS = ["hero", "stats", "toppers", "ai", "faculty", "events", "reviews"];

export default function DawnDuskParallax() {
  const bgRef    = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bg    = bgRef.current;
    const g1    = glow1Ref.current;
    const g2    = glow2Ref.current;
    const stars = starsRef.current;
    if (!bg || !g1 || !g2 || !stars) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Draw static stars on canvas ──────────────────────────────────
    const ctx = stars.getContext("2d");
    const resize = () => {
      stars.width  = window.innerWidth;
      stars.height = window.innerHeight;
      if (!ctx) return;
      ctx.clearRect(0, 0, stars.width, stars.height);
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * stars.width;
        const y = Math.random() * stars.height * 0.7;
        const r = Math.random() * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`;
        ctx.fill();
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Set initial state ─────────────────────────────────────────────
    gsap.set(bg, { backgroundColor: SKY_KEYFRAMES[0].bg });
    gsap.set(g1, { background: SKY_KEYFRAMES[0].glow1 });
    gsap.set(g2, { background: SKY_KEYFRAMES[0].glow2 });
    gsap.set(stars, { opacity: SKY_KEYFRAMES[0].star });

    // ── Create a trigger per section ──────────────────────────────────
    const triggers: ScrollTrigger[] = [];
    const dur = prefersReduced ? 0 : 0.9;

    SECTION_IDS.forEach((id, i) => {
      const el = document.querySelector(`[data-section="${id}"]`) as HTMLElement;
      if (!el) return;
      const kf = SKY_KEYFRAMES[i];

      const apply = () => {
        gsap.to(bg,    { backgroundColor: kf.bg,    duration: dur, ease: "power2.inOut", overwrite: "auto" });
        gsap.to(g1,    { background: kf.glow1,      duration: dur, ease: "power2.inOut", overwrite: "auto" });
        gsap.to(g2,    { background: kf.glow2,      duration: dur, ease: "power2.inOut", overwrite: "auto" });
        gsap.to(stars, { opacity: kf.star,           duration: dur, ease: "power2.inOut", overwrite: "auto" });
        // fire cursor bg-type event
        const type = (kf.bg.startsWith("#F") || kf.bg.startsWith("#E")) ? "light" : "dark";
        window.dispatchEvent(new CustomEvent("sectionBgChange", { detail: type }));
      };

      triggers.push(
        ScrollTrigger.create({ trigger: el, start: "top 55%", onEnter: apply, onEnterBack: apply })
      );
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      {/* Base sky color */}
      <div ref={bgRef} className="absolute inset-0" />

      {/* Stars */}
      <canvas ref={starsRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric glow 1 — bottom horizon */}
      <div
        ref={glow1Ref}
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        style={{ filter: "blur(80px)", transformOrigin: "bottom" }}
      />

      {/* Atmospheric glow 2 — upper accent */}
      <div
        ref={glow2Ref}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh]"
        style={{ borderRadius: "50%", filter: "blur(100px)" }}
      />
    </div>
  );
}
