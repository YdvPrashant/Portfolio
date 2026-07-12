import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  slow?: boolean;
  reverse?: boolean;
  className?: string;
};

/**
 * Seamless marquee: content rendered twice, track slides -50%.
 * Pure CSS animation; freezes under prefers-reduced-motion.
 */
export default function Marquee({
  children,
  slow = false,
  reverse = false,
  className = "",
}: Props) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex w-max items-center ${
          slow ? "animate-marquee-slow" : "animate-marquee"
        } motion-reduce:animate-none`}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
