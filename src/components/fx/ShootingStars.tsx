"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

const POOL = 6;

/**
 * Occasional thin mint streaks arcing across the hero sky, plus a burst API.
 * A small pool of spans is recycled — never more than POOL on screen at once.
 * Ambient spawns pause offscreen (IntersectionObserver). Under reduced motion
 * the spans render but the loop and burst listener never start, so nothing
 * animates (effectively absent — hydration-safe, no conditional null return).
 *
 * Listens for `hero:burst` (dispatched by the interactive planet on click) and
 * fires a short radial burst from the click point.
 */
export default function ShootingStars() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (prefersReducedMotion()) return; // no ambient loop, no burst — stars stay invisible

    const stars = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-star]"),
    );
    const idle = new Set(stars);
    const rand = gsap.utils.random;

    const shoot = (
      xPct: number,
      yPct: number,
      angleDeg: number,
      dist: number,
      dur: number,
    ) => {
      const star = idle.values().next().value;
      if (!star) return;
      idle.delete(star);
      const rect = wrap.getBoundingClientRect();
      const startX = (xPct / 100) * rect.width;
      const startY = (yPct / 100) * rect.height;
      const a = (angleDeg * Math.PI) / 180;
      gsap.set(star, { x: startX, y: startY, rotation: angleDeg, opacity: 0 });
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(star, { opacity: 0 });
            idle.add(star);
          },
        })
        .to(star, {
          x: startX + Math.cos(a) * dist,
          y: startY + Math.sin(a) * dist,
          duration: dur,
          ease: "power1.in",
        })
        .to(star, { opacity: 1, duration: dur * 0.25 }, 0)
        .to(star, { opacity: 0, duration: dur * 0.45 }, dur * 0.55);
    };

    const ambient = () => {
      const angle = rand([1, -1]) * rand(18, 32); // mostly horizontal, either way
      shoot(rand(5, 70), rand(5, 55), angle, rand(240, 420), rand(0.6, 1));
    };

    let running = false;
    let scheduled: gsap.core.Tween | null = null;
    const queueNext = () => {
      scheduled = gsap.delayedCall(rand(4, 9), () => {
        if (!running) return;
        ambient();
        queueNext();
      });
    };
    const start = () => {
      if (running) return;
      running = true;
      queueNext();
    };
    const stop = () => {
      running = false;
      scheduled?.kill();
      scheduled = null;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "0px" },
    );
    io.observe(wrap);

    const onBurst = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (!detail) return;
      const rect = wrap.getBoundingClientRect();
      const xPct = ((detail.x - rect.left) / rect.width) * 100;
      const yPct = ((detail.y - rect.top) / rect.height) * 100;
      const base = rand(0, 360);
      for (let i = 0; i < 4; i++) {
        shoot(xPct, yPct, base + i * 90 + rand(-15, 15), rand(120, 200), rand(0.5, 0.8));
      }
    };
    window.addEventListener("hero:burst", onBurst);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("hero:burst", onBurst);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      {Array.from({ length: POOL }).map((_, i) => (
        <span
          key={i}
          data-star
          className="absolute left-0 top-0 h-px w-28 rounded-full bg-gradient-to-r from-transparent via-mint/70 to-mint opacity-0"
          style={{ transform: "translate(0,0)" }}
        />
      ))}
    </div>
  );
}
