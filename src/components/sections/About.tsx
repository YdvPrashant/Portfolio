import SectionHeading from "@/components/fx/SectionHeading";
import { about, education, stats } from "@/data/resume";

/** 02/ABOUT — the gold poster eruption. */
export default function About() {
  return (
    <section
      id="about"
      data-section-index="02"
      data-section-label="ABOUT"
      data-poster
      className="relative overflow-hidden bg-gold text-ink"
    >
      {/* void panel pulled away by the motion pass to reveal the gold */}
      <div
        aria-hidden
        data-sweep
        className="pointer-events-none absolute inset-0 z-10 origin-bottom scale-y-0 bg-void will-change-transform"
      />
      {/* quiet circle motif echo */}
      <div
        aria-hidden
        className="absolute -right-48 -top-48 h-[36rem] w-[36rem] rounded-full border border-ink/10"
      />
      <div
        aria-hidden
        className="absolute -bottom-64 -left-40 h-[30rem] w-[30rem] rounded-full border border-ink/10"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-12 md:py-36">
        <SectionHeading
          index="02"
          label="ABOUT"
          title={
            <>
              BOTH SIDES
              <br />
              OF THE STACK
            </>
          }
        />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-7" data-reveal="block">
            <p className="text-2xl font-medium leading-snug md:text-3xl">
              {about.lede}
            </p>
            {about.paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mt-6 max-w-prose text-base leading-relaxed text-ink/80 md:text-lg"
              >
                {p}
              </p>
            ))}
          </div>

          {/* education card — print-sticker offset shadow */}
          <div className="md:col-span-5" data-reveal="block">
            <div className="border border-ink bg-cream p-6 shadow-[8px_8px_0_0_var(--color-ink)] md:p-8">
              <p className="hud-label flex items-center justify-between font-bold">
                EDUCATION <span aria-hidden>▪</span>
              </p>
              <p className="mt-5 text-xl font-bold leading-tight md:text-2xl">
                {education.school}
              </p>
              <p className="mt-1 text-sm text-ink/70">{education.place}</p>
              <p className="mt-4 text-base font-medium">{education.degree}</p>
              <p className="hud-label mt-2 text-ink/70">
                GRADUATED — {education.graduated.toUpperCase()}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {education.coursework.map((c) => (
                  <span
                    key={c}
                    className="border border-ink/30 px-2.5 py-1 text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-ink/30 pt-12 md:mt-28 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} data-reveal="stat">
              <p className="display-type text-5xl md:text-6xl">
                <span data-countup={stat.value}>{stat.value}</span>
                {stat.suffix ?? ""}
              </p>
              <p className="hud-label mt-3 text-ink/70">{stat.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
