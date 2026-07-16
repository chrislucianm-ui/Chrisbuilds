"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, Phone, MessageSquare, Send } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import HeroBackgroundCanvas from "@/components/HeroBackgroundCanvas";
import Lenis from "lenis";

interface ServiceCard {
  title: string;
  description: string;
}

const SERVICES: ServiceCard[] = [
  {
    title: "Premium Websites",
    description: "Crafted to leave a lasting impression."
  },
  {
    title: "Web Applications",
    description: "Powerful systems. Beautifully experienced."
  },
  {
    title: "Mobile Applications",
    description: "Designed for every touch."
  },
  {
    title: "AI Solutions",
    description: "Intelligence, seamlessly integrated."
  }
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high-end luxury tilt mechanics
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 25, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 25, stiffness: 150 });

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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!loadingComplete) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", handleScroll);
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

  // 3 distinct, non-overlapping scene boundaries
  const getSceneOpacity = (index: number) => {
    const ranges = [
      { start: 0.0, end: 0.33 },  // Index 0: Hero / Arrival
      { start: 0.33, end: 0.66 }, // Index 1: What I Build
      { start: 0.66, end: 1.0 }   // Index 2: Contact
    ];

    const { start, end } = ranges[index];
    if (scrollProgress < start || scrollProgress > end) return 0;

    const buffer = 0.035; // dead-zone buffer to completely clear elements between scene steps
    if (scrollProgress < start + buffer) {
      return (scrollProgress - start) / buffer; // fade in
    } else if (scrollProgress > end - buffer) {
      return (end - scrollProgress) / buffer; // fade out
    } else {
      return 1.0;
    }
  };

  const getSceneStyle = (index: number) => {
    const op = getSceneOpacity(index);
    const blur = (1.0 - op) * 12; // GPU-accelerated blur-to-sharp reveal
    const yOffset = (1.0 - op) * 15; // subtle upward translation reveal

    return {
      opacity: op,
      filter: `blur(${blur}px)`,
      transform: `translateY(${yOffset}px)`,
      pointerEvents: op > 0.1 ? ("auto" as const) : ("none" as const),
      display: op > 0 ? ("flex" as const) : ("none" as const),
      transition: "opacity 200ms ease-out, filter 200ms ease-out, transform 200ms ease-out"
    };
  };

  const activeSceneIndex = Math.min(2, Math.floor(scrollProgress * 3.1));

  const contactLinks = [
    { label: "Email", value: "chrisbuilds.dev@gmail.com", href: "mailto:chrisbuilds.dev@gmail.com?subject=Project Inquiry", icon: <Mail className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "WhatsApp", value: "+91 87388 82912", href: "https://wa.me/918738882912", icon: <MessageSquare className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { 
      label: "LinkedIn", 
      value: "linkedin.com/in/chrisbuilds", 
      href: "https://linkedin.com/in/chrisbuilds", 
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
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {loadingComplete && (
        <div className="relative min-h-screen bg-black text-white selection:bg-white/10 selection:text-white overflow-x-hidden font-sans">
          
          {/* Continuous Full-Page WebGL Background */}
          <HeroBackgroundCanvas 
            scrollProgress={scrollProgress} 
            hoveredProjectIndex={null} 
          />

          {/* Fixed Scroll Navigation Indicator */}
          <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50 hidden md:flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <button
                key={i}
                onClick={() => window.scrollTo({ top: (i / 3) * (document.documentElement.scrollHeight - window.innerHeight), behavior: "smooth" })}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 border ${
                  activeSceneIndex === i 
                    ? "bg-white border-white scale-125 shadow-[0_0_10px_#fff]" 
                    : "bg-transparent border-white/30 hover:border-white/80"
                }`}
              />
            ))}
          </div>

          {/* Sticky Cinematic Text Overlays */}
          <div className="relative z-10 w-full h-[400vh] pointer-events-none">
            
            {/* PAGE 1: HERO (THE ARRIVAL) */}
            <div
              style={getSceneStyle(0)}
              className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
              <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-6">
                Arrival
              </span>
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-premium leading-[0.9] text-white max-w-4xl font-sans">
                WE BUILD DIGITAL<br />
                <span className="logo-shine-text">EXPERIENCES.</span>
              </h1>
              <span className="mt-8 font-pinyon text-3xl md:text-4xl text-white/60 tracking-normal">
                that people remember.
              </span>

              {/* Centered Buttons matching original layout */}
              <div className="flex flex-row items-center justify-center gap-4 mt-10 w-full pointer-events-auto">
                <button
                  onClick={() => window.scrollTo({ top: 0.5 * (document.documentElement.scrollHeight - window.innerHeight), behavior: "smooth" })}
                  className="btn-luxury px-9 py-4 rounded-full w-44 md:w-auto cursor-pointer"
                >
                  What I Build
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0.85 * (document.documentElement.scrollHeight - window.innerHeight), behavior: "smooth" })}
                  className="btn-luxury-outline px-9 py-4 rounded-full w-44 md:w-auto cursor-pointer"
                >
                  Let's Talk
                </button>
              </div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/20 font-mono">
                  Scroll to travel
                </span>
                <div className="w-[1px] h-10 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
            </div>

            {/* PAGE 2: WHAT I BUILD */}
            <div
              style={getSceneStyle(1)}
              className="fixed inset-0 flex flex-col justify-center px-6 md:px-16 max-w-5xl mx-auto"
            >
              <div className="w-full text-center mb-12">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-4 block">
                  Capabilities
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white leading-none">
                  WHAT I BUILD
                </h2>
                <div className="silver-divider max-w-[80px] mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pointer-events-auto">
                {SERVICES.map((service) => (
                  <TiltCard key={service.title}>
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-500 flex flex-col justify-between h-44 text-left relative group">
                      <div className="absolute inset-0 shimmer-line opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white group-hover:logo-shine-text transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-[10px] text-white/40 tracking-[0.18em] leading-relaxed font-mono uppercase mt-4">
                        {service.description}
                      </p>

                      <div className="border-t border-white/5 pt-4 text-[7px] text-white/20 font-mono uppercase tracking-[0.2em]">
                        01 / Precision
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* PAGE 3: LET'S BUILD SOMETHING UNFORGETTABLE */}
            <div
              style={getSceneStyle(2)}
              className="fixed inset-0 flex flex-col items-center justify-between p-8 md:p-24"
            >
              {/* Empty spacing for header alignment */}
              <div className="h-4" />

              {/* Main Content Card */}
              <div className="flex flex-col items-center text-center max-w-2xl relative z-20">
                <span className="font-pinyon text-3xl md:text-5xl text-white/80 lowercase tracking-normal block mb-6">
                  let's build something unforgettable.
                </span>
                
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-premium leading-none text-white font-sans mt-2">
                  CHRISBUILDS
                </h2>
                
                <p className="text-[10px] md:text-xs text-white/45 uppercase tracking-[0.3em] font-mono mt-4">
                  Luxury Digital Experiences.
                </p>

                {/* Direct Contact Links */}
                <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-lg pointer-events-auto">
                  {contactLinks.map((item) => (
                    <TiltCard key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all flex items-center gap-3 w-full h-full"
                      >
                        <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                          {item.icon}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[7px] text-white/35 uppercase tracking-widest font-mono">{item.label}</span>
                          <span className="text-[9px] text-white/60 tracking-wider font-light mt-0.5 truncate max-w-[120px]">{item.value}</span>
                        </div>
                      </a>
                    </TiltCard>
                  ))}
                </div>
              </div>

              {/* Bottom Copyright Footer */}
              <div className="pointer-events-auto relative z-30 pb-4">
                <a
                  href="https://chrisbuilds.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 hover:text-white/80 transition-colors cursor-pointer"
                >
                  Designed & Developed by ChrisBuilds
                </a>
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
