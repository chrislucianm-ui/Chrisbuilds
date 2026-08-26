"use client";
import React from "react";
import { FadeIn } from "./FadeIn";
import ScrollReveal from "./ScrollReveal";
import { Button } from "@/components/originkit/ui/hero-11/button";

export function AboutSection() {
  const paragraphText =
    "At Chris Builds, with more than five years of experience in design and engineering, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

  const handleContactClick = () => {
    const defaultMessage = encodeURIComponent(
      "Hi Chris! I visited your portfolio website and would like to discuss a project with you."
    );
    const whatsappUrl = `https://wa.me/918738882912?text=${defaultMessage}`;
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      id="about"
      className="min-h-screen bg-[#0C0C0C] relative px-5 sm:px-8 md:px-10 py-20 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Decorative Corner Images */}
      {/* Top-left: Moon */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon 3D"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain select-none"
        />
      </FadeIn>

      {/* Bottom-left: 3D object */}
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="3D Shape"
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain select-none"
        />
      </FadeIn>

      {/* Top-right: Lego icon */}
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego 3D"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain select-none"
        />
      </FadeIn>

      {/* Bottom-right: 3D group */}
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D Group"
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain select-none"
        />
      </FadeIn>

      {/* Content Cluster */}
      <div className="flex flex-col items-center z-20 max-w-5xl w-full">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="font-instrument-serif font-normal italic text-center text-white tracking-tight text-[clamp(3.5rem,10vw,120px)] mb-2 select-none">
            About me
          </h2>
        </FadeIn>

        {/* Gap between heading and text */}
        <div className="h-10 sm:h-12" />

        {/* Animated Paragraph with ScrollReveal */}
        <ScrollReveal
          baseOpacity={0.05}
          enableBlur={true}
          baseRotation={4}
          blurStrength={12}
          containerClassName="max-w-4xl mx-auto text-center"
          textClassName="text-[#D7E2EA] font-light font-sans text-center leading-relaxed text-[clamp(1.4rem,3.2vw,2.6rem)]"
          rotationEnd="bottom bottom"
          wordAnimationEnd="bottom bottom"
        >
          {paragraphText}
        </ScrollReveal>

        {/* Gap between text and button */}
        <div className="h-12 sm:h-16" />

        {/* Contact Button */}
        <FadeIn delay={0.2} y={20} className="pointer-events-auto">
          <Button onClick={handleContactClick}>Contact Me</Button>
        </FadeIn>
      </div>
    </section>
  );
}
