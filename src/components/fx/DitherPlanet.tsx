"use client";

import { useEffect, useRef } from "react";
import { BAYER_4X4, createNoise3D, fbm, hexToRgb } from "@/lib/noise";
import { prefersReducedMotion } from "@/lib/hooks";

/** Planet surface ramp, dark → bright: umber, martian red, gold, cream. */
const TONES = ["#140d05", "#8a2b1e", "#d9a93d", "#e7dfcc"].map(hexToRgb);

type Props = {
  /** CSS pixels per dither cell — bigger = chunkier. */
  cell?: number;
  /** Surface rotation in radians/second. */
  rotSpeed?: number;
  className?: string;
};

/**
 * The site's signature: a slowly drifting sphere shaded with 3D value noise
 * and quantized through a Bayer 4×4 ordered dither to 4 poster tones.
 * Renders at low resolution and upscales with crisp pixels.
 * Static single frame under prefers-reduced-motion; pauses offscreen.
 */
export default function DitherPlanet({
  cell = 3.5,
  rotSpeed = 0.055,
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

    const noise = createNoise3D(2077);
    const reduced = prefersReducedMotion();

    let raf = 0;
    let running = false;
    let W = 0;
    let H = 0;
    let img: ImageData | null = null;

    // per-pixel sphere data, precomputed on resize
    let count = 0;
    let px = new Int32Array(0);
    let lam = new Float32Array(0);
    let lat = new Float32Array(0);
    let lon0 = new Float32Array(0);

    const build = () => {
      const size = Math.min(wrap.clientWidth, wrap.clientHeight);
      if (!size) return;
      W = H = Math.max(48, Math.round(size / cell));
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);

      const maxPix = W * H;
      px = new Int32Array(maxPix);
      lam = new Float32Array(maxPix);
      lat = new Float32Array(maxPix);
      lon0 = new Float32Array(maxPix);
      count = 0;

      const R = 0.96;
      const lx = -0.42; // light from upper-left-front
      const ly = -0.52;
      const lz = 0.74;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const cx = ((x + 0.5) / W) * 2 - 1;
          const cy = ((y + 0.5) / H) * 2 - 1;
          const d2 = (cx * cx + cy * cy) / (R * R);
          if (d2 > 1) continue;
          const nx = cx / R;
          const ny = cy / R;
          const nz = Math.sqrt(1 - d2);
          const light = Math.max(0, nx * lx + ny * ly + nz * lz);
          const i = count++;
          px[i] = y * W + x;
          lam[i] = Math.pow(light, 0.85);
          lat[i] = Math.asin(Math.max(-1, Math.min(1, ny)));
          lon0[i] = Math.atan2(nx, nz);
        }
      }
    };

    const render = (t: number) => {
      if (!img) return;
      const data = img.data;
      data.fill(0); // transparent outside the sphere
      const levels = TONES.length - 1;

      for (let i = 0; i < count; i++) {
        const p = px[i];
        const x = p % W;
        const y = (p / W) | 0;
        const lon = lon0[i] + t * rotSpeed;
        const cl = Math.cos(lon);
        const sl = Math.sin(lon);
        // latitude-stretched banding + finer surface detail
        const band = noise(cl * 1.15, sl * 1.15, lat[i] * 3.1 + 7.3);
        const detail = fbm(noise, cl * 2.7, sl * 2.7, lat[i] * 2.7, 2);
        const tex = 0.6 * band + 0.4 * detail;
        let b = lam[i] * (0.38 + 0.85 * tex);
        if (b > 1) b = 1;

        const q = b * levels + (BAYER_4X4[y & 3][x & 3] - 0.5) * 1.15;
        let idx = Math.round(q);
        if (idx < 0) idx = 0;
        else if (idx > levels) idx = levels;

        const tone = TONES[idx];
        const o = p * 4;
        data[o] = tone[0];
        data[o + 1] = tone[1];
        data[o + 2] = tone[2];
        data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps is plenty for dither
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
  }, [cell, rotSpeed]);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
