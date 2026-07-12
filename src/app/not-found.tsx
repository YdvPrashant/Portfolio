import Link from "next/link";

/** 404 — poster-red LOST IN ORBIT. */
export default function NotFound() {
  return (
    <main
      data-poster
      className="relative flex min-h-svh flex-col items-center justify-center gap-10 overflow-hidden bg-signal px-6 text-center text-ink"
    >
      <div
        aria-hidden
        className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border-[2.5rem] border-cream/90"
      />
      <div
        aria-hidden
        className="absolute -bottom-52 -left-32 h-[24rem] w-[24rem] rounded-full border border-ink/20"
      />

      <p className="hud-label font-bold text-ink/70">
        ERROR 404 — SIGNAL NOT FOUND
      </p>
      <h1 className="display-type text-[clamp(3.5rem,12vw,10rem)]">
        LOST IN
        <br />
        ORBIT
      </h1>
      <Link
        href="/"
        className="hud-label border border-ink px-6 py-4 font-bold transition-colors hover:bg-ink hover:text-cream"
      >
        RETURN TO BASE ↗
      </Link>
    </main>
  );
}
