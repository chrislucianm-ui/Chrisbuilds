"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mail, Phone, MessageSquare, Send } from "lucide-react";
import HeroBackgroundCanvas from "@/components/HeroBackgroundCanvas";
import LoadingScreen from "@/components/LoadingScreen";

interface Service {
  id: string;
  title: string;
  description: string;
  specs: string[];
}

const SERVICES: Service[] = [
  {
    id: "01",
    title: "Websites",
    description: "Crafted to leave a lasting impression.",
    specs: ["Bespoke", "Timeless", "Precision"]
  },
  {
    id: "02",
    title: "Web Applications",
    description: "Powerful systems. Beautifully experienced.",
    specs: ["Elegant", "Secure", "Performant"]
  },
  {
    id: "03",
    title: "Mobile Applications",
    description: "Designed for every touch.",
    specs: ["Precision", "Tactile", "Fluid"]
  },
  {
    id: "04",
    title: "AI Solutions",
    description: "Intelligence, seamlessly integrated.",
    specs: ["Crafted", "Intelligent", "Scalable"]
  }
];

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [triggerSweep, setTriggerSweep] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    if (loadingComplete) {
      setTriggerSweep(true);
    }
  }, [loadingComplete]);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      <AnimatePresence>
        {loadingComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="relative min-h-screen bg-black text-white selection:bg-white/10 selection:text-white luxury-grid"
          >
        {/* Faint silver light sweep overlay during reveal */}
        {triggerSweep && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "100%", opacity: [0, 0.25, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-gradient-to-b from-transparent via-white/12 to-transparent pointer-events-none z-[9998]"
          />
        )}

        {/* Subtle Monochrome Mouse Spotlight */}
      <div
        className="spotlight-glow hidden md:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Header Brand */}
      <header className="absolute top-0 left-0 right-0 z-40 py-8 px-6 md:px-12 flex justify-between items-center max-w-5xl mx-auto border-b border-white/5">
        <a 
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#home");
          }}
          className="flex items-baseline select-none text-white hover:text-white/80 transition-colors"
        >
          <span className="font-pinyon text-white/50 text-xl font-normal lowercase tracking-normal pr-1.5 capitalize">Chris</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] font-black">BUILDS</span>
        </a>
        <div className="font-mono text-[9px] text-white/40">
          SYSTEM ACTIVE
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative z-10"
      >
        {/* Cinematic WebGL Background Canvas with Gradual Reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.4 }}
          className="absolute inset-0 -z-10 pointer-events-none"
        >
          <HeroBackgroundCanvas />
        </motion.div>

        {/* 50% Black Overlay for contrast */}
        <div className="absolute inset-0 bg-black/50 -z-5 pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-white/30 mb-3"
          >
            <span>SPECIFICATION</span>
            <span className="font-pinyon text-white/40 text-lg font-normal lowercase tracking-normal capitalize">no.</span>
            <span>001</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-premium uppercase leading-[0.95]"
          >
            We build digital <br />
            systems that <span className="text-white/60">endure.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/40 max-w-lg leading-relaxed mt-2"
          >
            Bespoke creative design. High-performance systems.<br />
            Engineered with Swiss precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
          >
            <button
              onClick={() => scrollToSection("#services")}
              className="btn-luxury px-9 py-4.5 rounded-full w-full sm:w-auto"
            >
              What I Build
            </button>
            <button
              onClick={() => scrollToSection("#contact")}
              className="btn-luxury-outline px-9 py-4.5 rounded-full w-full sm:w-auto"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. WHAT I BUILD SECTION */}
      <WhatIBuildSection />

      {/* 3. CONTACT SECTION */}
      <ContactSectionBlock />

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6 text-center font-mono text-[9px] text-white/40 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 CHRISBUILDS. ALL RIGHTS PRESERVED.</span>
          <span className="text-white/60 uppercase tracking-wider">Monochrome Protocol v1.1.0</span>
        </div>
      </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WhatIBuildSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-36 px-6 md:px-12 relative z-10 border-t border-white/5"
    >
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-3">
            <span>OFFERINGS</span>
            <span className="font-pinyon text-white/40 text-lg font-normal lowercase tracking-normal capitalize">no.</span>
            <span>002</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white">
            WHAT I BUILD
          </h2>
          <div className="silver-divider max-w-[120px] mt-6" />
        </div>

        {/* Services List - 2x2 Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, delay: idx * 0.15, ease: [0.76, 0, 0.24, 1] }}
              className="brushed-chrome rounded-3xl p-10 flex flex-col gap-8 text-left relative overflow-hidden group hover:scale-[1.01] hover:border-white/20 transition-all duration-500 border border-white/5 shadow-2xl"
            >
              {/* Subtle metallic shimmer moving across the card on hover */}
              <div className="absolute inset-0 shimmer-line opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Header with cap ID and signature */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">CAP_ID // {service.id}</span>
                <span className="flex items-center gap-1 font-mono text-[9px] text-white/40">
                  <span className="font-pinyon text-white/30 text-base font-normal lowercase tracking-normal capitalize mr-0.5">no.</span>
                  <span>{idx + 1}</span>
                </span>
              </div>

              {/* Elegant bold sans-serif heading + cursive accent */}
              <div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white group-hover:logo-shine-text transition-all duration-300">
                  {service.title}
                </h3>
                <span className="font-pinyon text-white/40 text-[14px] italic block mt-1 lowercase">
                  crafted // {service.specs[0].toLowerCase()}
                </span>
              </div>

              {/* One-sentence premium copy */}
              <p className="text-[11px] text-white/40 tracking-[0.18em] leading-relaxed flex-grow font-mono uppercase">
                {service.description}
              </p>

              {/* Refined capability tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 relative z-10">
                {service.specs.map((spec) => (
                  <span
                    key={spec}
                    className="font-mono text-[9px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-white/40 group-hover:text-white/70 group-hover:border-white/15 transition-all duration-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSectionBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const contactLinks = [
    { label: "Email", value: "chrisbuilds.dev@gmail.com", href: "mailto:chrisbuilds.dev@gmail.com?subject=Project Inquiry", icon: <Mail className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "Phone", value: "+91 87388 82912", href: "tel:+918738882912", icon: <Phone className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "WhatsApp", value: "+91 87388 82912", href: "https://wa.me/918738882912", icon: <MessageSquare className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "Telegram", value: "@chrisbuilds", href: "https://t.me/chrisbuilds", icon: <Send className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { 
      label: "LinkedIn", 
      value: "linkedin.com/in/chrisbuilds", 
      href: "#", 
      icon: (
        <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    { 
      label: "GitHub", 
      value: "github.com/chrislucianm-ui", 
      href: "https://github.com/chrislucianm-ui", 
      icon: (
        <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-36 px-6 md:px-12 relative z-10 border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-3">
            <span>CONNECTION</span>
            <span className="font-pinyon text-white/40 text-lg font-normal lowercase tracking-normal capitalize">no.</span>
            <span>003</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white">
            GET IN TOUCH
          </h2>
          <div className="silver-divider max-w-[120px] mt-6" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left"
        >
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="glass-panel p-8 rounded-3xl flex items-center gap-4 group relative overflow-hidden border border-white/5 shadow-2xl hover:scale-[1.01] hover:border-white/20 transition-all duration-500"
            >
              {/* Subtle metallic shimmer moving across the card on hover */}
              <div className="absolute inset-0 shimmer-line opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="p-2 bg-white/5 border border-white/10 rounded-xl group-hover:scale-105 transition-transform duration-300 relative z-10">
                {item.icon}
              </div>
              <div className="flex flex-col font-mono relative z-10">
                <span className="text-[8px] text-white/30 uppercase tracking-[0.25em] font-medium">
                  {item.label}
                </span>
                <span className="text-[11px] text-white/60 tracking-wide font-light break-all mt-1 group-hover:text-white transition-colors">
                  {item.value}
                </span>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="mailto:chrisbuilds.dev@gmail.com?subject=Project Collaboration Proposal"
            className="btn-luxury px-10 py-4.5 rounded-full inline-flex items-center gap-2"
          >
            Start a Project <ArrowUpRight className="w-4 h-4 animate-pulse" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
