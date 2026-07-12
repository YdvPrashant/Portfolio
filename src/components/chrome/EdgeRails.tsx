"use client";

import { useScrollTo } from "@/components/providers/SmoothScroll";

/** Vertical edge typography — the Evil Martians poster rails. Desktop only. */
export default function EdgeRails() {
  const scrollTo = useScrollTo();

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

      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
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
