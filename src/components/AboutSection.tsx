"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";

export function AboutSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate 3D perspective translation based on scroll position
  const yMotionValue = useTransform(scrollYProgress, [0, 1], [380, -80]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const transform = useMotionTemplate`rotateX(${rotateX}deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <div
      ref={targetRef}
      id="about"
      className="relative z-10 h-[220vh] w-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-visible"
    >
      {/* Background radial glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[480px] h-[350px] sm:h-[480px] rounded-full bg-white/[0.015] blur-[100px] pointer-events-none z-0" />

      {/* Decorative Corner Images */}
      {/* Top-left: Moon */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="fixed top-[15%] left-[2%] sm:left-[4%] pointer-events-none z-10 hidden md:block"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon 3D"
          className="w-[140px] md:w-[190px] h-auto object-contain select-none opacity-80"
        />
      </FadeIn>

      {/* Top-right: Lego icon */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="fixed top-[15%] right-[2%] sm:right-[4%] pointer-events-none z-10 hidden md:block"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego 3D"
          className="w-[140px] md:w-[190px] h-auto object-contain select-none opacity-80"
        />
      </FadeIn>

      {/* Bottom-left: 3D shape */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="fixed bottom-[15%] left-[3%] sm:left-[6%] pointer-events-none z-10 hidden md:block"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="3D Shape"
          className="w-[110px] md:w-[160px] h-auto object-contain select-none opacity-60"
        />
      </FadeIn>

      {/* Bottom-right: 3D group */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="fixed bottom-[15%] right-[3%] sm:right-[6%] pointer-events-none z-10 hidden md:block"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D Group"
          className="w-[140px] md:w-[190px] h-auto object-contain select-none opacity-60"
        />
      </FadeIn>

      {/* Sticky Perspective Wrapper */}
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-transparent px-6 sm:px-10 overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          perspective: "300px",
        }}
      >
        {/* About Section Heading */}
        <div className="absolute top-[8%] sm:top-[12%] text-center z-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D7E2EA]/50 font-medium">
            scroll down to see
          </span>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(2.5rem,10vw,120px)] mt-2">
            About me
          </h2>
        </div>

        {/* 3D Perspective Rolling Content Card */}
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transform,
          }}
          className="w-full max-w-4xl text-center flex flex-col items-center justify-center z-20 pointer-events-auto px-4"
        >
          {/* Main Statement */}
          <p className="text-[#D7E2EA] font-semibold uppercase tracking-wide leading-relaxed text-[clamp(1rem,2.8vw,1.9rem)] mb-10 max-w-[760px] text-center select-none">
            At Chris Builds, with more than five years of experience in design and engineering, i focus on branding, web design, and user experience. i truly enjoy working with businesses that aim to stand out and present their best image. Let&apos;s build something incredible together!
          </p>

          {/* CTA Button integrated within the perspective card */}
          <ContactButton />
        </motion.div>
      </div>
    </div>
  );
}
