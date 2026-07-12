"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  THEMES,
  type ThemeId,
} from "@/data/themes";
import { prefersReducedMotion } from "@/lib/hooks";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  cycleTheme: () => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Palette switcher: reskins the dark HUD by swapping html[data-theme]. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

const TRANSITION_MS = 550;

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Start at the default to match the server render, then sync to whatever the
  // no-flash script already put on <html> (mirrors useClock/useMediaQuery).
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const themeRef = useRef(theme);
  const transitionTimer = useRef<number | undefined>(undefined);

  // keep the latest theme in a ref so cycleTheme (called from handlers) is fresh
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // adopt the persisted value the inline script applied pre-paint — a one-time
  // sync from the DOM to React state (same pattern as SmoothScroll's publish)
  useEffect(() => {
    const attr = document.documentElement.dataset.theme as ThemeId | undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (attr && attr !== DEFAULT_THEME) setThemeState(attr);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();

    if (!reduced) {
      window.clearTimeout(transitionTimer.current);
      root.classList.add("theme-transition");
      // commit the "before" state (old colours + transition) so the swap eases
      void root.offsetHeight;
    }

    if (next === DEFAULT_THEME) delete root.dataset.theme;
    else root.dataset.theme = next;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode) — theme still applies this session */
    }

    setThemeState(next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));

    if (!reduced) {
      transitionTimer.current = window.setTimeout(
        () => root.classList.remove("theme-transition"),
        TRANSITION_MS,
      );
    }
  }, []);

  const cycleTheme = useCallback(() => {
    const i = THEMES.findIndex((t) => t.id === themeRef.current);
    setTheme(THEMES[(i + 1) % THEMES.length].id);
  }, [setTheme]);

  const resetTheme = useCallback(() => setTheme(DEFAULT_THEME), [setTheme]);

  // keyboard shortcut: `T` cycles (ignored while typing / with modifiers)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "t" && e.key !== "T") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      e.preventDefault();
      cycleTheme();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, cycleTheme, resetTheme }),
    [theme, setTheme, cycleTheme, resetTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
