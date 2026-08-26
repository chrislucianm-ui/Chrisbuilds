"use client";

import React from "react";
import Hero11 from "@/components/originkit/hero-11";
import { MarqueeSection } from "@/components/MarqueeSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-white/10 selection:text-white min-h-screen overflow-x-clip">
      <Hero11 />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </main>
  );
}
