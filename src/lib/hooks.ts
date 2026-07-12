"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** Reactive media query. SSR-safe (false on server, updates after hydration). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when the visitor asks for reduced motion. SSR-safe (false on server). */
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_QUERY);
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

/**
 * Which numbered section is on screen, read from [data-section-index] /
 * [data-section-label] attributes on the <section> elements.
 */
export function useActiveSection() {
  const [active, setActive] = useState({ index: "01", label: "HELLO" });

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-index]"),
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setActive({
            index: el.dataset.sectionIndex ?? "",
            label: el.dataset.sectionLabel ?? "",
          });
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
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
