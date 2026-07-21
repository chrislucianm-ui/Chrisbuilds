"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";

export function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-between overflow-x-clip relative bg-[#0C0C0C] select-none">
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

      {/* 2. Middle Layer (z-20): Soft Radial Glow Behind Head */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full bg-white/[0.035] blur-[80px] pointer-events-none z-20" />

      {/* 3. Front Layer (z-30): Prominent 3D Mascot (+20% size, Gentle 2-3px Breathing Floating Animation, Seamless Blend) */}
      <div className="absolute left-1/2 -translate-x-1/2 z-30 w-[270px] sm:w-[350px] md:w-[430px] lg:w-[490px] bottom-0 sm:bottom-2 pointer-events-none">
        <FadeIn delay={0.3} y={15}>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="relative w-full flex flex-col items-center"
          >
            {/* Subtle hair highlight aura glow */}
            <div className="absolute inset-x-10 top-8 h-32 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent blur-xl pointer-events-none rounded-full" />

            {/* Seamless 3D Mascot Image Render */}
            <img
              src="/hero-character.png"
              alt="Chris Builds 3D Mascot Render"
              className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
            />

            {/* Grounded Depth Contact Shadow */}
            <div className="w-[70%] h-4 bg-black/80 blur-md rounded-[50%] -mt-4 pointer-events-none" />
          </motion.div>
        </FadeIn>
      </div>

      {/* 4. Foreground Layer (z-40): Bottom Bar & CTA Content */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 w-full z-40 relative">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]">
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.45} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
