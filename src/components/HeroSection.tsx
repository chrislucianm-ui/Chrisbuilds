"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";

export function HeroSection() {
  return (
    <>
      {/* ========================================== */}
      {/* 📱 DEDICATED MOBILE HERO SECTION (md:hidden) */}
      {/* ========================================== */}
      <section className="md:hidden min-h-[100dvh] flex flex-col justify-between items-center px-4 sm:px-6 pt-3 pb-5 bg-[#0C0C0C] select-none relative overflow-x-hidden text-center">
        {/* 1. Mobile Navbar */}
        <FadeIn delay={0} y={-10} className="w-full z-30">
          <nav className="flex justify-between items-center w-full text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm py-1">
            <a href="#about" className="hover:opacity-70 transition-opacity">
              About
            </a>
            <a href="#services" className="hover:opacity-70 transition-opacity">
              Price
            </a>
            <a href="#projects" className="hover:opacity-70 transition-opacity">
              Projects
            </a>
            <a href="#about" className="hover:opacity-70 transition-opacity">
              Contact
            </a>
          </nav>
        </FadeIn>

        {/* 2. Mobile Typography ("HI, I'M CHRIS") */}
        <FadeIn delay={0.12} y={15} className="w-full my-1">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap text-[clamp(2.4rem,11.5vw,4.5rem)] w-full select-none text-center">
            Hi, i&apos;m Chris
          </h1>
        </FadeIn>

        {/* 3. Mobile 3D Character Model Container (Scaled up 30% for Mobile) */}
        <div className="relative w-full flex flex-col items-center justify-center my-1 sm:my-2">
          {/* Subtle Mobile Glow behind head */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] sm:w-[390px] h-[310px] sm:h-[390px] rounded-full bg-white/[0.045] blur-[70px] pointer-events-none z-0" />

          <FadeIn delay={0.25} y={15} className="z-10 relative">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative flex flex-col items-center"
            >
              <img
                src="/hero-character.png"
                alt="Chris Builds 3D Mascot"
                className="w-[78vw] min-w-[280px] max-w-[410px] sm:w-[390px] h-auto object-contain select-none pointer-events-none filter drop-shadow-[0_18px_28px_rgba(0,0,0,0.92)]"
              />
            </motion.div>
          </FadeIn>
        </div>

        {/* 4. Short Introduction Text & 5. Contact Me Button */}
        <div className="flex flex-col items-center gap-3.5 w-full my-1 sm:my-2 z-20">
          <FadeIn delay={0.35} y={15}>
            <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[clamp(0.75rem,3.2vw,1.1rem)] max-w-[280px] sm:max-w-[340px] text-center">
              crafting striking and unforgettable digital experiences
            </p>
          </FadeIn>

          <FadeIn delay={0.45} y={15}>
            <ContactButton />
          </FadeIn>
        </div>

        {/* 6. Mobile Scroll Indicator */}
        <FadeIn delay={0.55} y={10} className="mt-1 opacity-70">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#D7E2EA]">
              SCROLL
            </span>
            <div className="w-4 h-6 border border-[#D7E2EA]/30 rounded-full flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-1 h-1 bg-[#D7E2EA] rounded-full"
              />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ========================================== */}
      {/* 🖥️ DEDICATED DESKTOP HERO SECTION (hidden md:flex) */}
      {/* ========================================== */}
      <section className="hidden md:flex h-screen flex-col justify-between overflow-visible relative bg-[#0C0C0C] select-none">
        {/* Navbar */}
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

        {/* Background Layer: Hero Typography */}
        <div className="w-full overflow-hidden text-center z-10 flex justify-center items-center pt-2 sm:pt-4 md:pt-6 pointer-events-none">
          <FadeIn delay={0.15} y={20} className="w-full">
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] -mt-6 sm:-mt-10 md:-mt-16 lg:-mt-20 select-none">
              Hi, i&apos;m Chris
            </h1>
          </FadeIn>
        </div>

        {/* Middle Layer: Subtle Radial Glow Behind Head */}
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full bg-white/[0.04] blur-[85px] pointer-events-none z-20" />

        {/* Front Layer: Alpha Transparent 3D Character */}
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

        {/* Foreground Layer: Bottom Bar & CTA Content */}
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
    </>
  );
}
