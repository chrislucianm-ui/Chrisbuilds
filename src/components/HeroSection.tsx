"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { Magnet } from "./Magnet";
import { ContactButton } from "./ContactButton";

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = clientX / window.innerWidth - 0.5;
      const yPercent = clientY / window.innerHeight - 0.5;
      setMousePos({ x: xPercent, y: yPercent });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="h-screen flex flex-col justify-between overflow-x-clip relative bg-[#0C0C0C]">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full z-30 relative">
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

      {/* Background Rim Light Glow */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full bg-white/[0.035] blur-[80px] pointer-events-none z-0" />

      {/* Hero Heading Container with Parallax */}
      <motion.div
        className="w-full overflow-hidden text-center z-10 flex justify-center items-center pt-2 sm:pt-4 md:pt-6"
        animate={{
          x: mousePos.x * -18,
          y: mousePos.y * -12,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.2 }}
      >
        <FadeIn delay={0.15} y={30} className="w-full">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-2 sm:mt-0 md:-mt-10 select-none">
            Hi, i&apos;m Chris
          </h1>
        </FadeIn>
      </motion.div>

      {/* Hero 3D Character Portrait with Parallax & Magnet */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[510px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto"
        animate={{
          x: mousePos.x * 24,
          y: mousePos.y * 16,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.2 }}
      >
        <FadeIn delay={0.4} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
            className="w-full"
          >
            <div className="relative w-full">
              {/* Subtle lens glow overlay behind character */}
              <div className="absolute inset-x-8 top-12 h-36 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent blur-xl pointer-events-none rounded-full" />
              <img
                src="/hero-character.png"
                alt="Chris 3D Creator Portrait with Spectacles"
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
              />
            </div>
          </Magnet>
        </FadeIn>
      </motion.div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 w-full z-30 relative">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]">
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
