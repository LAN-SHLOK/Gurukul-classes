"use client";

import { useEffect, useRef } from "react";
import Vivus from "vivus";

interface VivusSVGProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export default function VivusSVG({ children, duration = 200, className = "" }: VivusSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vivusRef = useRef<any>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    // Give the SVG a unique id if it doesn't have one
    if (!svg.id) svg.id = `vivus-svg-${Math.random().toString(36).slice(2, 8)}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          vivusRef.current = new Vivus(svg.id, {
            type: "delayed",
            duration,
            animTimingFunction: Vivus.EASE_OUT,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      vivusRef.current = null;
    };
  }, [duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
