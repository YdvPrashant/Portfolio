"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * A small mint satellite in continuous elliptical orbit around the hero planet.
 * Passes behind the cream disc on the top arc and in front on the bottom arc
 * (z-index swap). Rides gsap.ticker and pauses offscreen like DitherPlanet.
 * Under prefers-reduced-motion it parks in a single static frame.
 *
 * Lives inside the planet wrapper (which sets `isolate`), so its z-swaps stay
 * contained below the hero name block. The animated node carries only a GSAP
 * transform — never a Tailwind translate/scale — per CLAUDE.md convention 6.
 */
export default function OrbitSatellite() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const satRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sat = satRef.current;
    if (!wrap || !sat) return;

    let R = wrap.clientWidth / 2;
    const ro = new ResizeObserver(() => {
      R = wrap.clientWidth / 2;
    });
    ro.observe(wrap);

    // a gently tilted ellipse — tilt applied in math (not a CSS transform) so
    // the wrapper never becomes a stacking context that would trap the z-swap
    const TILT = (-6 * Math.PI) / 180;
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    const place = (theta: number) => {
      const ex = 1.12 * R * Math.cos(theta); // semi-major swings just outside the disc
      const ey = 0.34 * R * Math.sin(theta); // semi-minor crosses the disc face
      const x = ex * cosT - ey * sinT;
      const y = ex * sinT + ey * cosT;
      // tail points along the velocity (tangent of the tilted ellipse)
      const vx = -1.12 * R * Math.sin(theta);
      const vy = 0.34 * R * Math.cos(theta);
      const rot =
        (Math.atan2(vx * sinT + vy * cosT, vx * cosT - vy * sinT) * 180) /
        Math.PI;
      gsap.set(sat, {
        x,
        y,
        rotation: rot,
        zIndex: Math.sin(theta) >= 0 ? 20 : 0, // bottom arc in front, top arc behind
      });
    };

    let theta = 0.4 * Math.PI;

    if (prefersReducedMotion()) {
      place(theta); // static parked frame, front lower-right
      return () => ro.disconnect();
    }

    const tick = (_t: number, dt: number) => {
      theta += (0.35 * dt) / 1000; // ~18s per orbit
      place(theta);
    };

    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px" },
    );
    io.observe(wrap);

    place(theta);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      <div
        ref={satRef}
        className="absolute left-1/2 top-1/2 -ml-1 -mt-1"
        style={{ transform: "translate(0,0)" }}
      >
        <span className="absolute right-full top-1/2 h-px w-6 -translate-y-1/2 bg-gradient-to-l from-mint/80 to-transparent" />
        <span className="block h-2 w-2 rounded-full bg-mint shadow-[0_0_10px_2px_rgba(195,255,252,0.5)]" />
      </div>
    </div>
  );
}
