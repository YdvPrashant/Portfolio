"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { identity } from "@/data/resume";
import { prefersReducedMotion } from "@/lib/hooks";

const LOG_LINES = [
  { at: 4, text: "PY-OS BOOT SEQUENCE v2.6" },
  { at: 22, text: "LOADING DITHER ENGINE ......... OK" },
  { at: 42, text: "CALIBRATING TYPE GRID ......... OK" },
  { at: 64, text: `SIGNAL LOCK ${identity.coordinates}` },
  { at: 86, text: "ALL SYSTEMS NOMINAL" },
];

/** Signal that the hero entrance may start (fired even when boot is skipped). */
function announceDone() {
  (window as unknown as { __bootDone?: boolean }).__bootDone = true;
  window.dispatchEvent(new CustomEvent("boot:done"));
}

/**
 * Boot screen: mono log + 0→100 counter, then the panel wipes up.
 * Runs once per session; skipped for reduced motion; hidden without JS.
 * Never unmounts — GSAP drives visibility, keeping hydration stable.
 */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    if (sessionStorage.getItem("booted") || prefersReducedMotion()) {
      gsap.set(root, { display: "none" });
      announceDone();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const unlock = () => {
      document.documentElement.style.overflow = "";
    };

    const counter = { p: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: "none" });
        sessionStorage.setItem("booted", "1");
        unlock();
        announceDone();
      },
    });
    tl.to(counter, {
      p: 100,
      duration: 2.0,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(counter.p)),
    }).to(root, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "+=0.15");

    return unlock;
  });

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-[90] flex flex-col justify-between bg-void p-6 md:p-10"
      aria-hidden
    >
      <noscript>
        <style>{`.preloader{display:none}`}</style>
      </noscript>

      <div className="hud-label flex flex-col gap-2 text-muted">
        {LOG_LINES.filter((l) => pct >= l.at).map((l) => (
          <span key={l.at}>
            <span className="text-mint">▸</span> {l.text}
          </span>
        ))}
      </div>

      <div className="flex items-end justify-between">
        <span className="hud-label text-muted">
          {identity.name.toUpperCase()} — PORTFOLIO/2026
        </span>
        <span className="display-type text-[clamp(5rem,18vw,14rem)] text-mint">
          {pct}
        </span>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-mint"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}
