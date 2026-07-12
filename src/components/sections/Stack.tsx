import Marquee from "@/components/fx/Marquee";
import SectionHeading from "@/components/fx/SectionHeading";
import { skills } from "@/data/resume";

/** 03/STACK — dark HUD instrument panel of skill clusters. */
export default function Stack() {
  const allSkills = skills.flatMap((group) => group.items);

  return (
    <section
      id="stack"
      data-section-index="03"
      data-section-label="STACK"
      className="relative"
    >
      {/* full-width capability ticker */}
      <Marquee className="border-b border-line py-4" slow>
        {allSkills.map((item) => (
          <span key={item} className="hud-label flex items-center px-6 text-muted">
            {item.toUpperCase()}
            <span aria-hidden className="ml-12 text-mint">
              ■
            </span>
          </span>
        ))}
      </Marquee>

      <div className="mx-auto max-w-7xl px-5 py-24 md:px-12 md:py-36">
        <SectionHeading
          index="03"
          label="STACK"
          title="INSTRUMENT PANEL"
          titleClassName="text-bone"
        />

        <div className="mt-14 grid gap-px border border-line bg-line md:mt-20 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((group) => (
            <div
              key={group.index}
              data-reveal="cell"
              className="group bg-void p-6 transition-colors duration-300 hover:bg-panel md:p-8"
            >
              <p className="hud-label flex items-baseline justify-between">
                <span className="text-mint">
                  [{group.index}] {group.label}
                </span>
                <span className="text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line px-3 py-1.5 text-sm text-bone/85 transition-colors duration-300 group-hover:border-mint/40"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p
                aria-hidden
                className="mt-6 text-right text-mint opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                ▪
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
