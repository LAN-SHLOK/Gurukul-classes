"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function NavigationSwipe() {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target?.href) return;

      const url = new URL(target.href);
      if (
        url.origin === window.location.origin &&
        url.pathname !== pathname &&
        target.target !== "_blank" &&
        !target.hasAttribute("download")
      ) {
        e.preventDefault();
        e.stopPropagation();

        const tl = gsap.timeline({
          onComplete: () => {
            router.push(url.pathname + url.search + url.hash);
          },
        });

        // Swipe In
        tl.to(overlayRef.current, {
          y: "0%",
          duration: 0.6,
          ease: "power4.inOut",
        });

        tl.to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.2"
        );
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname, router]);

  // Animate OUT when the page actually loads (pathname changes)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Force scroll to top instantly before revealing the new page
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const tl = gsap.timeline();

    // Swipe Out
    tl.to(textRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      delay: 0.2, // Tiny delay to let new page render visually
    });

    tl.to(overlayRef.current, {
      y: "-100%",
      duration: 0.6,
      ease: "power4.inOut",
    });

    // Reset for next swipe-in
    tl.set(overlayRef.current, { y: "100%" });
  }, [pathname]);

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
