import DitherPlanet from "@/components/fx/DitherPlanet";
import DitherField from "@/components/fx/DitherField";
import OrbitSatellite from "@/components/fx/OrbitSatellite";
import PlanetClock from "@/components/fx/PlanetClock";
import ShootingStars from "@/components/fx/ShootingStars";
import { heroMeta, identity } from "@/data/resume";

/** 01/HELLO — giant name over the dithered planet in its cream ring. */
export default function Hero() {
  return (
    <section
      id="hello"
      data-section-index="01"
      data-section-label="HELLO"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pb-24 pt-24 md:px-12 lg:pb-16"
    >
      {/* dithered clouds, Juba-style */}
      <DitherField className="absolute left-[4%] top-[12%] h-64 w-[26rem] max-w-[70vw]" />
      <DitherField
        className="absolute bottom-[14%] right-[30%] hidden h-52 w-80 lg:block"
        seed={412}
      />

      {/* occasional mint streaks across the sky (also the click-burst layer) */}
      <ShootingStars />

      {/* planet in the cream ring, crosshaired like the poster */}
      <div
        data-reveal="planet"
        className="relative isolate mx-auto mt-4 w-[min(68vw,300px)] lg:absolute lg:right-[5%] lg:top-1/2 lg:mt-0 lg:w-[min(34vw,520px)] lg:-translate-y-1/2"
      >
        <OrbitSatellite />
        <div className="relative z-10 aspect-square w-full rounded-full bg-cream">
          <div className="absolute inset-[15%] rounded-full bg-void" />
          <DitherPlanet
            interactive
            className="absolute inset-[16.5%] overflow-hidden rounded-full"
          />
          {/* hairline crosshair */}
          <div aria-hidden className="absolute left-1/2 top-[-8%] h-[116%] w-px bg-bone/15" />
          <div aria-hidden className="absolute left-[-8%] top-1/2 h-px w-[116%] bg-bone/15" />
          {/* analogue hour clock: stationary ticks + real-time astronaut */}
          <PlanetClock />
        </div>
      </div>

      {/* name block */}
      <div className="relative z-10 mt-8 lg:mt-0">
        <p data-reveal="overline" className="hud-label text-mint">
          {identity.role}
          <span aria-hidden className="ml-2 inline-block h-3 w-2 animate-pulse bg-mint align-middle" />
        </p>
        <p data-reveal="overline" className="mt-3 max-w-md text-base text-muted md:text-lg">
          {identity.tagline}
        </p>
        <h1
          className="display-type mt-6 text-[clamp(3.6rem,13vw,11.5rem)] lg:text-[clamp(4rem,8.4vw,10.5rem)]"
          aria-label={identity.name}
        >
          <span aria-hidden data-hero-line className="block">
            {identity.firstName}
          </span>
          <span aria-hidden data-hero-line className="block text-mint">
            {identity.lastName}.
          </span>
        </h1>
      </div>

      {/* meta chips + scroll cue */}
      <div className="relative z-10 mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 lg:absolute lg:bottom-14 lg:left-12 lg:right-12 lg:mt-0">
        {heroMeta.map((chip) => (
          <span key={chip} data-reveal="chip" className="hud-label flex items-center gap-2 text-bone/75">
            <span aria-hidden className="inline-block h-2 w-2 bg-mint" />
            {chip}
          </span>
        ))}
        <span
          aria-hidden
          className="hud-label ml-auto hidden items-center gap-2 text-muted lg:flex"
        >
          ▾ SCROLL
        </span>
      </div>
    </section>
  );
}
