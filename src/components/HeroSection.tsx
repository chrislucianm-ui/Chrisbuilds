"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";

export function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-between overflow-visible relative bg-[#0C0C0C] select-none">
      {/* 4. Foreground Layer (z-40): Navbar */}
      <FadeIn delay={0} y={-20} className="w-full z-40 relative">
        <nav className="flex justify-between items-center w-full px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem]">
          <a
            href="#about"
            className="hover:opacity-70 transition-opacity duration-200"
          >
            About
          </a>
          <a
            href="#services"
            className="hover:opacity-70 transition-opacity duration-200"
          >
            Price
          </a>
          <a
            href="#projects"
            className="hover:opacity-70 transition-opacity duration-200"
          >
            Projects
          </a>
          <a
            href="#about"
            className="hover:opacity-70 transition-opacity duration-200"
          >
            Contact
          </a>
        </nav>
      </FadeIn>

      {/* 1. Background Layer (z-10): Hero Typography */}
      <div className="w-full overflow-hidden text-center z-10 flex justify-center items-center pt-2 sm:pt-4 md:pt-6 pointer-events-none">
        <FadeIn delay={0.15} y={20} className="w-full">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] -mt-6 sm:-mt-10 md:-mt-16 lg:-mt-20 select-none">
            Hi, i&apos;m Chris
          </h1>
        </FadeIn>
      </div>

      {/* 2. Webpage CSS Layer (z-20): Subtle Webpage Radial Glow Behind Head */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-white/[0.04] blur-[85px] pointer-events-none z-20" />

      {/* 3. Front Layer (z-30): Alpha Transparent 3D Character (+20% Scale, Zero Background Box, Breathing Float) */}
      <div className="absolute left-1/2 -translate-x-1/2 z-30 w-[320px] sm:w-[410px] md:w-[500px] lg:w-[570px] bottom-0 sm:bottom-2 pointer-events-none overflow-visible bg-transparent">
        <FadeIn delay={0.3} y={15}>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="relative w-full flex flex-col items-center bg-transparent overflow-visible"
          >
            {/* Pure Transparent 3D Character Model Asset */}
            <img
              src="/hero-character.png"
              alt="Chris Builds 3D Mascot Render"
              className="w-full h-auto object-contain select-none pointer-events-none bg-transparent"
              style={{
                filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.85))",
              }}
            />
          </motion.div>
        </FadeIn>
      </div>

      {/* 4. Foreground Layer (z-40): Bottom Bar & CTA Content */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 w-full z-40 relative">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]">
            crafting striking and unforgettable digital experiences
          </p>
        </FadeIn>
        <FadeIn delay={0.45} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
