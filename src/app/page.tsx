"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Mail, MessageSquare } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import Lenis from "lenis";
import Image from "next/image";

interface ServiceCard {
  title: string;
  description: string;
}

const SERVICES: ServiceCard[] = [
  {
    title: "Premium Websites",
    description: "Crafted to leave a lasting impression. Bespoke digital experiences that tell your brand's story."
  },
  {
    title: "Web Applications",
    description: "Powerful cloud systems and custom dashboards. Scalable, secure, and beautifully experienced."
  },
  {
    title: "Mobile Applications",
    description: "Premium iOS and Android apps designed for every touch. Native fluid experiences."
  },
  {
    title: "AI Solutions",
    description: "Intelligence, seamlessly integrated. Cognitive neural models and custom model tuning."
  }
];

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Framer Motion native useScroll hook tracks progress on the GPU without triggering any React state changes or re-renders
  const { scrollYProgress } = useScroll();

  // Continuous space background scroll pan (Desktop Only):
  // Pans the Earth horizon down out of view in the middle, and pulls it back up as the user approaches Contact at the bottom
  const yBackdrop = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["0%", "-25%", "-25%", "0%"]
  );

  // Detect mobile device layout on mount to optimize scroll and animations
  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
  }, []);

  // Initialize Lenis smooth scroll (desktop only, with strict animation frame cleanups)
  useEffect(() => {
    if (!loadingComplete) return;
    if (window.innerWidth < 768) return; // Skip custom scroll listeners on mobile to utilize native momentum scrolling

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // Ensure touch scrolling is fully handled by hardware threading
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId); // Explicitly cancel the animation loop to prevent memory leaks and tab crashes
    };
  }, [loadingComplete]);

  // Lock body scroll when loading
  useEffect(() => {
    if (!loadingComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loadingComplete]);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const contactLinks = [
    { label: "EMAIL", value: "chrisbuilds.dev@gmail.com", href: "mailto:chrisbuilds.dev@gmail.com?subject=Project Inquiry" },
    { label: "WHATSAPP", value: "+91 87388 82912", href: "https://wa.me/918738882912" }
  ];

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {loadingComplete && (
        <div className="relative min-h-screen text-white selection:bg-white/10 selection:text-white overflow-x-hidden font-sans">
          


          {/* Header Brand */}
          <header className="absolute top-0 left-0 right-0 z-40 py-8 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
            <a 
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#home");
              }}
              className="flex items-baseline select-none text-white hover:text-white/80 transition-colors relative z-10"
            >
              <span className="font-pinyon text-white/50 text-xl font-normal lowercase tracking-normal pr-1.5 capitalize">Chris</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-black">BUILDS</span>
            </a>

            {/* Right Button */}
            <button
              onClick={() => scrollToSection("#contact")}
              className="font-mono text-[8px] uppercase tracking-[0.25em] px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 relative z-10 cursor-pointer"
            >
              Let's Talk ↗
            </button>
          </header>

          {/* Natural-Scrolling Content Sections */}
          <div className="relative z-10 w-full flex flex-col items-center">
            
            {/* PAGE 1: HERO (THE ARRIVAL) */}
            <section
              id="home"
              className="min-h-screen flex flex-col justify-center items-center md:items-start px-6 md:px-12 lg:px-16 text-center md:text-left relative z-10 max-w-7xl mx-auto w-full"
            >
              {/* main Editorial Heading with Staggered Entrance (Bypassed on mobile to avoid layout shifts) */}
              <motion.h1 
                initial={isMobileDevice ? {} : { opacity: 0, y: 30 }}
                animate={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="flex flex-col gap-2 md:gap-4 text-center md:text-left font-sans select-none max-w-4xl"
              >
                {/* Desktop-only Editorial Layout (2 Lines) */}
                <div className="hidden md:flex flex-col gap-4">
                  <span className="text-8xl font-black uppercase text-luxury-gloss leading-none tracking-wider heading-glow-strong">
                    WE BUILD DIGITAL
                  </span>
                  <span className="text-[80px] font-black uppercase logo-shine-text leading-none tracking-widest mt-1">
                    EXPERIENCES.
                  </span>
                </div>

                {/* Mobile-only Custom Layout (3 Lines, occupying 65-70% width, non-shrinking) */}
                <div className="flex md:hidden flex-col gap-3 items-center w-full px-6 text-center">
                  <span className="text-[38px] sm:text-5xl font-black uppercase text-luxury-gloss leading-none tracking-[0.06em] heading-glow-strong block">
                    WE BUILD
                  </span>
                  <span className="text-[38px] sm:text-5xl font-black uppercase text-luxury-gloss leading-none tracking-[0.06em] heading-glow-strong block">
                    DIGITAL
                  </span>
                  <span className="text-[34px] sm:text-4xl font-black uppercase logo-shine-text leading-none tracking-[0.08em] block mt-1">
                    EXPERIENCES.
                  </span>
                </div>
              </motion.h1>

              {/* Luxury cursive signature with subtle glow and opacity fade-in */}
              <motion.span 
                initial={isMobileDevice ? {} : { opacity: 0, y: 15 }}
                animate={isMobileDevice ? { opacity: 0.85 } : { opacity: 0.85, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="mt-10 md:mt-8 font-pinyon text-4xl md:text-5xl text-white tracking-wide heading-glow block"
              >
                that people remember.
              </motion.span>

              {/* Centered Buttons matching original layout with staggered entry */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0, y: 15 }}
                animate={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                className="flex flex-row items-center justify-center md:justify-start gap-4 mt-12 md:mt-10 w-full"
              >
                <button
                  onClick={() => scrollToSection("#services")}
                  className="btn-luxury px-9 py-4 rounded-full w-44 md:w-auto cursor-pointer"
                >
                  WHAT I BUILD
                </button>
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="btn-luxury-outline px-9 py-4 rounded-full w-44 md:w-auto cursor-pointer"
                >
                  LET'S TALK
                </button>
              </motion.div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none hidden md:flex">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/20 font-mono">
                  Scroll to travel
                </span>
                <div className="w-[1px] h-10 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
            </section>

            {/* PAGE 2: WHAT I BUILD (LUXURY DIGITAL SHOWCASE - TYPOGRAPHY STAGE FLOW) */}
            <section
              id="services"
              className="py-32 px-6 md:px-12 max-w-5xl mx-auto w-full flex flex-col justify-center relative select-none"
            >
              <div className="w-full text-center mb-32">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/30 block mb-4">
                  Capabilities Showcase
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white leading-none heading-glow">
                  WHAT I BUILD
                </h2>
              </div>

              <div className="flex flex-col gap-36 md:gap-48 w-full relative z-10">
                {SERVICES.map((service, idx) => (
                  <motion.div
                    key={service.title}
                    initial={isMobileDevice ? { opacity: 0, y: 15 } : { opacity: 0, y: 35, filter: "blur(12px)" }}
                    whileInView={isMobileDevice ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center text-center w-full max-w-3xl mx-auto"
                  >
                    {/* Chapter index label */}
                    <span className="font-serif italic text-xl md:text-2xl text-white/20 tracking-wider mb-6 block">
                      Chapter 0{idx + 1}
                    </span>

                    {/* Premium Bold Heading with Soft white glow */}
                    <h3 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-luxury-gloss leading-tight tracking-wider heading-glow-strong">
                      {service.title}
                    </h3>

                    {/* Luxury Minimalist Caption Description */}
                    <p className="text-[11px] sm:text-xs md:text-sm text-white/50 tracking-[0.2em] leading-relaxed font-mono uppercase mt-8 max-w-xl">
                      {service.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* PAGE 3: LET'S BUILD SOMETHING UNFORGETTABLE */}
            <section
              id="contact"
              className="py-24 md:py-36 px-6 md:px-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center min-h-[90vh] md:min-h-screen relative z-10 gap-8 md:gap-12 text-center select-none"
            >
              {/* Main Content Floating Typography */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0, y: 20 }}
                whileInView={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center w-full"
              >
                <span className="font-pinyon text-3xl md:text-5xl text-white/80 lowercase tracking-normal block mb-4 heading-glow">
                  let's build something unforgettable.
                </span>
                
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-premium leading-none text-white font-sans mt-2 heading-glow-strong">
                  CHRISBUILDS
                </h2>
                
                <p className="text-[10px] md:text-xs text-white/45 uppercase tracking-[0.35em] font-mono mt-6">
                  Luxury Digital Experiences.
                </p>
              </motion.div>

              {/* Direct Contact Links - Centered Column on both Mobile and Desktop with spacious premium gaps */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0, y: 15 }}
                whileInView={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="flex flex-col items-center justify-center gap-10 md:gap-14 pointer-events-auto w-full"
              >
                {contactLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center transition-all duration-300 relative py-2"
                  >
                    <span className="text-[10px] text-white/35 uppercase tracking-[0.3em] font-mono group-hover:text-white/80 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                      {item.label}
                    </span>
                    <span className="text-sm md:text-base text-white/60 tracking-[0.12em] font-light mt-2.5 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-all font-mono">
                      {item.value}
                    </span>
                    {/* Centered Underline animation */}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300" />
                  </a>
                ))}
              </motion.div>

              {/* Bottom Copyright Footer */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0 }}
                whileInView={isMobileDevice ? {} : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.4 }}
                className="pb-4 mt-16 md:mt-24 pointer-events-auto"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25 select-none">
                  © 2026 CHRISBUILDS. ALL RIGHTS RESERVED.
                </span>
              </motion.div>
            </section>

          </div>

        </div>
      )}
    </>
  );
}
