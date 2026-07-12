import { ImageResponse } from "next/og";
import { identity } from "@/data/resume";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Prashant Yadav — Software Developer · AI/ML";

/** Poster-style social card: dark HUD field, cream ring, giant name. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#eae6da",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* cream ring crashing the right edge */}
        <div
          style={{
            position: "absolute",
            right: -180,
            top: 40,
            width: 560,
            height: 560,
            borderRadius: 9999,
            border: "72px solid #e7dfcc",
            display: "flex",
          }}
        />
        {/* gold planet inside */}
        <div
          style={{
            position: "absolute",
            right: -60,
            top: 208,
            width: 224,
            height: 224,
            borderRadius: 9999,
            background: "#d9a93d",
            display: "flex",
          }}
        />
        {/* red meridian block */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 14,
            background: "#f13b3b",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              letterSpacing: 4,
              color: "#c3fffc",
            }}
          >
            <span>PORTFOLIO/2026</span>
            <span>{identity.coordinates}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 116,
                fontWeight: 700,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              PRASHANT
            </span>
            <span
              style={{
                fontSize: 116,
                fontWeight: 700,
                letterSpacing: -3,
                lineHeight: 1,
                color: "#c3fffc",
              }}
            >
              YADAV.
            </span>
            <span
              style={{
                marginTop: 28,
                fontSize: 28,
                letterSpacing: 6,
                color: "#eae6da",
              }}
            >
              {identity.role}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 3,
              color: "#8a877e",
            }}
          >
            PRISM · SENTINEL VISION · LEDGERFLOW — LUCKNOW, INDIA
          </div>
        </div>
      </div>
    ),
    size,
  );
}
