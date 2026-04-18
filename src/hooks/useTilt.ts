"use client";

import { useEffect, RefObject } from "react";
import VanillaTilt from "vanilla-tilt";

export function useTilt(ref: RefObject<HTMLElement | null>, options?: VanillaTilt.TiltOptions) {
  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!ref.current) return;

    VanillaTilt.init(ref.current, {
      max: 8,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02,
      speed: 400,
      ...options,
    });

    return () => {
      (ref.current as any)?.vanillaTilt?.destroy();
    };
  }, []);
}
