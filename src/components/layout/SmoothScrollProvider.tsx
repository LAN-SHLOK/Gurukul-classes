"use client";

import { useEffect, useRef, createContext } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisCtx {
  get: () => Lenis | null;
  destroy: () => void;
  reinit: () => void;
}

export const LenisContext = createContext<LenisCtx>({
  get: () => null,
  destroy: () => {},
  reinit: () => {},
});

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerFn = useRef<((t: number) => void) | null>(null);

  const init = () => {
    if (lenisRef.current) return; // already running
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: prefersReduced ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const fn = (time: number) => lenis.raf(time * 1000);
    tickerFn.current = fn;
    gsap.ticker.add(fn);
    gsap.ticker.lagSmoothing(0);
  };

  const destroy = () => {
    if (!lenisRef.current) return;
    if (tickerFn.current) gsap.ticker.remove(tickerFn.current);
    lenisRef.current.destroy();
    lenisRef.current = null;
    tickerFn.current = null;
  };

  useEffect(() => {
    init();
    return () => destroy();
  }, []);

  return (
    <LenisContext.Provider value={{ get: () => lenisRef.current, destroy, reinit: init }}>
      {children}
    </LenisContext.Provider>
  );
}
