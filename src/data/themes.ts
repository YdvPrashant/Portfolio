/**
 * Theme presets for the runtime palette switcher.
 *
 * The actual token values live in `globals.css` (the `html[data-theme="…"]`
 * blocks). This file is the ordered source of truth for *cycling* and for the
 * swatch / readout UI — `accent` mirrors each theme's `--color-mint` so controls
 * can paint a swatch without reading computed styles off the DOM.
 *
 * Keep this list in sync with the `html[data-theme]` rules in globals.css.
 */
export const THEMES = [
  { id: "default", label: "MINT", accent: "#c3fffc" },
  { id: "amber", label: "AMBER", accent: "#e0a94a" },
  { id: "signal", label: "SIGNAL", accent: "#ff5a4d" },
  { id: "phosphor", label: "PHOSPHOR", accent: "#62ff9b" },
  { id: "ice", label: "ICE", accent: "#8fe6ff" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "default";

/** localStorage key — also referenced by the no-flash script in layout.tsx. */
export const THEME_STORAGE_KEY = "pf-theme";

/**
 * Window event fired when a theme is *applied* (click / swatch / keyboard /
 * reset) — never on the initial persisted-theme sync at load — so effects like
 * the astronaut reaction respond only to real, user-driven changes.
 */
export const THEME_CHANGE_EVENT = "theme:change";
