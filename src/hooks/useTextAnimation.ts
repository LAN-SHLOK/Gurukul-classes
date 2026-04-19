"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Scramble-reveal a text element on scroll entry */
export function useScrambleText(text: string, options?: { delay?: number; trigger?: "mount" | "scroll" }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { el.textContent = text; return; }

    const chars = text.split("");
    const duration = chars.length * 30;
    let frame = 0;
    let rafId: number;

    const scramble = () => {
      const progress = frame / (duration / 16);
      el.textContent = chars
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < Math.floor(progress * chars.length)) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      frame += 16;
      if (frame < duration) rafId = requestAnimationFrame(scramble);
      else el.textContent = text;
    };

    const start = () => {
      frame = 0;
      const t = setTimeout(() => scramble(), (options?.delay ?? 0) * 1000);
      return () => clearTimeout(t);
    };

    if (options?.trigger === "scroll") {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: start,
      });
      return () => { cancelAnimationFrame(rafId); st.kill(); };
    } else {
      const cleanup = start();
      return () => { cancelAnimationFrame(rafId); cleanup?.(); };
    }
  }, [text, options?.delay, options?.trigger]);

  return ref;
}

/** Split text into chars with stagger animation */
export function useSplitText(options?: { stagger?: number; delay?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const text = el.textContent || "";
    el.innerHTML = text
      .split("")
      .map((char) =>
        char === " "
          ? " "
          : `<span class="inline-block" style="opacity:0;transform:translateY(40px)">${char}</span>`
      )
      .join("");

    const spans = el.querySelectorAll("span");
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(spans, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: options?.stagger ?? 0.025,
          delay: options?.delay ?? 0,
          ease: "power3.out",
        });
      },
    });

    return () => st.kill();
  }, [options?.stagger, options?.delay]);

  return ref;
}
