"use client";

import { THEMES } from "@/data/themes";
import { useTheme } from "@/components/providers/ThemeProvider";

type Props = {
  /** "hud" = dark chrome (default); "poster" = the bright MobileMenu field. */
  variant?: "hud" | "poster";
  className?: string;
  /** Focusability for the buttons — pass -1 to park them (e.g. a closed menu). */
  tabIndex?: number;
};

/**
 * Small palette switcher — a row of accent swatches + a DEFAULT reset. Renders
 * straight from THEMES (convention 1). The astronaut cycles the theme too; this
 * is the explicit pick-a-colour / reset affordance.
 */
export default function ThemeControl({
  variant = "hud",
  className = "",
  tabIndex,
}: Props) {
  const { theme, setTheme, resetTheme } = useTheme();
  const poster = variant === "poster";

  return (
    <div
      className={`flex items-center gap-2.5 ${className}`}
      role="group"
      aria-label="Colour theme"
    >
      <span
        aria-hidden
        className={`hud-label text-[10px] ${
          poster ? "text-ink/70" : "hidden text-muted lg:inline"
        }`}
      >
        THEME
      </span>

      <div className="flex items-center gap-1.5">
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              tabIndex={tabIndex}
              aria-label={`${t.label} theme`}
              aria-pressed={active}
              title={t.label}
              style={{ backgroundColor: t.accent }}
              className={[
                "h-4 w-4 rounded-[2px] transition-transform duration-200",
                poster ? "border border-ink/30" : "border border-line",
                active
                  ? `scale-110 ring-1 ring-offset-2 ${
                      poster
                        ? "ring-ink ring-offset-signal"
                        : "ring-bone ring-offset-void"
                    }`
                  : "opacity-70 hover:scale-110 hover:opacity-100",
              ].join(" ")}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={resetTheme}
        tabIndex={tabIndex}
        aria-label="Reset to default theme"
        className={[
          "hud-label border px-2 py-1 text-[10px] font-bold transition-colors",
          poster
            ? "border-ink/40 text-ink hover:bg-ink hover:text-signal"
            : "border-bone/25 text-bone/80 hover:border-mint hover:text-mint",
        ].join(" ")}
      >
        DEFAULT
      </button>
    </div>
  );
}
