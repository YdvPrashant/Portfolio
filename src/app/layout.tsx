import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import GrainOverlay from "@/components/fx/GrainOverlay";
import Navbar from "@/components/chrome/Navbar";
import StatusBar from "@/components/chrome/StatusBar";
import EdgeRails from "@/components/chrome/EdgeRails";
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

export const metadata: Metadata = {
  title: "Prashant Yadav — Software Developer · AI/ML",
  description:
    "Portfolio of Prashant Yadav — software developer working across full-stack web and applied AI/ML. Builder of Prism, a deployed news-transparency platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${grotesk.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void font-body text-bone">
        <SmoothScroll>
          <Navbar />
          {children}
          <StatusBar />
          <EdgeRails />
          <Preloader />
        </SmoothScroll>
        <CustomCursor />
        <GrainOverlay />
      </body>
    </html>
  );
}
