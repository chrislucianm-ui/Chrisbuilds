"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Project {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  imageUrl: string;
  rotateClass: string;
  align: "left" | "right";
}

const PROJECTS: Project[] = [
  {
    id: "gym",
    num: "01",
    title: "Mata Fitness Tracker",
    subtitle: "BIOMETRICS & WORKOUT TELEMETRY",
    description: "A luxury workout logging interface combining WebGL muscle modeling, dynamic real-time pulse tracking, and smart calendar engines. Crafted to increase gym member retention and visual impact.",
    tags: ["WebGL", "Biometrics", "GSAP Splines", "SaaS Core"],
    imageUrl: "/images/gym_site_mockup.png",
    rotateClass: "hover:rotate-1 hover:scale-[1.015]",
    align: "left"
  },
  {
    id: "ecommerce",
    num: "02",
    title: "NeuroStore Sunglasses",
    subtitle: "LUXURY SHOPIFY STOREFRONT",
    description: "A gorgeous, high-fashion storefront built with spacious layouts, minimal border lines, and smooth slide transitions. Designed with pink and orange gradients to emphasize creative premium branding.",
    tags: ["Next.js", "Shopify API", "Smooth Scroll", "Tailwind v4"],
    imageUrl: "/images/ecommerce_site_mockup.png",
    rotateClass: "hover:-rotate-1 hover:scale-[1.015]",
    align: "right"
  },
  {
    id: "realestate",
    num: "03",
    title: "Orbit Dwellings Agency",
    subtitle: "ORBITAL & DEEP-SEA PROPERTY LOCATOR",
    description: "A creative locator service showcasing luxury dome habitats. Features fluid Coordinate Maps, high-end price filters, and immersive slide transitions to engage premium clientele.",
    tags: ["React MapGL", "Framer Motion", "Organic Splines"],
    imageUrl: "/images/realestate_site_mockup.png",
    rotateClass: "hover:rotate-0.5 hover:scale-[1.015]",
    align: "left"
  }
];

export default function ProjectShowcase() {
  return (
    <section id="showcase" className="relative py-40 px-6 md:px-12 bg-transparent z-10">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-32 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6c00d9] mb-3 block">
            SELECTED PROJECTS // PORTFOLIO
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-premium text-slate-800 max-w-3xl leading-[1.05]">
            Crafting digital products that <span className="text-slate-400">people remember.</span>
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-[#00a0c2] to-[#6c00d9] mt-10" />
        </div>

        {/* Project Layout - Integrated Image-Based Showcases */}
        <div className="flex flex-col gap-32">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                project.align === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Column - Emerging from Splines */}
              <div className="w-full lg:w-3/5">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative overflow-hidden rounded-2xl border border-white/60 shadow-xl transition-transform duration-700 bg-white/30 p-2 ${project.rotateClass}`}
                >
                  {/* Subtle hover gradient shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-10" />
                  
                  <div className="rounded-xl overflow-hidden shadow-inner">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={900}
                      height={560}
                      priority
                      className="w-full h-auto object-cover select-none"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Text details Column */}
              <div className="w-full lg:w-2/5 flex flex-col gap-5 text-left">
                {/* Numeric index */}
                <div className="text-4xl text-slate-300 font-extrabold leading-none">
                  {project.num}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">
                    {project.subtitle}
                  </span>
                  <h3 className="text-3xl font-black tracking-premium text-slate-800">
                    {project.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold text-slate-700 bg-white/50 border border-white/80 px-3 py-1 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200/50 mt-2 flex items-center gap-4">
                  <a
                    href="#contact"
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6c00d9] hover:text-[#00a0c2] transition-colors flex items-center gap-1.5"
                  >
                    Request Pricing & Case Details <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
