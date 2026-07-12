import MotionOrchestrator from "@/components/providers/MotionOrchestrator";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Work from "@/components/sections/Work";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
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
