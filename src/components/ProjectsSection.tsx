"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { LiveProjectButton } from "./LiveProjectButton";

interface ProjectData {
  number: string;
  category: string;
  name: string;
  col1Img1: string;
  col1Img2: string;
  col2Img: string;
}

const PROJECTS_DATA: ProjectData[] = [
  {
    number: "01",
    category: "Client",
    name: "Nextlevel Studio",
    col1Img1: "/images/nextlevel-view1.png",
    col1Img2: "/images/ecommerce_site_mockup.png",
    col2Img: "/images/realestate_site_mockup.png",
  },
  {
    number: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    col1Img1: "/images/aura-view1.png",
    col1Img2: "/images/aura-view2.png",
    col2Img: "/images/aura-view3.png",
  },
  {
    number: "03",
    category: "Client",
    name: "Solaris Digital",
    col1Img1: "/images/solaris-view1.png",
    col1Img2: "/images/gym_site_mockup.png",
    col2Img: "/images/planet-webapps.png",
  },
];

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto flex flex-col">
        {/* Heading */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28 select-none">
            Project
          </h2>
        </FadeIn>

        {/* Stacked Cards */}
        <div className="flex flex-col gap-12 sm:gap-16 pb-20">
          {PROJECTS_DATA.map((project, i) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={i}
              totalCards={PROJECTS_DATA.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  totalCards,
}: {
  project: ProjectData;
  index: number;
  totalCards: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="sticky top-24 md:top-32 min-h-[80vh] flex items-center justify-center"
      style={{ top: `${index * 28 + 96}px` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Number */}
            <span className="font-black text-[clamp(2.5rem,6vw,5.5rem)] leading-none text-[#D7E2EA] select-none">
              {project.number}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/60 border border-[#D7E2EA]/30 px-3 py-1 rounded-full w-fit">
                {project.category}
              </span>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-medium uppercase text-[#D7E2EA]">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom Row - Two Column Image Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 h-full min-h-0">
          {/* Left Column (40% width -> 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4 h-full justify-between">
            <img
              src={project.col1Img1}
              alt={`${project.name} view 1`}
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover h-[clamp(130px,16vw,230px)]"
            />
            <img
              src={project.col1Img2}
              alt={`${project.name} view 2`}
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover h-[clamp(160px,22vw,340px)]"
            />
          </div>

          {/* Right Column (60% width -> 7 cols) */}
          <div className="md:col-span-7 h-full flex">
            <img
              src={project.col2Img}
              alt={`${project.name} view 3`}
              className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover h-full min-h-[300px] sm:min-h-[400px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
