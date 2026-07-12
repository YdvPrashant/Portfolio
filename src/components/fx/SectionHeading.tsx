import type { ReactNode } from "react";

type Props = {
  /** Section index in the site's numbering, e.g. "02". */
  index: string;
  /** Short HUD label, e.g. "ABOUT". */
  label: string;
  /** The giant display title. */
  title: ReactNode;
  className?: string;
  titleClassName?: string;
};

/** Numbered section header — the HUD voice announcing each section. */
export default function SectionHeading({
  index,
  label,
  title,
  className = "",
  titleClassName = "",
}: Props) {
  return (
    <header className={className}>
      <p className="hud-label flex items-center gap-4 opacity-80">
        <span>[{index}]</span>
        <span>{label}</span>
        <span aria-hidden className="h-px flex-1 bg-current opacity-30" />
      </p>
      <h2
        data-reveal="heading"
        className={`display-type mt-6 text-[clamp(2.75rem,8vw,7rem)] ${titleClassName}`}
      >
        {title}
      </h2>
    </header>
  );
}
