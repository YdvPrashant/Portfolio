"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/** The live Lenis instance, or null (SSR / reduced motion → native scroll). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/** Smooth-scroll to an anchor, falling back to native scroll. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string) => {
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    } else {
      document
        .querySelector(target)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // native scrolling, no hijack

    const instance = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
