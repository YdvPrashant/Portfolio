"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { identity, navLinks } from "@/data/resume";
import { useLenis, useScrollTo } from "@/components/providers/SmoothScroll";
import { prefersReducedMotion } from "@/lib/hooks";
import ThemeControl from "./ThemeControl";

type Props = { open: boolean; onClose: () => void; resumeAvailable?: boolean };

/** Full-screen poster-red menu — the Evil Martians moment on mobile. */
export default function MobileMenu({
  open,
  onClose,
  resumeAvailable = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();
  const lenis = useLenis();

  // scroll lock + escape to close + focus handoff
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    ref.current
      ?.querySelector<HTMLButtonElement>("[data-menu-close]")
      ?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = prefersReducedMotion();

      if (open) {
        // normalize away the parsed px offset from the SSR inline transform,
        // then animate a GSAP-owned percentage
        gsap.set(el, { y: 0, yPercent: -100 });
        if (reduced) {
          gsap.set(el, { yPercent: 0 });
          return;
        }
        gsap.to(el, { yPercent: 0, duration: 0.55, ease: "power4.out" });
        gsap.fromTo(
          el.querySelectorAll("[data-menu-link]"),
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            delay: 0.15,
            ease: "power3.out",
          },
        );
      } else if (reduced) {
        gsap.set(el, { y: 0, yPercent: -100 });
      } else {
        gsap.to(el, { yPercent: -100, duration: 0.45, ease: "power4.in" });
      }
    },
    { dependencies: [open] },
  );

  const go = (href: string) => {
    onClose();
    // let the panel clear before the page glides
    setTimeout(() => scrollTo(href), 350);
  };

  return (
    <div
      ref={ref}
      id="mobile-menu"
      data-poster
      aria-hidden={!open}
      className="fixed inset-0 z-[60] flex flex-col justify-between bg-signal px-6 pb-10 pt-5 text-ink"
      style={{ transform: "translateY(-100%)" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-xl leading-none">PY.</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          data-menu-close
          className="hud-label border border-ink/40 px-4 py-2 font-bold"
          tabIndex={open ? 0 : -1}
        >
          CLOSE ✕
        </button>
      </div>

      <nav aria-label="Sections" className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <button
            key={link.href}
            data-menu-link
            onClick={() => go(link.href)}
            tabIndex={open ? 0 : -1}
            className="display-type flex items-baseline gap-4 text-left text-5xl"
          >
            <span className="hud-label font-bold opacity-60">{link.index}</span>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-6">
        <div data-menu-link>
          <ThemeControl variant="poster" tabIndex={open ? 0 : -1} />
        </div>
        <div data-menu-link className="hud-label flex flex-wrap gap-x-6 gap-y-2 font-bold">
          <a href={`mailto:${identity.email}`} tabIndex={open ? 0 : -1}>
            EMAIL ↗
          </a>
        <a href={identity.github} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
          GITHUB ↗
        </a>
        <a href={identity.linkedin} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
          LINKEDIN ↗
        </a>
        {resumeAvailable && (
          <>
            <a
              href={identity.resumePdf}
              target="_blank"
              rel="noreferrer"
              tabIndex={open ? 0 : -1}
            >
              VIEW CV ↗
            </a>
            <a href={identity.resumePdf} download tabIndex={open ? 0 : -1}>
              DOWNLOAD CV ⤓
            </a>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
