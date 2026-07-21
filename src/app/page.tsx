"use client";

import React from "react";
import { Preloader } from "@/components/Preloader";
import { HeroSection } from "@/components/HeroSection";
import { MarqueeSection } from "@/components/MarqueeSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";

export default function Home() {
  return (
    <main className="bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-white/10 selection:text-white min-h-screen overflow-x-clip">
      <Preloader />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
