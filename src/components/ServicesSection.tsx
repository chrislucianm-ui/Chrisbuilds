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

  const yMotionValue = useTransform(scrollYProgress, [0, 1], [320, -120]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [32, 12, -8]);
  const transform = useMotionTemplate`rotateX(${rotateX}deg) translateY(${yMotionValue}px) translateZ(10px)`;

  return (
    <section
      id="services"
      ref={targetRef}
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-10 px-5 sm:px-8 md:px-10 py-24 sm:py-32 md:py-40 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center mb-12 sm:mb-16">
          <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight text-[clamp(3rem,12vw,160px)] select-none">
            Services
          </h2>
          <p className="text-[#D7E2EA]/60 uppercase tracking-[0.25em] text-xs sm:text-sm font-medium mt-4">
            Scroll to explore 3D spatial services
          </p>
        </FadeIn>

        {/* 3D Perspective Scroll Container */}
        <div
          className="w-full min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center relative py-12"
          style={{
            transformStyle: "preserve-3d",
            perspective: "350px",
          }}
        >
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              transform,
            }}
            className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 sm:gap-12 text-center"
          >
            {SERVICES_LIST.map((service) => (
              <div
                key={service.number}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 w-full text-center group cursor-pointer"
              >
                <span className="font-black text-[#D7E2EA]/40 text-[clamp(1.8rem,5vw,4.5rem)] leading-none font-mono">
                  {service.number}
                </span>
                <span className="hero-heading font-black uppercase tracking-tighter text-[clamp(2.5rem,8vw,7rem)] leading-none group-hover:scale-105 transition-transform duration-300">
                  {service.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Bottom Gradient Transition Mask */}
          <div className="absolute bottom-0 left-0 h-[25vh] w-full bg-gradient-to-b from-transparent to-[#0C0C0C] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
