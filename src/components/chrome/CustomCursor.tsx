"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/** Mint dot + trailing ring. Fine pointers only; native cursor hidden while active. */
export default function CustomCursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3" });

    let shown = false;
    const move = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY, opacity: 1 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("a,button,[data-cursor]");

    const over = (e: MouseEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(ring, { scale: 1.9, duration: 0.3, ease: "power3" });
      gsap.to(dot, { scale: 0.5, duration: 0.3 });
    };
    const out = (e: MouseEvent) => {
      if (!isInteractive(e.target)) return;
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };
    const down = () => gsap.to(ring, { scale: 0.75, duration: 0.15 });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dotRef}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-mint opacity-0 mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-mint/70 opacity-0 mix-blend-difference"
      />
    </div>
  );
}
