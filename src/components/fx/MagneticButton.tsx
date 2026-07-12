"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  /** How strongly the element chases the cursor (0–1). */
  strength?: number;
  className?: string;
};

/** Wrapper that pulls its child toward the cursor. Fine pointers only. */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (prefersReducedMotion()) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
