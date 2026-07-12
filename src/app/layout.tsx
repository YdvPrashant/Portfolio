import { existsSync } from "fs";
import { join } from "path";
import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import { identity } from "@/data/resume";
import SmoothScroll from "@/components/providers/SmoothScroll";
import GrainOverlay from "@/components/fx/GrainOverlay";
import Navbar from "@/components/chrome/Navbar";
import StatusBar from "@/components/chrome/StatusBar";
import EdgeRails from "@/components/chrome/EdgeRails";
import Comet from "@/components/chrome/Comet";
import CustomCursor from "@/components/chrome/CustomCursor";
import Preloader from "@/components/chrome/Preloader";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const TITLE = "Prashant Yadav — Software Developer · AI/ML Engineer";
const DESCRIPTION =
  "Portfolio of Prashant Yadav — software developer working across full-stack web and applied AI/ML. Builder of Prism, a deployed news-transparency platform.";

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Prashant Yadav — Portfolio/2026",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // build-time check: CV buttons appear once the PDF is dropped in public/
  const resumeAvailable = existsSync(
    join(process.cwd(), "public", identity.resumePdf.replace(/^\//, "")),
  );

  return (
    <html
      lang="en"
      className={`${display.variable} ${grotesk.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void font-body text-bone">
        <a
          href="#main"
          className="hud-label sr-only bg-mint px-4 py-3 font-bold text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]"
        >
          SKIP TO CONTENT
        </a>
        <SmoothScroll>
          <Navbar resumeAvailable={resumeAvailable} />
          {children}
          <StatusBar />
          <EdgeRails />
          <Comet />
          <Preloader />
        </SmoothScroll>
        <CustomCursor />
        <GrainOverlay />
      </body>
    </html>
  );
}
