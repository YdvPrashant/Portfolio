import Magnetic from "@/components/fx/MagneticButton";
import SectionHeading from "@/components/fx/SectionHeading";
import { projects, workCopy, otherProjects, experience } from "@/data/resume";

/** 04/WORK — red poster header, then dark case files. */
export default function Work() {
  return (
    <section id="work" data-section-index="04" data-section-label="WORK">
      {/* signal-red eruption */}
      <div
        data-poster
        className="relative overflow-hidden bg-signal text-ink"
      >
        {/* void panel pulled away by the motion pass to reveal the red */}
        <div
          aria-hidden
          data-sweep
          className="pointer-events-none absolute inset-0 z-10 origin-bottom scale-y-0 bg-void will-change-transform"
        />
        {/* cream ring sliver — the poster motif crashing the frame */}
        <div
          aria-hidden
          className="absolute -right-56 -top-[26rem] h-[44rem] w-[44rem] rounded-full border-[3.5rem] border-cream/90"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-12 md:py-32">
          <SectionHeading
            index="04"
            label="WORK"
            title="PROOF OF WORK"
          />
          <p className="hud-label mt-8 max-w-md font-bold text-ink/80">
            {workCopy.poster}
          </p>
        </div>
      </div>

      {/* case files */}
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        {projects.map((project) => (
          <article
            key={project.index}
            data-reveal="case"
            className="group grid gap-8 border-b border-line py-16 last:border-b-0 md:grid-cols-12 md:py-20"
          >
            {/* index */}
            <div className="md:col-span-2">
              <span className="display-type block text-6xl text-bone/10 transition-colors duration-500 group-hover:text-mint/25 md:text-7xl">
                {project.index}
              </span>
            </div>

            {/* body */}
            <div className="md:col-span-6">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="display-type text-4xl md:text-5xl">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="hud-label bg-signal px-2 py-1 font-bold text-ink">
                    FLAGSHIP · LIVE
                  </span>
                )}
              </div>
              <p className="hud-label mt-3 text-mint">{project.subtitle.toUpperCase()}</p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                {project.pitch}
              </p>
              <ul className="mt-6 space-y-3">
                {project.bullets.map((bullet) => (
                  <li
                    key={bullet.slice(0, 24)}
                    className="flex gap-3 text-sm leading-relaxed text-bone/75"
                  >
                    <span aria-hidden className="mt-0.5 text-mint">
                      ▸
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* tech, metrics, links */}
            <div className="md:col-span-4">
              <p className="hud-label text-muted">TELEMETRY</p>

              {project.metrics && (
                <div className="mt-4 space-y-4">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between">
                        <span className="hud-label text-bone/75">{m.label}</span>
                        <span className="font-mono text-2xl font-bold text-mint">
                          {m.value}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 bg-line">
                        <div
                          className="h-full bg-mint"
                          style={{ width: `${parseFloat(m.value) <= 1 ? parseFloat(m.value) * 100 : parseFloat(m.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="hud-label border border-line px-2.5 py-1 text-[10px] text-bone/70"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {project.links.live && (
                  <Magnetic strength={0.3}>
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="hud-label inline-block border border-mint bg-mint px-5 py-3 font-bold text-void transition-colors hover:bg-transparent hover:text-mint"
                    >
                      LIVE SITE ↗
                    </a>
                  </Magnetic>
                )}
                <Magnetic strength={0.3}>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hud-label inline-block border border-bone/30 px-5 py-3 text-bone transition-colors hover:border-mint hover:text-mint"
                  >
                    GITHUB ↗
                  </a>
                </Magnetic>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* experience — appears automatically once the array is non-empty */}
      {experience.length > 0 && (
        <div className="mx-auto max-w-7xl border-t border-line px-5 py-16 md:px-12 md:py-20">
          <p className="hud-label text-muted">EXPERIENCE</p>
          <ul className="mt-6 space-y-8">
            {experience.map((job) => (
              <li
                key={`${job.company}-${job.period}`}
                data-reveal="log"
                className="grid gap-2 md:grid-cols-12"
              >
                <p className="hud-label text-mint md:col-span-3">{job.period}</p>
                <div className="md:col-span-9">
                  <p className="text-lg font-medium">
                    {job.role} — {job.company}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {job.bullets.map((b) => (
                      <li key={b.slice(0, 24)} className="text-sm text-bone/70">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* archive — smaller builds, data-driven; hidden when the array is empty */}
      {otherProjects.length > 0 && (
        <div className="mx-auto max-w-7xl border-t border-line px-5 py-16 md:px-12 md:py-20">
          <p className="hud-label flex items-center gap-4 text-bone/80">
            <span>ARCHIVE</span>
            <span aria-hidden className="h-px flex-1 bg-current opacity-30" />
          </p>
          <p className="hud-label mt-3 text-muted">{workCopy.archiveNote}</p>
          <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
            {otherProjects.map((p) => (
              <div
                key={p.title}
                data-reveal="cell"
                className="flex flex-col bg-void p-6"
              >
                <p className="hud-label flex items-baseline justify-between text-muted">
                  <span>{p.year ?? "—"}</span>
                  <span aria-hidden className="text-mint">
                    ■
                  </span>
                </p>
                <h3 className="display-type mt-4 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {p.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="hud-label border border-line px-2 py-0.5 text-[10px] text-bone/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex gap-5 pt-5">
                  {p.links.live && (
                    <a
                      href={p.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="hud-label text-bone/80 transition-colors hover:text-mint"
                    >
                      LIVE ↗
                    </a>
                  )}
                  {p.links.github && (
                    <a
                      href={p.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hud-label text-bone/80 transition-colors hover:text-mint"
                    >
                      GITHUB ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
