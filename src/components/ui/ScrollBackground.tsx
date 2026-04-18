"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "hero",    bg: "#000000",  type: "dark"  },
  { id: "stats",   bg: "#050510",  type: "dark"  },
  { id: "toppers", bg: "#03030a",  type: "dark"  },
  { id: "ai",      bg: "#000000",  type: "dark"  },
  { id: "faculty", bg: "#F0EEE8",  type: "light" },
  { id: "events",  bg: "#060614",  type: "dark"  },
  { id: "reviews", bg: "#EEEDE8",  type: "light" },
];

export default function ScrollBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(bg, { backgroundColor: SECTIONS[0].bg });

    // Wait for sections to be rendered (dynamic imports)
    const init = () => {
      const triggers: ScrollTrigger[] = [];

      SECTIONS.forEach((section) => {
        const el = document.querySelector(`[data-section="${section.id}"]`) as HTMLElement;
        if (!el) return;

        const apply = () => {
          gsap.to(bg, {
            backgroundColor: section.bg,
            duration: prefersReduced ? 0 : 0.7,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          window.dispatchEvent(new CustomEvent("sectionBgChange", { detail: section.type }));
        };

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          onEnter: apply,
          onEnterBack: apply,
          // Use scroller as window — works with Lenis since Lenis
          // calls ScrollTrigger.update() on every scroll event
        });

        triggers.push(st);
      });

      ScrollTrigger.refresh();
      return triggers;
    };

    // Give dynamic components time to mount
    const id = setTimeout(() => {
      const triggers = init();
      return () => triggers.forEach((t) => t.kill());
    }, 500);

    return () => clearTimeout(id);
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 -z-10"
      aria-hidden
    />
  );
}
