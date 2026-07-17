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
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Framer Motion native useScroll hook tracks progress on the GPU without triggering any React state changes or re-renders
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

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
        <div className="relative min-h-screen text-white selection:bg-white/10 selection:text-white overflow-x-hidden font-sans">
          
          {/* Continuous Fixed Background Parallax (Desktop Only, Optimized with next/image WebP compression and GPU values) */}
          <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-black hidden md:block">
            <motion.div 
              style={{
                y: yParallax,
                scale: 1.15
              }}
              className="w-full h-[115%] absolute top-0 left-0"
            >
              <Image
                src="/hero-bg-desktop.png"
                alt="Cinematic Space Background"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </div>

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
              {/* Mobile-only background (Static, 100vh, full bleed, optimized with next/image WebP compression) */}
              <div className="absolute inset-0 w-screen h-screen -z-10 block md:hidden left-1/2 -translate-x-1/2 pointer-events-none">
                <Image
                  src="/hero-bg-mobile.png"
                  alt="Cinematic Space Background Mobile"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* main Editorial Heading with Staggered Entrance (Bypassed on mobile to avoid layout shifts) */}
              <motion.h1 
                initial={isMobileDevice ? {} : { opacity: 0, y: 30 }}
                animate={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="flex flex-col gap-2 md:gap-4 text-center md:text-left font-sans select-none tracking-[0.06em] md:tracking-[0.10em] max-w-4xl"
              >
                {/* Line 1: Larger and extremely bold with luxurious glass-metallic vertical gradient */}
                <span className="text-4xl sm:text-5xl md:text-8xl font-black uppercase text-luxury-gloss leading-none tracking-wider heading-glow-strong">
                  WE BUILD DIGITAL
                </span>
                {/* Line 2: 15% smaller than Line 1, bold and impactful with sliding shine effect */}
                <span className="text-[30px] sm:text-[42px] md:text-[80px] font-black uppercase logo-shine-text leading-none tracking-widest mt-1">
                  EXPERIENCES.
                </span>
              </motion.h1>

              {/* Luxury cursive signature with subtle glow and opacity fade-in */}
              <motion.span 
                initial={isMobileDevice ? {} : { opacity: 0, y: 15 }}
                animate={isMobileDevice ? { opacity: 0.85 } : { opacity: 0.85, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="mt-8 font-pinyon text-3xl md:text-5xl text-white tracking-wide heading-glow block"
              >
                that people remember.
              </motion.span>

              {/* Centered Buttons matching original layout with staggered entry */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0, y: 15 }}
                animate={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                className="flex flex-row items-center justify-center md:justify-start gap-4 mt-10 w-full"
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

            {/* PAGE 2: WHAT I BUILD (LUXURY DIGITAL SHOWCASE) */}
            <section
              id="services"
              className="py-36 px-6 md:px-12 max-w-5xl mx-auto w-full flex flex-col justify-center min-h-screen relative"
            >
              {/* Local space dust/twinkle particles (Hidden on mobile to optimize CPU/GPU cycles) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 hidden md:block">
                <div className="twinkle-star top-1/4 left-10" style={{ animationDelay: "1s" }} />
                <div className="twinkle-star top-1/3 right-12" style={{ animationDelay: "3s" }} />
                <div className="twinkle-star top-2/3 left-1/3" style={{ animationDelay: "0s" }} />
                <div className="twinkle-star top-3/4 right-1/4" style={{ animationDelay: "4s" }} />
                <div className="twinkle-star top-[90%] left-8" style={{ animationDelay: "2.5s" }} />
                <div className="twinkle-star top-[15%] right-[40%]" style={{ animationDelay: "1.8s" }} />
              </div>

              <div className="w-full text-center mb-24 select-none">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-premium text-white leading-none heading-glow">
                  WHAT I BUILD
                </h2>
              </div>

              {/* Alternating Showcase Items */}
              <div className="flex flex-col gap-24 md:gap-36 w-full select-none relative z-10">
                {SERVICES.map((service, idx) => (
                  <motion.div
                    key={service.title}
                    initial={isMobileDevice ? {} : { opacity: 0, x: idx % 2 === 0 ? -45 : 45, y: 15 }}
                    whileInView={isMobileDevice ? {} : { opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col relative py-12 w-full ${
                      idx % 2 === 0 ? "items-center md:items-start text-center md:text-left md:mr-auto md:max-w-xl" : "items-center md:items-end text-center md:text-right md:ml-auto md:max-w-xl"
                    }`}
                  >
                    {/* Floating Glass Lens Backdrop - No rectangular borders (Hidden on mobile for 60 FPS performance) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/[0.012] backdrop-blur-2xl blur-[12px] shadow-[inset_0_1px_30px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none -z-10 hidden md:block" />

                    {/* Luxury Serif Index Number */}
                    <span className="font-serif italic text-3xl md:text-5xl text-white/20 tracking-wider mb-4 block">
                      0{idx + 1}
                    </span>

                    {/* Bold Glossy Title */}
                    <h3 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-luxury-gloss leading-none tracking-wider heading-glow-strong">
                      {service.title}
                    </h3>

                    {/* Minimal Description */}
                    <p className="text-[10px] md:text-xs text-white/40 tracking-[0.2em] leading-relaxed font-mono uppercase mt-6 max-w-sm">
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

              {/* Direct Contact Links - Centered Column on Mobile, Horizontal Row on Desktop */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0, y: 15 }}
                whileInView={isMobileDevice ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 pointer-events-auto w-full"
              >
                {contactLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center transition-all duration-300 relative py-2 px-1"
                  >
                    <span className="text-[9px] text-white/35 uppercase tracking-[0.25em] font-mono group-hover:text-white/80 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-white/60 tracking-[0.08em] font-light mt-1.5 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] transition-all font-mono">
                      {item.value}
                    </span>
                    {/* Underline animation */}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </a>
                ))}
              </motion.div>

              {/* Bottom Copyright Footer */}
              <motion.div 
                initial={isMobileDevice ? {} : { opacity: 0 }}
                whileInView={isMobileDevice ? {} : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.4 }}
                className="pb-4 mt-8 pointer-events-auto"
              >
                <a
                  href="https://chrisbuilds.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 hover:text-white/80 transition-colors cursor-pointer"
                >
                  Designed & Developed by ChrisBuilds
                </a>
              </motion.div>
            </section>

          </div>

        </div>
      )}
    </>
  );
}
