"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** True when the visitor asks for reduced motion. SSR-safe (false on server). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** Imperative check for non-React code paths (canvas loops, GSAP setup). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches
  );
}

/**
 * Live clock string for the status bar, fixed to a timezone.
 * Returns null until mounted (avoids SSR/client hydration mismatch).
 */
export function useClock(timeZone = "Asia/Kolkata"): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}

/** rAF-throttled pointer position in viewport pixels. */
export function useMousePosition(): { x: number; y: number } {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setPos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return pos;
}
