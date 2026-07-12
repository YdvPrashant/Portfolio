import DitherPlanet from "@/components/fx/DitherPlanet";
import DitherField from "@/components/fx/DitherField";
import Marquee from "@/components/fx/Marquee";
import SectionHeading from "@/components/fx/SectionHeading";
import Magnetic from "@/components/fx/MagneticButton";

/* TEMPORARY FX test bench — replaced by real sections in Phase 4. */
export default function Home() {
  return (
    <main>
      <section className="relative flex min-h-screen items-center justify-center">
        <DitherField className="absolute left-[6%] top-[10%] h-72 w-[28rem]" />
        <DitherField
          className="absolute bottom-[8%] right-[4%] h-56 w-80"
          seed={412}
        />
        <div className="relative aspect-square w-[min(68vmin,620px)] rounded-full bg-cream">
          <div className="absolute inset-[15%] rounded-full bg-void" />
          <DitherPlanet className="absolute inset-[17%] overflow-hidden rounded-full" />
        </div>
        <p className="hud-label absolute bottom-10 left-10 text-mint">
          FX BENCH — PLANET / FIELD / GRAIN
        </p>
        <Magnetic className="absolute bottom-10 right-10">
          <span className="hud-label inline-block border border-mint px-5 py-3 text-mint">
            MAGNETIC
          </span>
        </Magnetic>
      </section>

      <Marquee className="border-y border-line py-4">
        {["PYTORCH", "NEXT.JS", "TYPESCRIPT", "YOLOV8", "RAG", "OPENCV"].map(
          (s) => (
            <span key={s} className="hud-label px-8 text-muted">
              {s} <span className="text-mint">■</span>
            </span>
          ),
        )}
      </Marquee>

      <section className="px-10 py-40">
        <SectionHeading
          index="02"
          label="ABOUT"
          title={
            <>
              BUILDS BOTH
              <br />
              <span className="text-mint">SIDES OF THE STACK</span>
            </>
          }
        />
      </section>
    </main>
  );
}
