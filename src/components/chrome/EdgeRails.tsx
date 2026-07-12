"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useLenis, useScrollTo } from "@/components/providers/SmoothScroll";

/**
 * Vertical edge typography (Evil Martians poster rails) plus a mission progress
 * rail whose mint marker mirrors scroll position. Desktop only (xl+).
 *
 * The marker reads raw Lenis progress via a direct scroll listener + quickTo —
 * deliberately bypassing the 1%-quantized useScrollProgress so it glides
 * smoothly. Under reduced motion (no Lenis) it falls back to an instant
 * position mirror, which reads as a scrollbar and is motion-safe. The marker's
 * transform is GSAP-owned only — no Tailwind translate on it (convention 6).
 */
export default function EdgeRails() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const marker = markerRef.current;
    if (!track || !marker) return;

    const span = () => Math.max(0, track.clientHeight - 5); // less the marker height

    if (lenis) {
      const toY = gsap.quickTo(marker, "y", {
        duration: 0.25,
        ease: "power2.out",
      });
      const onScroll = ({ progress }: { progress: number }) =>
        toY(progress * span());
      lenis.on("scroll", onScroll);
      // seed current position from native scroll (avoids depending on a getter)
      const max = document.documentElement.scrollHeight - window.innerHeight;
      toY((max > 0 ? window.scrollY / max : 0) * span());
      return () => lenis.off("scroll", onScroll);
    }

    // native fallback (reduced motion / pre-hydration): instant position mirror
    const onNative = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      gsap.set(marker, { y: p * span() });
    };
    onNative();
    window.addEventListener("scroll", onNative, { passive: true });
    window.addEventListener("resize", onNative);
    return () => {
      window.removeEventListener("scroll", onNative);
      window.removeEventListener("resize", onNative);
    };
  }, [lenis]);

  return (
    <>
      <div
        aria-hidden
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <span className="hud-label text-[10px] text-muted/70 [writing-mode:vertical-rl]">
          PORTFOLIO — EDITION 2026 ◦ LKO/IN
        </span>
      </div>

      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-6 xl:flex">
        {/* mission progress rail — marker mirrors scroll */}
        <div ref={trackRef} aria-hidden className="relative h-[30vh] w-px bg-line">
          {["0%", "25%", "50%", "75%", "100%"].map((top) => (
            <span
              key={top}
              className="absolute -left-[3px] -mt-px h-px w-[7px] bg-muted/60"
              style={{ top }}
            />
          ))}
          <span
            ref={markerRef}
            className="absolute -left-[2px] top-0 h-[5px] w-[5px] bg-mint shadow-[0_0_6px_var(--color-mint)]"
            style={{ transform: "translateY(0px)" }}
          />
        </div>

        <button
          onClick={() => scrollTo("#contact")}
          className="hud-label border border-bone/25 px-2 py-4 text-[10px] text-bone/80 transition-colors [writing-mode:vertical-rl] hover:border-mint hover:text-mint"
        >
          CONTACT ↓
        </button>
      </div>
    </>
  );
}
