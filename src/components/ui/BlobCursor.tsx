"use client";

import { useEffect, useRef } from "react";

export default function BlobCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const mouse   = useRef({ x: -100, y: -100 });
  const pos     = useRef({ x: -100, y: -100 }); // ring smoothed position
  const rafId   = useRef<number>(0);
  const hovering = useRef(false);
  const isLight  = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const lbl  = labelRef.current;
    if (!dot || !ring || !lbl) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ── rAF loop — smooth ring, instant dot ──────────────────────────────
    const tick = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, hovering.current ? 0.14 : 0.1);
      pos.current.y = lerp(pos.current.y, mouse.current.y, hovering.current ? 0.14 : 0.1);

      // Use left/top so CSS translate(-50%,-50%) still works
      ring.style.left = pos.current.x + "px";
      ring.style.top  = pos.current.y + "px";

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // ── Mouse position ────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top  = e.clientY + "px";
    };

    // ── Click ripple ──────────────────────────────────────────────────────
    const onClick = () => {
      ring.style.transition = "width 0.4s, height 0.4s, opacity 0.4s";
      ring.style.width  = "80px";
      ring.style.height = "80px";
      ring.style.opacity = "0";
      setTimeout(() => {
        ring.style.width  = "40px";
        ring.style.height = "40px";
        ring.style.opacity = "1";
        ring.style.transition = "";
      }, 400);
    };

    // ── Hover effects ─────────────────────────────────────────────────────
    const onEnterEl = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      hovering.current = true;
      const label = el.dataset.cursorLabel || "";

      if (label) {
        lbl.textContent = label;
        lbl.style.opacity = "1";
      }

      const dark = !isLight.current;
      ring.style.transition = "width 0.3s, height 0.3s, border-color 0.3s, background 0.3s, transform 0.3s";
      ring.style.width  = "64px";
      ring.style.height = "64px";
      ring.style.borderColor = dark ? "rgba(255,255,255,0.8)" : "#2D31FA";
      ring.style.background  = dark ? "rgba(255,255,255,0.05)" : "rgba(45,49,250,0.06)";

      dot.style.transition = "transform 0.2s, opacity 0.2s";
      dot.style.transform = "translate(-50%,-50%) scale(0)";
      dot.style.opacity = "0";
    };

    const onLeaveEl = () => {
      hovering.current = false;
      lbl.style.opacity = "0";
      lbl.textContent = "";

      ring.style.transition = "width 0.3s, height 0.3s, border-color 0.3s, background 0.3s";
      ring.style.width  = "40px";
      ring.style.height = "40px";
      ring.style.borderColor = "#2D31FA";
      ring.style.background  = "transparent";

      dot.style.transform = "translate(-50%,-50%) scale(1)";
      dot.style.opacity = "1";
    };

    const onHide = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const onShow = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; };

    // ── Attach to interactive elements ────────────────────────────────────
    const attached = new WeakSet<Element>();
    const attach = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        if (attached.has(el)) return;
        attached.add(el);
        el.addEventListener("mouseenter", onEnterEl);
        el.addEventListener("mouseleave", onLeaveEl);
      });
    };
    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    // ── Section bg listener ───────────────────────────────────────────────
    const onBgChange = (e: Event) => {
      isLight.current = (e as CustomEvent).detail === "light";
      dot.style.background = isLight.current ? "#1a1aff" : "#2D31FA";
    };

    window.addEventListener("mousemove",   onMove);
    window.addEventListener("click",       onClick);
    window.addEventListener("sectionBgChange", onBgChange as EventListener);
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove",   onMove);
      window.removeEventListener("click",       onClick);
      window.removeEventListener("sectionBgChange", onBgChange as EventListener);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[10001] hidden lg:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#2D31FA",
          left: -100,
          top: -100,
          transform: "translate(-50%,-50%)",
          mixBlendMode: "difference",
          transition: "transform 0.2s, opacity 0.2s",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[10000] hidden lg:flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          border: "1.5px solid #2D31FA",
          borderRadius: "50%",
          background: "transparent",
          left: -100,
          top: -100,
          transform: "translate(-50%,-50%)",
        }}
      >
        <span
          ref={labelRef}
          className="text-[8px] font-black uppercase tracking-widest text-white select-none"
          style={{ opacity: 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}
        />
      </div>
    </>
  );
}
