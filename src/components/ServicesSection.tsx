"use client";
import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { FadeIn } from "./FadeIn";

const SERVICES_LIST = [
  { number: "01", name: "WEB DESIGN" },
  { number: "02", name: "BRANDING" },
  { number: "03", name: "3D MODELING" },
  { number: "04", name: "MOTION DESIGN" },
  { number: "05", name: "RENDERING" },
];

export function ServicesSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const yMotionValue = useTransform(scrollYProgress, [0, 1], [300, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [28, 10, -6]);
  const transform = useMotionTemplate`rotateX(${rotateX}deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <section
      id="services"
      ref={targetRef}
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-10 px-5 sm:px-8 md:px-10 py-24 sm:py-32 md:py-40 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* Section Heading (Kept Intact) */}
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-24">
          <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight text-[clamp(3rem,12vw,160px)] select-none">
            Services
          </h2>
          <p className="text-[#D7E2EA]/50 uppercase tracking-[0.25em] text-xs sm:text-sm font-medium mt-5">
            Crafting bespoke digital systems & 3D experiences
          </p>
        </FadeIn>

        {/* 3D Perspective Scroll Container */}
        <div
          className="w-full min-h-[75vh] sm:min-h-[90vh] flex items-center justify-center relative py-12"
          style={{
            transformStyle: "preserve-3d",
            perspective: "400px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="w-full max-w-4xl flex flex-col items-center justify-center gap-14 sm:gap-20 md:gap-24 text-center"
          >
            {SERVICES_LIST.map((service) => (
              <div
                key={service.number}
                className="group flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-fit text-center cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Subtle Italic Numbering */}
                <span className="font-mono font-light italic text-[#D7E2EA]/35 text-[clamp(0.9rem,1.8vw,1.4rem)] tracking-wider">
                  [{service.number}]
                </span>

                {/* Elegant Luxury Service Title with Underline Reveal & Glow */}
                <span className="relative font-medium uppercase tracking-[0.18em] text-[clamp(1.4rem,3.8vw,3.2rem)] leading-none text-[#D7E2EA]/75 transition-all duration-500 group-hover:text-white group-hover:tracking-[0.24em] group-hover:drop-shadow-[0_0_22px_rgba(255,255,255,0.45)] pb-2 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent group-hover:after:w-full after:transition-all after:duration-500">
                  {service.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Bottom Mask */}
          <div className="absolute bottom-0 left-0 h-[25vh] w-full bg-gradient-to-b from-transparent to-[#0C0C0C] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
