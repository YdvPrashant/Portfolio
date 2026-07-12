import { existsSync } from "fs";
import { join } from "path";
import Magnetic from "@/components/fx/MagneticButton";
import { identity } from "@/data/resume";

/** 06/CONTACT — giant transmission CTA over the planet rising at the horizon. */
export default function Contact() {
  // build-time check: the resume button appears once the PDF is dropped in public/
  const resumeAvailable = existsSync(
    join(process.cwd(), "public", identity.resumePdf.replace(/^\//, "")),
  );

  return (
    <section
      id="contact"
      data-section-index="06"
      data-section-label="CONTACT"
      className="relative overflow-hidden border-t border-line"
    >
      {/* the ring rising at the horizon — the hero motif returning home */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[46rem] left-1/2 h-[56rem] w-[56rem] -translate-x-1/2"
      >
        <div className="relative h-full w-full rounded-full bg-cream">
          <div className="absolute inset-[15%] rounded-full bg-void" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-56 pt-24 text-center md:px-12 md:pb-72 md:pt-36">
        <p className="hud-label text-mint">[06] CONTACT — TRANSMISSION OPEN</p>

        <h2
          data-reveal="heading"
          className="display-type mt-8 text-[clamp(3rem,10vw,8.5rem)]"
        >
          LET&apos;S BUILD
          <br />
          SOMETHING<span className="text-mint">.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-md text-muted">
          Looking for a developer who can ship the interface and train the
          model? My inbox is open.
        </p>

        <div className="mt-12 flex flex-col items-center gap-6">
          <Magnetic strength={0.25}>
            <a
              href={`mailto:${identity.email}`}
              className="hud-label inline-block border border-mint bg-mint px-8 py-4 text-sm font-bold text-void transition-colors hover:bg-transparent hover:text-mint"
            >
              {identity.email.toUpperCase()} ↗
            </a>
          </Magnetic>

          <span className="hud-label flex items-center gap-2 text-bone/75">
            <span
              aria-hidden
              className="inline-block h-2 w-2 animate-pulse rounded-full bg-mint"
            />
            {identity.availability}
          </span>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-6">
            <a
              href={identity.github}
              target="_blank"
              rel="noreferrer"
              className="hud-label text-bone/80 transition-colors hover:text-mint"
            >
              GITHUB / {identity.githubHandle.toUpperCase()} ↗
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hud-label text-bone/80 transition-colors hover:text-mint"
            >
              LINKEDIN / {identity.linkedinHandle.toUpperCase()} ↗
            </a>
            {resumeAvailable && (
              <a
                href={identity.resumePdf}
                download
                className="hud-label text-bone/80 transition-colors hover:text-mint"
              >
                RESUME ⤓ PDF
              </a>
            )}
          </div>
        </div>
      </div>

      {/* site footer */}
      <footer className="relative border-t border-line bg-void">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 pb-14 pt-6 md:px-12">
          <p className="hud-label text-muted">© 2026 {identity.name.toUpperCase()}</p>
          <p className="hud-label text-muted">DESIGNED & BUILT FROM ORBIT</p>
          <p className="hud-label text-muted">
            LKO · {identity.coordinates}
          </p>
        </div>
      </footer>
    </section>
  );
}
