"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mail, Phone, MessageSquare, Send, X } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import HeroBackgroundCanvas from "@/components/HeroBackgroundCanvas";
import Lenis from "lenis";

interface Project {
  title: string;
  category: string;
  description: string;
  specs: string[];
}

const PROJECTS: Project[] = [
  {
    title: "Noir.io",
    category: "Creative Scroll Studio",
    description: "An immersive, story-driven luxury showcase featuring advanced inertial scrolling, mouse-relative camera drift, and glassmorphic depth filters.",
    specs: ["Three.js", "GSAP", "Refraction Shaders"]
  },
  {
    title: "SpaceX Orbit",
    category: "Cinematic Traversal",
    description: "A real-time flight telemetry simulation mapping orbiting spacecraft positions to interactive volumetric particle nebulas.",
    specs: ["WebGL", "Framer Motion", "Real-Time Telemetry"]
  },
  {
    title: "Apple Bloom",
    category: "Luxury Product Film",
    description: "Interactive 3D product reveal experience with concentric chrome rings, reflective materials, and macro camera animations.",
    specs: ["MeshPhysicalMaterial", "Bloom Shaders", "Volumetric Lighting"]
  },
  {
    title: "Awwwards",
    category: "Digital Space Story",
    description: "Award-winning interactive universe tracing the history of design with procedural cosmic dust and shooting stars.",
    specs: ["Procedural Shader", "Lenis", "High-Performance Rendering"]
  }
];

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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

  // Lock body scroll when loading or modal is active
  useEffect(() => {
    if (!loadingComplete || activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loadingComplete, activeProject]);

  // Calculate active scene index (7 scenes total)
  const activeSceneIndex = Math.min(6, Math.floor(scrollProgress * 7.2));

  // Scene 2 sub-progress steps
  const scene2Progress = (scrollProgress - 0.15) / 0.15; // 0 to 1
  const scene2Step = Math.min(2, Math.floor(scene2Progress * 3.2));

  // Scene 4 sub-progress steps
  const scene4Progress = (scrollProgress - 0.45) / 0.15; // 0 to 1
  const showScene4Details = scene4Progress >= 0.5;

  const contactLinks = [
    { label: "Email", value: "chrisbuilds.dev@gmail.com", href: "mailto:chrisbuilds.dev@gmail.com?subject=Project Inquiry", icon: <Mail className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "Phone", value: "+91 87388 82912", href: "tel:+918738882912", icon: <Phone className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "WhatsApp", value: "+91 87388 82912", href: "https://wa.me/918738882912", icon: <MessageSquare className="w-4 h-4 text-white/40" strokeWidth={1} /> },
    { label: "Telegram", value: "@chrisbuilds", href: "https://t.me/chrisbuilds", icon: <Send className="w-4 h-4 text-white/40" strokeWidth={1} /> }
  ];

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {loadingComplete && (
        <div className="relative min-h-screen bg-black text-white selection:bg-white/10 selection:text-white overflow-x-hidden font-sans">
          
          {/* Continuous Full-Page WebGL Background */}
          <HeroBackgroundCanvas 
            scrollProgress={scrollProgress} 
            hoveredProjectIndex={hoveredProjectIndex} 
          />

          {/* Fixed Scroll Navigation Indicator */}
          <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50 hidden md:flex flex-col gap-5">
            {Array.from({ length: 7 }).map((_, i) => (
              <button
                key={i}
                onClick={() => window.scrollTo({ top: (i / 7) * (document.documentElement.scrollHeight - window.innerHeight), behavior: "smooth" })}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 border ${
                  activeSceneIndex === i 
                    ? "bg-white border-white scale-125 shadow-[0_0_10px_#fff]" 
                    : "bg-transparent border-white/30 hover:border-white/80"
                }`}
              />
            ))}
          </div>

          {/* Sticky Cinematic Text Overlays */}
          <div className="relative z-10 w-full h-[700vh] pointer-events-none">
            
            <AnimatePresence mode="wait">
              
              {/* SCENE 1: ARRIVAL */}
              {activeSceneIndex === 0 && (
                <motion.div
                  key="scene1"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-6">
                    Arrival
                  </span>
                  <h1 className="text-5xl md:text-8xl font-black uppercase tracking-premium leading-[0.9] text-white max-w-4xl">
                    WE BUILD DIGITAL<br />
                    <span className="logo-shine-text">EXPERIENCES.</span>
                  </h1>
                  <span className="mt-8 font-cursive text-xl md:text-2xl text-white/50 tracking-wider">
                    that people remember.
                  </span>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-white/20 font-mono">
                      Scroll to travel
                    </span>
                    <div className="w-[1px] h-10 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                </motion.div>
              )}

              {/* SCENE 2: WHO WE ARE */}
              {activeSceneIndex === 1 && (
                <motion.div
                  key="scene2"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8 }}
                  className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-8">
                    Vision
                  </span>
                  <div className="min-h-[120px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {scene2Step === 0 && (
                        <motion.h2
                          key="step0"
                          initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                          exit={{ opacity: 0, filter: "blur(8px)", y: -15 }}
                          className="text-3xl md:text-6xl font-black uppercase tracking-premium max-w-3xl text-white"
                        >
                          We don't build websites.
                        </motion.h2>
                      )}
                      {scene2Step === 1 && (
                        <motion.h2
                          key="step1"
                          initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                          exit={{ opacity: 0, filter: "blur(8px)", y: -15 }}
                          className="text-3xl md:text-6xl font-black uppercase tracking-premium max-w-3xl text-white"
                        >
                          We build first impressions.
                        </motion.h2>
                      )}
                      {scene2Step >= 2 && (
                        <motion.h2
                          key="step2"
                          initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                          exit={{ opacity: 0, filter: "blur(8px)", y: -15 }}
                          className="text-3xl md:text-6xl font-black uppercase tracking-premium max-w-4xl text-white"
                        >
                          Luxury is an experience,<br />
                          <span className="logo-shine-text">not a feature.</span>
                        </motion.h2>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* SCENE 3: WHAT WE BUILD */}
              {activeSceneIndex === 2 && (
                <motion.div
                  key="scene3"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8 }}
                  className="fixed inset-0 flex flex-col justify-center px-8 md:px-24"
                >
                  <div className="max-w-4xl">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-6 block">
                      Capabilities
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-premium text-white leading-none mb-12">
                      WHAT WE BUILD
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl pointer-events-auto">
                      {[
                        "Premium Websites",
                        "Web Applications",
                        "Mobile Applications",
                        "AI Solutions",
                        "Automations",
                        "Branding"
                      ].map((service) => (
                        <div 
                          key={service} 
                          className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 group"
                        >
                          <h3 className="font-sans font-bold text-white tracking-wider uppercase text-xs">
                            {service}
                          </h3>
                          <div className="silver-divider max-w-[30px] mt-3 group-hover:max-w-[60px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCENE 4: THE CRAFT */}
              {activeSceneIndex === 3 && (
                <motion.div
                  key="scene4"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8 }}
                  className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-6">
                    The Craft
                  </span>

                  <div className="min-h-[220px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {!showScene4Details ? (
                        <motion.div 
                          key="craftHeader"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          className="flex flex-col gap-4"
                        >
                          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-premium text-white leading-tight">
                            Crafted with precision.<br />
                            Designed with purpose.<br />
                            Built to perform.
                          </h2>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="craftGrid"
                          initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                          exit={{ opacity: 0, filter: "blur(8px)", y: -15 }}
                          className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl pointer-events-auto"
                        >
                          {[
                            "UI/UX Design",
                            "Performance",
                            "Scalability",
                            "Premium Design Systems",
                            "Automation",
                            "Optimization"
                          ].map((item) => (
                            <div 
                              key={item} 
                              className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-28 text-left"
                            >
                              <span className="text-[8px] text-white/20 font-mono uppercase tracking-[0.2em]">01 / Precision</span>
                              <h4 className="font-bold text-white text-xs tracking-wider uppercase">{item}</h4>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* SCENE 5: PHILOSOPHY */}
              {activeSceneIndex === 4 && (
                <motion.div
                  key="scene5"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8 }}
                  className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-8">
                    Philosophy
                  </span>
                  <h2 className="text-3xl md:text-6xl font-black uppercase tracking-premium leading-tight text-white max-w-4xl">
                    Every pixel matters.<br />
                    Every interaction tells a story.<br />
                    <span className="logo-shine-text">Every experience leaves an impression.</span>
                  </h2>
                </motion.div>
              )}

              {/* SCENE 6: FEATURED WORK */}
              {activeSceneIndex === 5 && (
                <motion.div
                  key="scene6"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8 }}
                  className="fixed inset-0 flex flex-col justify-center px-8 md:px-24"
                >
                  <div className="max-w-4xl pointer-events-auto">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-6 block">
                      Showcase
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-premium text-white leading-none mb-12">
                      FEATURED WORK
                    </h2>
                    
                    <div className="flex flex-col gap-6 max-w-xl">
                      {PROJECTS.map((project, idx) => (
                        <div
                          key={project.title}
                          onMouseEnter={() => setHoveredProjectIndex(idx)}
                          onMouseLeave={() => setHoveredProjectIndex(null)}
                          onClick={() => setActiveProject(project)}
                          className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer flex justify-between items-center group"
                        >
                          <div className="flex flex-col">
                            <span className="text-[8px] text-white/30 uppercase font-mono tracking-widest">{project.category}</span>
                            <h3 className="text-xl font-bold uppercase tracking-wider text-white mt-1 group-hover:text-white transition-colors">
                              {project.title}
                            </h3>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCENE 7: CONTACT */}
              {activeSceneIndex === 6 && (
                <motion.div
                  key="scene7"
                  initial={{ opacity: 0, filter: "blur(12px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.8 }}
                  className="fixed inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-24 gap-12"
                >
                  <div className="flex flex-col text-left max-w-xl">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.35em] font-mono mb-6">
                      Collaborate
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-premium leading-none text-white max-w-md">
                      Let's build something unforgettable.
                    </h2>
                    <h3 className="mt-8 text-lg font-bold tracking-widest uppercase">
                      ChrisBuilds
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mt-1">
                      Luxury Digital Experiences Crafted For Tomorrow.
                    </p>

                    {/* Social/Communication Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-8 pointer-events-auto">
                      {contactLinks.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-3"
                        >
                          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                            {item.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[7px] text-white/30 uppercase tracking-widest font-mono">{item.label}</span>
                            <span className="text-[10px] text-white/60 tracking-wider font-light mt-0.5 truncate max-w-[140px]">{item.value}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Premium floating glass contact form */}
                  <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
                    <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-6">Send a Direct Message</h4>
                    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                      <div className="flex flex-col gap-2">
                        <label className="text-[7px] text-white/40 uppercase tracking-[0.2em] font-mono">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Chris Lucian" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white/30 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[7px] text-white/40 uppercase tracking-[0.2em] font-mono">Your Email</label>
                        <input 
                          type="email" 
                          placeholder="e.g. client@luxury.com" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white/30 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[7px] text-white/40 uppercase tracking-[0.2em] font-mono">Project Details</label>
                        <textarea 
                          rows={3} 
                          placeholder="Tell us about your project vision..." 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/25 focus:border-white/30 focus:outline-none transition-colors resize-none"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn-luxury w-full py-4.5 rounded-xl mt-3 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Transmit Proposal <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Cinematic Floating Project Detail Modal Overlay */}
          <AnimatePresence>
            {activeProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl"
              >
                <motion.div
                  initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-xl glass-panel border border-white/10 rounded-3xl p-8 relative shadow-2xl"
                >
                  <button 
                    onClick={() => setActiveProject(null)}
                    className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-mono block mb-2">
                    {activeProject.category}
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-premium text-white leading-tight mb-6">
                    {activeProject.title}
                  </h3>

                  <div className="silver-divider max-w-[80px] mb-8" />

                  <p className="text-white/60 text-xs leading-relaxed font-sans mb-8">
                    {activeProject.description}
                  </p>

                  <div className="flex flex-col gap-3">
                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Project Specifications</span>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.specs.map(spec => (
                        <span key={spec} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono text-white/55">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </>
  );
}
