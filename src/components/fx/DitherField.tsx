"use client";

import { useEffect, useRef } from "react";
import { BAYER_4X4, createNoise3D, fbm, hexToRgb } from "@/lib/noise";
import { prefersReducedMotion } from "@/lib/hooks";

type Props = {
  /** CSS pixels per dither cell. */
  cell?: number;
  /** Two hexes, dim → bright; level 0 is transparent. */
  tones?: [string, string];
  /** Noise drift speed. */
  speed?: number;
  seed?: number;
  className?: string;
};

/**
 * Dithered noise clouds — the gray pixel blobs floating in the Juba hero.
 * A slow-drifting fbm field, masked by a soft radial falloff and quantized
 * to transparent/dim/bright through the shared Bayer matrix.
 */
export default function DitherField({
  cell = 4.5,
  tones = ["#23221e", "#403e36"],
  speed = 0.05,
  seed = 909,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = createNoise3D(seed);
    const reduced = prefersReducedMotion();
    const rgb = tones.map(hexToRgb);

    let raf = 0;
    let running = false;
    let W = 0;
    let H = 0;
    let img: ImageData | null = null;

    const build = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      W = Math.max(24, Math.round(w / cell));
      H = Math.max(24, Math.round(h / cell));
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
    };

    const render = (t: number) => {
      if (!img) return;
      const data = img.data;
      data.fill(0);

      for (let y = 0; y < H; y++) {
        const v = (y + 0.5) / H;
        for (let x = 0; x < W; x++) {
          const u = (x + 0.5) / W;
          // soft elliptical falloff so patches fade at the edges
          const dx = u * 2 - 1;
          const dy = v * 2 - 1;
          const mask = Math.max(0, 1 - (dx * dx + dy * dy));
          if (mask <= 0.02) continue;

          const n = fbm(noise, u * 3.1 + t * speed, v * 2.4, t * 0.11, 2);
          // sparse patches: only the upper part of the noise range shows
          const b = Math.max(0, Math.min(1, (n * mask - 0.28) / 0.34));
          if (b <= 0) continue;

          const q = b * 2 + (BAYER_4X4[y & 3][x & 3] - 0.5) * 1.2;
          const idx = Math.round(q);
          if (idx <= 0) continue;

          const tone = rgb[Math.min(idx, 2) - 1];
          const o = (y * W + x) * 4;
          data[o] = tone[0];
          data[o + 1] = tone[1];
          data[o + 2] = tone[2];
          data[o + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 80) return; // clouds crawl at ~12fps
      last = now;
      render(now / 1000);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => {
      build();
      render(reduced ? 0 : performance.now() / 1000);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px" },
    );
    io.observe(wrap);

    build();
    render(0);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell, speed, seed, tones.join()]);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
