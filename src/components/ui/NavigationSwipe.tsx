"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function NavigationSwipe() {
  const pathname = usePathname();
  const [displayPathname, setDisplayPathname] = useState(pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== displayPathname) {
      const tl = gsap.timeline({
        onComplete: () => {
          setDisplayPathname(pathname);
        },
      });

      // Swipe In
      tl.to(overlayRef.current, {
        y: "0%",
        duration: 0.6,
        ease: "power4.inOut",
      });
      
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
      }, "-=0.2");

      // Swipe Out
      tl.to(textRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        delay: 0.2
      });

      tl.to(overlayRef.current, {
        y: "-100%",
        duration: 0.6,
        ease: "power4.inOut",
      });

      // Reset for next
      tl.set(overlayRef.current, { y: "100%" });
    }
  }, [pathname, displayPathname]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 bg-black z-[100000] flex items-center justify-center translate-y-full pointer-events-none"
    >
      <div 
        ref={textRef}
        className="text-white font-black text-4xl md:text-6xl tracking-tighter uppercase opacity-0 translate-y-4"
      >
        Gurukul<span className="text-[#2D31FA]">.</span>
      </div>
    </div>
  );
}
