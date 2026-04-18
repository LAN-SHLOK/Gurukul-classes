"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

const variants = {
  up:    { hidden: { opacity: 0, y: 48 },           visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 },          visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },           visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.88 },     visible: { opacity: 1, scale: 1 } },
};

export default function ScrollReveal({
  children, className = "", delay = 0, direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
