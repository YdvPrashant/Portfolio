import { certifications, competitive, experience } from "@/data/resume";

/** 05/CREDENTIALS — quiet terminal log between the loud sections. */
export default function Credentials() {
  return (
    <section
      id="credentials"
      data-section-index="05"
      data-section-label="CREDENTIALS"
      className="border-t border-line"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-12 md:py-24">
        <p className="hud-label flex items-center gap-4 text-bone/80">
          <span>[05]</span>
          <span>CREDENTIALS</span>
          <span aria-hidden className="h-px flex-1 bg-current opacity-30" />
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <ul className="space-y-4">
            {certifications.map((cert) => (
              <li
                key={cert.title}
                data-reveal="log"
                className="hud-label flex items-baseline text-bone/80"
              >
                <span className="text-mint">▸&nbsp;</span>
                <span>
                  {cert.title.toUpperCase()} — {cert.issuer.toUpperCase()}
                </span>
                <span
                  aria-hidden
                  className="mx-3 flex-1 border-b border-dotted border-muted/40"
                />
                <span className="text-mint">VERIFIED</span>
              </li>
            ))}
          </ul>

          <div data-reveal="log" className="border border-line p-6 md:p-8">
            <p className="display-type text-3xl md:text-4xl">
              {competitive.headline}
            </p>
            <div className="mt-4 space-y-2">
              {competitive.lines.map((line) => (
                <p key={line} className="hud-label text-bone/75">
                  <span className="text-mint">{line.split(" ")[0]}</span>{" "}
                  {line.split(" ").slice(1).join(" ").toUpperCase()}
                </p>
              ))}
            </div>
          </div>
        </div>

        {experience.length > 0 && (
          <div className="mt-16">
            <p className="hud-label text-muted">EXPERIENCE</p>
            <ul className="mt-6 space-y-8">
              {experience.map((job) => (
                <li key={`${job.company}-${job.period}`} className="grid gap-2 md:grid-cols-12">
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
      </div>
    </section>
  );
}
