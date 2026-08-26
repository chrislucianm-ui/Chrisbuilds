"use client";

import Hero11 from "@/components/originkit/hero-11";
import Hero13 from "@/components/originkit/hero-13";
import { MarqueeSection } from "@/components/MarqueeSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";

export default function Home() {
  return (
    <main className="bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-white/10 selection:text-white min-h-screen overflow-x-clip">
      <Hero11 />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <Hero13 />
    </main>
  );
}
