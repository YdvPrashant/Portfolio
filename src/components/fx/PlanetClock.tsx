"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * A 12-hour analogue clock painted onto the hero planet's cream ring: twelve
 * stationary ink hour ticks, plus a tiny astronaut that hovers at the real-time
 * hour-hand position (9:00 parks it over the 9). Purely decorative — aria-hidden
 * and pointer-events-none — except the astronaut itself, which is tappable:
 * clicking it sends it on one full clockwise lap of the ring that eases back
 * onto the current time. On arrival a small "click me" bubble greets from the
 * astronaut for a few seconds.
 *
 * Everything lives in a 0–100 square that matches the cream disc, so the same
 * numbers drive the SVG ticks and the astronaut's percentage offset. Radii are
 * measured from the centre: the void/planet ends at 35, the cream ring runs
 * 35→50, ticks sit in its outer band and the astronaut rides just inside them.
 *
 * The astronaut node carries only inline left/top plus a Tailwind centering
 * translate — the lap animates left/top, never a transform — so nothing stacks
 * (CLAUDE.md convention 6). Under prefers-reduced-motion it's placed once and
 * left there, with no greeting and no spin.
 */

const ASTRO_RADIUS = 40; // % from centre — inner edge of the cream ring band
const LAP_SECONDS = 2; // one full revolution on click
const BUBBLE_DELAY = 1300; // ms after boot:done — lets the planet entrance settle
const BUBBLE_HOLD = 4200; // ms the "click me" greeting stays up

/** Twelve hour ticks; 12·3·6·9 are longer, thicker and a touch darker. */
const TICKS = Array.from({ length: 12 }, (_, h) => {
  const a = (h * 30 * Math.PI) / 180;
  const sin = Math.sin(a);
  const cos = -Math.cos(a); // screen y grows downward; 12 o'clock is up
  const major = h % 3 === 0;
  const rIn = major ? 43 : 45.5;
  const rOut = major ? 49 : 48.5;
  return {
    x1: 50 + rIn * sin,
    y1: 50 + rIn * cos,
    x2: 50 + rOut * sin,
    y2: 50 + rOut * cos,
    width: major ? 0.45 : 0.3,
    opacity: major ? 0.9 : 0.65,
  };
});

/** Hour-hand angle for a moment in time: (h % 12)·30 + m·0.5, from 12 o'clock. */
function handAngle(now: Date) {
  return ((now.getHours() % 12) * 30 + now.getMinutes() * 0.5) * (Math.PI / 180);
}

export default function PlanetClock() {
  const astroRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const astro = astroRef.current;
    if (!astro) return;

    let spinning = false;

    const positionAt = (a: number) => {
      astro.style.left = `${50 + ASTRO_RADIUS * Math.sin(a)}%`;
      astro.style.top = `${50 - ASTRO_RADIUS * Math.cos(a)}%`;
    };
    const place = () => {
      if (spinning) return; // don't fight the lap animation
      positionAt(handAngle(new Date()));
      astro.style.opacity = "1";
    };

    place(); // client-only → correct time, clean hydration
    if (prefersReducedMotion()) return; // static clock: no greeting, no spin

    // — arrival greeting —
    const bubble = bubbleRef.current;
    let dismissed = false;
    const showBubble = () => {
      if (!dismissed && bubble) bubble.style.opacity = "1";
    };
    const hideBubble = () => {
      if (bubble) bubble.style.opacity = "0";
    };

    // — click the astronaut → one full clockwise lap, settling on the real time —
    astro.style.pointerEvents = "auto";
    astro.style.cursor = "pointer";
    let lap: gsap.core.Tween | undefined;
    const spin = () => {
      if (spinning) return;
      spinning = true;
      dismissed = true;
      hideBubble();
      const proxy = { a: handAngle(new Date()) };
      lap = gsap.to(proxy, {
        a: proxy.a + Math.PI * 2,
        duration: LAP_SECONDS,
        ease: "power2.inOut",
        onUpdate: () => positionAt(proxy.a),
        onComplete: () => {
          spinning = false;
          place(); // snap onto the true current time
        },
      });
    };
    astro.addEventListener("click", spin);

    // the hand barely creeps; a lazy tick keeps it honest over a long session
    const tick = window.setInterval(place, 30_000);

    // greet once the boot screen is gone and the hero has settled
    let showT = 0;
    let hideT = 0;
    const greet = () => {
      showT = window.setTimeout(showBubble, BUBBLE_DELAY);
      hideT = window.setTimeout(hideBubble, BUBBLE_DELAY + BUBBLE_HOLD);
    };
    if (window.__bootDone) greet();
    else window.addEventListener("boot:done", greet, { once: true });

    return () => {
      lap?.kill();
      astro.removeEventListener("click", spin);
      window.clearInterval(tick);
      window.clearTimeout(showT);
      window.clearTimeout(hideT);
      window.removeEventListener("boot:done", greet);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* stationary hour ticks */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--color-ink)"
            strokeWidth={t.width}
            strokeLinecap="round"
            opacity={t.opacity}
          />
        ))}
      </svg>

      {/* real-time astronaut — position + interaction wired up in the effect */}
      <div
        ref={astroRef}
        className="absolute w-[6%] -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{ left: "50%", top: "10%" }}
      >
        {/* comfortable tap target around the tiny figure */}
        <span className="absolute -inset-2" />
        <Astronaut />

        {/* "click me" greeting, emanating from the astronaut on arrival */}
        <div
          ref={bubbleRef}
          className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-500"
        >
          <div className="relative rounded-md bg-void/95 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mint shadow-lg ring-1 ring-mint/30 backdrop-blur-sm">
            click me
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-void/95" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Tiny floating spaceman with dimensional shading: a spherically-lit helmet, a
 * gradient-shaded suit (lit upper-left to match the scene's light), a dark glass
 * visor with a mint reflection, and a mint chest light. Limbs splay for a
 * floating read. Stays legible at ~18–31px.
 */
function Astronaut() {
  return (
    <svg viewBox="0 0 26 30" className="block h-auto w-full -rotate-[8deg]">
      <defs>
        <radialGradient id="pc-helmet" cx="36%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#635c4b" />
          <stop offset="46%" stopColor="#221c12" />
          <stop offset="100%" stopColor="#0f0c07" />
        </radialGradient>
        <linearGradient id="pc-suit" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#4a4234" />
          <stop offset="50%" stopColor="#1b160f" />
          <stop offset="100%" stopColor="#0b0905" />
        </linearGradient>
        <linearGradient id="pc-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b3f42" />
          <stop offset="60%" stopColor="#0a1416" />
          <stop offset="100%" stopColor="#05090a" />
        </linearGradient>
      </defs>

      {/* splayed limbs, behind the torso */}
      <g fill="url(#pc-suit)">
        <rect x="2.4" y="12.5" width="3.6" height="7.2" rx="1.8" transform="rotate(24 4.2 13)" />
        <rect x="20" y="12.5" width="3.6" height="7.2" rx="1.8" transform="rotate(-24 21.8 13)" />
        <rect x="8.6" y="20" width="3.6" height="7.2" rx="1.8" transform="rotate(14 10.4 20.5)" />
        <rect x="13.8" y="20" width="3.6" height="7.2" rx="1.8" transform="rotate(-14 15.6 20.5)" />
      </g>

      {/* torso + mint chest light */}
      <rect x="8" y="11.5" width="10" height="10" rx="3.6" fill="url(#pc-suit)" />
      <circle cx="13" cy="15" r="0.95" fill="var(--color-mint)" />

      {/* helmet sphere → glass visor → mint reflection → specular glint */}
      <circle cx="13" cy="8" r="5.6" fill="url(#pc-helmet)" />
      <rect x="9.6" y="5.4" width="6.8" height="5" rx="2.5" fill="url(#pc-visor)" />
      <path d="M10.7 6.5 Q12.4 5.5 14.2 6.1" fill="none" stroke="var(--color-mint)" strokeWidth="0.6" strokeLinecap="round" opacity="0.85" />
      <ellipse cx="10.7" cy="5.7" rx="1.5" ry="1.05" fill="#eae6da" opacity="0.45" />
    </svg>
  );
}
