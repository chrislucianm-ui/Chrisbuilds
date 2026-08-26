"use client";
import React from "react";
import { FadeIn } from "./FadeIn";

const SERVICES_DATA = [
  {
    number: "01",
    name: "3D Modeling",
    description:
      "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    number: "02",
    name: "Rendering",
    description:
      "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    number: "03",
    name: "Motion Design",
    description:
      "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    number: "04",
    name: "Branding",
    description:
      "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
  },
  {
    number: "05",
    name: "Web Design",
    description:
      "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="font-instrument-serif font-normal italic text-center text-white tracking-tight text-[clamp(3.5rem,10vw,120px)] mb-16 sm:mb-20 md:mb-28 select-none">
            Services
          </h2>
        </FadeIn>

        {/* Vertical List */}
        <div className="flex flex-col border-t border-[rgba(255,255,255,0.15)]">
          {SERVICES_DATA.map((service, i) => (
            <FadeIn
              key={service.number}
              delay={i * 0.1}
              y={30}
              className="group py-8 sm:py-10 md:py-12 border-b border-[rgba(255,255,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-12 cursor-default transition-all duration-300"
            >
              {/* Number with gradient */}
              <span className="font-instrument-serif italic leading-none text-[clamp(3rem,10vw,140px)] select-none text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b1a] to-[#ff9a50]">
                {service.number}
              </span>

              {/* Name & Description */}
              <div className="flex flex-col sm:flex-1 max-w-2xl">
                <h3 className="font-medium uppercase text-white group-hover:text-[#ff9a50] transition-colors duration-300 text-[clamp(1.1rem,2.2vw,2.1rem)] mb-2 sm:mb-3">
                  {service.name}
                </h3>
                <p className="font-light leading-relaxed text-[#D7E2EA]/60 text-[clamp(0.85rem,1.6vw,1.25rem)]">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
