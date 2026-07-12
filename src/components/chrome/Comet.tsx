/**
 * Site-wide comet companion. Pure markup — MotionOrchestrator drives it with a
 * scrubbed timeline that glides and swaps sides through the sections.
 *
 * Defaults keep it invisible (`opacity-0`, `hidden md:block`) until the
 * orchestrator flips it on, so it is absent on mobile, under reduced motion,
 * and on any page without the orchestrator (e.g. 404). `fixed` + transform-only
 * motion means it never affects layout. The animated node has no Tailwind
 * transform utility (convention 6) — only GSAP writes its transform.
 */
export default function Comet() {
  return (
    <div
      aria-hidden
      data-comet
      className="pointer-events-none fixed left-0 top-0 z-40 hidden opacity-0 md:block"
      style={{ transform: "translate(0,0)" }}
    >
      <span className="absolute right-full top-1/2 h-px w-10 -translate-y-1/2 bg-gradient-to-l from-mint/70 to-transparent" />
      <span className="block h-2 w-2 rounded-full bg-mint shadow-[0_0_14px_3px_rgba(195,255,252,0.45)]" />
    </div>
  );
}
