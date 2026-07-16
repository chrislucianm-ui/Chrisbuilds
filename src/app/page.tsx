"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Mail, Phone, MessageSquare, Send } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { gsap } from "gsap";
import Image from "next/image";

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

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to avoid jittery movements
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { damping: 25, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 25, stiffness: 150 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [triggerSweep, setTriggerSweep] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'services' | 'contact'>('home');
  const heroBgDesktopRef = useRef<HTMLImageElement>(null);
  const heroBgMobileRef = useRef<HTMLImageElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  useEffect(() => {
    const targets = [heroBgDesktopRef.current, heroBgMobileRef.current].filter(Boolean);
    if (targets.length === 0) return;

    // GSAP slow zoom and Y pan (1.00 -> 1.03 over 40s)
    const anim = gsap.to(targets, {
      scale: 1.03,
      y: -20,
      duration: 40,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Mouse parallax listener (X: ±10px, Y: ±8px max)
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth) - 0.5;
      const yPercent = (clientY / window.innerHeight) - 0.5;

      const currentScrollY = window.scrollY;
      gsap.to(targets, {
        x: xPercent * 20, // range of 20px (±10px)
        y: yPercent * 16 - 20 - currentScrollY * 0.08, // range of 16px (±8px) plus scroll offset
        duration: 2.0,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          x: xPercent * 15,
          y: -currentScrollY * 0.15 + yPercent * 10,
          duration: 2.0,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    // Scroll parallax listener
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      gsap.to(targets, {
        y: -20 - currentScrollY * 0.08,
        duration: 0.8,
        ease: "power1.out",
        overwrite: "auto",
      });

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          y: -currentScrollY * 0.15,
          duration: 0.8,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      anim.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadingComplete]);

  useEffect(() => {
    if (!loadingComplete) return;

    const sections = ["home", "services", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id as any);
          }
        },
        { threshold: 0.2, rootMargin: "-20% 0px -20% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [loadingComplete]);

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
            className="relative min-h-screen bg-black text-white selection:bg-white/10 selection:text-white"
          >
            {/* Dynamic Parallax Grid Layer */}
            <div 
              ref={gridRef}
              className="fixed inset-0 z-[-1] pointer-events-none luxury-grid opacity-[0.22]"
            />

            {/* Cinematic Radial Ambient Lighting Overlay */}
            <div 
              className="fixed inset-0 z-[-1] pointer-events-none transition-all duration-1000 ease-out"
              style={{
                background: `radial-gradient(circle at 50% ${activeSection === 'home' ? '25%' : activeSection === 'services' ? '50%' : '75%'}, rgba(255, 255, 255, 0.015) 0%, transparent 60%)`,
                opacity: loadingComplete ? 1 : 0
              }}
            />

            {/* Cinematic Faint Silver Light Sweep Overlay */}
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

            {/* Center Nav Links */}
            <nav className="hidden md:flex items-center gap-8 relative z-10">
              {[
                { name: "HOME", href: "#home" },
                { name: "SERVICES", href: "#services" },
                { name: "WORK", href: "#services" },
                { name: "ABOUT", href: "#services" },
                { name: "CONTACT", href: "#contact" }
              ].map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors relative py-2 group"
                >
                  {link.name}
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right Button */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contact");
              }}
              className="font-mono text-[8px] uppercase tracking-[0.25em] px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 relative z-10"
            >
              Let's Talk ↗
            </a>
          </header>

          {/* 1. HERO SECTION */}
          <section
            id="home"
            className="min-h-screen flex flex-col justify-center items-center md:items-start px-6 md:px-12 lg:px-16 text-center md:text-left relative z-10 max-w-7xl mx-auto w-full"
          >
            {/* Desktop 4K Background Image (hidden on mobile) */}
            <div className="absolute inset-0 z-[-2] w-full h-full overflow-hidden pointer-events-none select-none hidden md:block">
              <Image
                ref={heroBgDesktopRef}
                src="/hero-bg-desktop.png"
                alt="Luxury space cinematic wallpaper 4K"
                fill
                priority
                quality={100}
                sizes="(max-width: 1200px) 2560px, 3840px"
                className="object-cover"
                style={{
                  transformOrigin: "center center",
                }}
              />
              
              {/* Twinkling star overlays (extremely subtle, high-performance) */}
              <div className="twinkle-star" style={{ top: "15%", left: "20%", animationDelay: "0s" }} />
              <div className="twinkle-star" style={{ top: "35%", left: "75%", animationDelay: "1.5s" }} />
              <div className="twinkle-star" style={{ top: "60%", left: "15%", animationDelay: "3s" }} />
              <div className="twinkle-star" style={{ top: "25%", left: "45%", animationDelay: "4.5s" }} />
              <div className="twinkle-star" style={{ top: "70%", left: "80%", animationDelay: "2s" }} />
              <div className="twinkle-star" style={{ top: "10%", left: "85%", animationDelay: "0.5s" }} />
            </div>

            {/* Mobile 4K Portrait Background Image (hidden on desktop) */}
            <div className="absolute inset-0 z-[-2] w-full h-full overflow-hidden pointer-events-none select-none md:hidden">
              <Image
                ref={heroBgMobileRef}
                src="/hero-bg-mobile.png"
                alt="Luxury space cinematic wallpaper mobile portrait 4K"
                fill
                priority
                quality={100}
                sizes="2160px"
                className="object-cover"
                style={{
                  transformOrigin: "center center",
                }}
              />
              
              {/* Twinkling star overlays (extremely subtle, high-performance) */}
              <div className="twinkle-star" style={{ top: "20%", left: "15%", animationDelay: "0.5s" }} />
              <div className="twinkle-star" style={{ top: "40%", left: "80%", animationDelay: "2s" }} />
              <div className="twinkle-star" style={{ top: "65%", left: "25%", animationDelay: "1s" }} />
              <div className="twinkle-star" style={{ top: "10%", left: "70%", animationDelay: "3.5s" }} />
            </div>

            {/* Light volumetric contrast overlay */}
            <div 
              className="absolute inset-0 z-[-1] pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.30))"
              }}
            />

            {/* Subtle dark gradient behind text for desktop/mobile legibility */}
            <div className="absolute inset-0 z-[-1] pointer-events-none bg-[radial-gradient(circle_at_25%_50%,rgba(0,0,0,0.35)_0%,transparent_50%)] hidden md:block" />
            <div className="absolute inset-0 z-[-1] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,transparent_60%)] md:hidden" />

            {/* Faint Film Grain Overlay */}
            <div className="film-grain" />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[750px] flex flex-col items-center md:items-start gap-2 w-full mt-16 md:mt-0 -translate-y-[140px] md:translate-y-0"
            >
              <motion.h1
                className="font-black tracking-[-0.03em] uppercase leading-[0.85] text-center md:text-left text-white max-w-[750px] flex flex-col items-center md:items-start gap-0 w-full"
              >
                <span className="text-[clamp(1.8rem,8.2vw,6.2rem)] font-black w-full block whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                  WE BUILD DIGITAL
                </span>
                <span className="text-[clamp(1.53rem,6.97vw,5.27rem)] bg-gradient-to-b from-white/80 via-white/95 to-white bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] block w-full text-center md:text-left whitespace-nowrap mt-1 md:mt-0">
                  EXPERIENCES.
                </span>
                <span className="font-pinyon text-[#BFBFBF]/88 text-3xl sm:text-4xl md:text-[2.75rem] font-normal lowercase tracking-[0.08em] normal-case mt-3 md:mt-2 drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] block w-full text-center md:text-left">
                  that people remember.
                </span>
              </motion.h1>

              <div
                className="flex flex-row items-center justify-center md:justify-start gap-4 mt-6 md:mt-4 w-full"
              >
                <button
                  onClick={() => scrollToSection("#services")}
                  className="btn-luxury px-9 py-4 rounded-full w-44 md:w-auto"
                >
                  What I Build
                </button>
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="btn-luxury-outline px-9 py-4 rounded-full w-44 md:w-auto"
                >
                  Let's Talk
                </button>
              </div>
            </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
        >
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1.5">
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1 h-1.5 bg-white/65 rounded-full"
            />
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/40 mt-1">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent mt-1" />
        </motion.div>
      </section>

      {/* 2. WHAT I BUILD SECTION */}
      <WhatIBuildSection />

      {/* 3. CONTACT SECTION */}
      <ContactSectionBlock />

      {/* Footer */}
      <footer className="py-12 px-6 text-center font-mono text-[9px] text-white/40 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 CHRISBUILDS. ALL RIGHTS PRESERVED.</span>
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
          <motion.h2
            initial={{ opacity: 0, filter: "blur(12px)", y: 25 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white"
          >
            WHAT I BUILD
          </motion.h2>
          <div className="silver-divider max-w-[120px] mt-6" />
        </div>

        {/* Services List - 2x2 Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, idx) => (
            <TiltCard key={service.id} className="h-full">
              <motion.div
                initial={{ opacity: 0, filter: "blur(8px)", y: 25 }}
                animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                transition={{ duration: 1.0, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="brushed-chrome rounded-3xl p-10 flex flex-col gap-6 text-left relative overflow-hidden group hover:border-white/20 transition-all duration-500 border border-white/5 shadow-2xl h-full"
              >
                {/* Subtle metallic shimmer moving across the card on hover */}
                <div className="absolute inset-0 shimmer-line opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Elegant bold sans-serif heading */}
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white group-hover:logo-shine-text transition-all duration-300">
                  {service.title}
                </h3>

                {/* One-sentence premium copy */}
                <p className="text-[11px] text-white/40 tracking-[0.18em] leading-relaxed flex-grow font-mono uppercase">
                  {service.description}
                </p>

                {/* Refined capability tags */}
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 pt-4 border-t border-white/5 relative z-10">
                  {service.specs.join(" • ")}
                </div>
              </motion.div>
            </TiltCard>
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
          <motion.h2
            initial={{ opacity: 0, filter: "blur(12px)", y: 25 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white"
          >
            GET IN TOUCH
          </motion.h2>
          <div className="silver-divider max-w-[120px] mt-6" />
        </div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)", y: 25 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left"
        >
          {contactLinks.map((item) => (
            <TiltCard key={item.label}>
              <a
                href={item.href}
                className="glass-panel p-8 rounded-3xl flex items-center gap-4 group relative overflow-hidden border border-white/5 shadow-2xl hover:border-white/20 transition-all duration-500 w-full h-full flex"
              >
                {/* Subtle metallic shimmer moving across the card on hover */}
                <div className="absolute inset-0 shimmer-line opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="p-2 bg-white/5 border border-white/10 rounded-xl group-hover:scale-105 transition-transform duration-300 relative z-10 w-fit">
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
            </TiltCard>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
