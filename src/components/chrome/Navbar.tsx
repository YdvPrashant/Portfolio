"use client";

import { useState } from "react";
import { identity, navLinks } from "@/data/resume";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import Magnetic from "@/components/fx/MagneticButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-line bg-void/85 px-5 backdrop-blur-sm md:px-8">
        <button
          onClick={() => scrollTo("#hello")}
          className="flex items-baseline gap-3"
          aria-label="Back to top"
        >
          <span className="font-display text-xl leading-none">
            PY<span className="text-mint">.</span>
          </span>
          <span className="hud-label hidden text-muted sm:inline">
            PORTFOLIO/2026
          </span>
        </button>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="hud-label text-bone/80 transition-colors hover:text-mint"
            >
              {link.index}/{link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="hud-label hidden text-muted lg:inline">
            {identity.coordinates}
          </span>
          <Magnetic strength={0.25}>
            <button
              onClick={() => scrollTo("#contact")}
              className="hud-label hidden border border-mint bg-mint px-4 py-2 font-bold text-void transition-colors hover:bg-transparent hover:text-mint sm:block"
            >
              GET IN TOUCH
            </button>
          </Magnetic>
          <button
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span aria-hidden className="h-px w-6 bg-bone" />
            <span aria-hidden className="h-px w-6 bg-mint" />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
