"use client";

import { identity } from "@/data/resume";
import { THEMES } from "@/data/themes";
import { useActiveSection, useClock, useMousePosition } from "@/lib/hooks";
import { useScrollProgress } from "@/components/providers/SmoothScroll";
import { useTheme } from "@/components/providers/ThemeProvider";

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

/** Fixed telemetry footer — the Juba instrument strip. Decorative, desktop only. */
export default function StatusBar() {
  const progress = useScrollProgress();
  const { x, y } = useMousePosition();
  const time = useClock(identity.timezone);
  const active = useActiveSection();
  const { theme } = useTheme();
  const accent = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div
      aria-hidden
      className="hud-label fixed inset-x-0 bottom-0 z-50 hidden h-9 items-center justify-between border-t border-line bg-void/85 px-5 text-[10px] text-muted backdrop-blur-sm md:flex"
    >
      <div className="flex items-center gap-6">
        <span>
          SCRL <span className="text-mint">{progress.toFixed(2)}</span>
        </span>
        <span className="hidden lg:inline">
          CRSR {pad(x)},{pad(y)}
        </span>
      </div>

      <div className="text-bone/70">
        {active.index} — {active.label}
      </div>

      <div className="flex items-center gap-6">
        <span className="hidden xl:inline">
          {identity.coordinates} {identity.location.toUpperCase()}
        </span>
        <span>
          {identity.timezoneLabel} {time ?? "--:--:--"}
        </span>
        <span className="hidden items-center gap-2 lg:flex">
          THEME{" "}
          <span
            className="inline-block h-2.5 w-2.5"
            style={{ backgroundColor: accent.accent }}
          />{" "}
          {accent.accent.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
