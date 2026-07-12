import MotionOrchestrator from "@/components/providers/MotionOrchestrator";
import { education, identity } from "@/data/resume";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Work from "@/components/sections/Work";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  email: `mailto:${identity.email}`,
  url: identity.siteUrl,
  jobTitle: "Software Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
  },
  sameAs: [identity.github, identity.linkedin],
  knowsAbout: [
    "Full-Stack Development",
    "Machine Learning",
    "Computer Vision",
    "Retrieval-Augmented Generation",
  ],
};

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <About />
      <Stack />
      <Work />
      <Credentials />
      <Contact />
      <MotionOrchestrator />
    </main>
  );
}
