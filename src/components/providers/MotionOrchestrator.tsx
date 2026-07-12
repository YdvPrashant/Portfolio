"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global {
  interface Window {
    __bootDone?: boolean;
  }
}

/**
 * Site-wide motion, mounted once. All tweens live inside a
 * prefers-reduced-motion matchMedia context — reduced visitors get the
 * static page (sweep panels default to scale-y-0 in markup for the same
 * reason).
 */
export default function MotionOrchestrator() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* — hero entrance (waits for the boot screen) — */
      const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const splits = heroLines.map(
        (line) => new SplitText(line, { type: "chars" }),
      );
      const chars = splits.flatMap((s) => s.chars);

      const entrance = gsap.timeline({ paused: true });
      entrance
        .from("[data-reveal='overline']", {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
        })
        .from(
          chars,
          {
            yPercent: 115,
            opacity: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.028,
          },
          0.15,
        )
        .from(
          "[data-reveal='planet']",
          { scale: 0.9, opacity: 0, duration: 1.3, ease: "power3.out" },
          0.2,
        )
        .from(
          "[data-reveal='chip']",
          { y: 14, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
          0.75,
        );

      const startEntrance = () => entrance.play();
      if (window.__bootDone) startEntrance();
      else window.addEventListener("boot:done", startEntrance, { once: true });

      /* — poster sweeps: void panel pulls away, revealing the color field — */
      gsap.utils.toArray<HTMLElement>("[data-sweep]").forEach((panel) => {
        gsap.set(panel, { scaleY: 1 });
        gsap.to(panel, {
          scaleY: 0,
          duration: 0.9,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: panel.parentElement,
            start: "top 72%",
            once: true,
          },
        });
      });

      /* — generic scroll reveals — */
      const reveal = (selector: string, vars: gsap.TweenVars) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
          gsap.from(el, {
            ...vars,
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
          });
        });
      };
      reveal("[data-reveal='heading']", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
      reveal("[data-reveal='block']", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      reveal("[data-reveal='case']", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
      reveal("[data-reveal='log']", {
        x: -24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      /* — stats: staggered rise + count-ups — */
      ScrollTrigger.batch("[data-reveal='stat']", {
        start: "top 86%",
        once: true,
        onEnter: (els) =>
          gsap.from(els, {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
          }),
      });
      gsap.utils.toArray<HTMLElement>("[data-countup]").forEach((el) => {
        const target = Number(el.dataset.countup ?? 0);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
        });
      });

      /* — stack cells cascade — */
      ScrollTrigger.batch("[data-reveal='cell']", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.from(els, {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
          }),
      });

      /* — hero planet drifts as you leave (desktop only) — */
      if (window.innerWidth >= 1024) {
        gsap.to("[data-reveal='planet']", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: "#hello",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      return () => {
        splits.forEach((s) => s.revert());
        window.removeEventListener("boot:done", startEntrance);
      };
    });

    // re-measure triggers once web fonts settle
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return null;
}
