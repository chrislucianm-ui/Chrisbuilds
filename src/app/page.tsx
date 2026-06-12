"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero3DCanvas from "@/components/Hero3DCanvas";
import ProjectShowcase from "@/components/ProjectShowcase";
import AppsAndGames from "@/components/AppsAndGames";
import Services from "@/components/Services";
import Technologies from "@/components/Technologies";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import { ArrowRight, Eye, Sparkles } from "lucide-react";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleScrollTo = (id: string) => {
    const targetElement = document.querySelector(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
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
            transition={{ duration: 1.2 }}
            className="relative w-full min-h-screen flex flex-col justify-between"
          >
            {/* Header / Navbar */}
            <Navbar />

            {/* Custom WebGL 3D Landscape Canvas */}
            <Hero3DCanvas />

            {/* Floating blurred organic background elements */}
            <div className="fluid-blob-1" />
            <div className="fluid-blob-2" />
            <div className="fluid-blob-3" />

            {/* Hero Section - Temporary red backdrop */}
            <section
              id="home"
              className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-6 md:px-12 overflow-hidden z-10 bg-transparent"
            >
              <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
                
                {/* Left Columns: Text Details */}
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-8 text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500 tracking-[0.25em]"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6c00d9] animate-pulse" />
                    <span>CHRISBUILDS // CREATIVE STUDIO</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-premium text-slate-800 leading-[1.08]"
                  >
                    We Design <br />
                    Digital Experiences <br />
                    <span className="text-slate-400">That People Remember.</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-sm md:text-base text-slate-600 font-medium max-w-lg leading-relaxed"
                  >
                    Websites, Apps & Digital Products crafted for ambitious businesses. We prioritize modern aesthetics, fast interactions, and premium detail.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2"
                  >
                    <button
                      onClick={() => handleScrollTo("#showcase")}
                      className="btn-vibrant px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                    >
                      <Eye className="w-4 h-4 text-slate-600" /> View Projects
                    </button>
                    
                    <button
                      onClick={() => handleScrollTo("#contact")}
                      className="btn-vibrant-outline px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer font-semibold"
                    >
                      Start a Project <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>

                {/* Right Columns: Floating Luxury Device Mockups */}
                <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="relative w-80 h-[380px] md:h-[400px] flex items-center justify-center"
                  >
                    {/* Floating Browser Mockup */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-0 right-4 w-72 h-48 bg-white/35 border border-white/60 rounded-xl overflow-hidden shadow-lg backdrop-blur-md"
                    >
                      {/* Browser Bar */}
                      <div className="w-full h-7 border-b border-slate-200/40 bg-white/40 px-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                      <div className="p-4 flex flex-col gap-2.5">
                        <div className="w-24 h-2 rounded bg-slate-400/20" />
                        <div className="w-full h-8 rounded bg-white/50 border border-slate-200/30" />
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded-lg bg-white/30 border border-slate-200/30" />
                          <div className="flex-1 flex flex-col gap-1.5 pt-1">
                            <div className="w-full h-1.5 rounded bg-slate-400/20" />
                            <div className="w-2/3 h-1.5 rounded bg-slate-400/20" />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Mobile App Mockup */}
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-4 left-0 w-48 h-64 bg-white/45 border border-white/60 rounded-2xl overflow-hidden p-4 shadow-lg backdrop-blur-md"
                    >
                      <div className="w-full h-4 flex justify-between items-center px-1 mb-4">
                        <span className="w-3.5 h-1.5 rounded-full bg-slate-300/40" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300/40" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="w-12 h-12 rounded-full border border-slate-200/50 bg-white/50 mx-auto flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-[#6c00d9]/40" />
                        </div>
                        <div className="w-full h-2 rounded bg-slate-300/20" />
                        <div className="w-2/3 h-2 rounded bg-slate-300/20 mx-auto" />
                        
                        <div className="w-full h-10 rounded-lg bg-[#6c00d9] text-white text-[9px] font-bold flex items-center justify-center uppercase tracking-wider mt-2 shadow-sm">
                          Start Project
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

              </div>

              {/* Scroll down indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity">
                <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-500">SCROLL DOCK</span>
                <div className="w-5 h-8 rounded-full border border-slate-300/40 p-1 flex justify-center">
                  <motion.div
                    animate={{
                      y: [0, 10, 0]
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-1 h-1.5 rounded-full bg-[#6c00d9]"
                  />
                </div>
              </div>
            </section>

            {/* Featured Projects Showcase */}
            <div className="relative z-10">
              <ProjectShowcase />
            </div>

            {/* Interactive Sandbox Widgets */}
            <div className="relative z-10">
              <AppsAndGames />
            </div>

            {/* Capabilities Services */}
            <div className="relative z-10">
              <Services />
            </div>

            {/* Tech Stack Badge Showcase */}
            <div className="relative z-10">
              <Technologies />
            </div>

            {/* Value Proposition columns */}
            <div className="relative z-10">
              <WhyChooseUs />
            </div>

            {/* Contact Center Form */}
            <div className="relative z-10">
              <ContactSection />
            </div>

            {/* Footer */}
            <footer className="bg-transparent border-t border-slate-200/50 py-16 px-6 md:px-12 text-center text-xs font-semibold text-slate-500 relative z-10">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-black tracking-widest text-xs text-slate-800">
                    CHRIS<span className="text-[#6c00d9]">BUILDS</span>
                  </span>
                </div>
                
                <div className="flex gap-6 text-[9px] text-slate-500 uppercase tracking-widest font-semibold items-center">
                  <span className="hover:text-[#6c00d9] transition-colors cursor-pointer">PRIVACY POLICY</span>
                  <span className="hover:text-[#6c00d9] transition-colors cursor-pointer">TERMS DOCK</span>
                  <a href="/admin" className="hover:text-[#6c00d9] transition-colors cursor-pointer">ADMIN PORTAL</a>
                </div>

                <div className="text-[9px]">
                  © 2026 CHRISBUILDS STUDIO. ALL RIGHTS RESERVED.
                </div>
              </div>
            </footer>

            {/* Sticky Floating WhatsApp Contact FAB */}
            <motion.a
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="https://wa.me/918738882912?text=Hello%20ChrisBuilds,%20I%20have%20an%20idea%20for%20a%20project..."
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-colors duration-300 border border-white/20 group"
              aria-label="Contact on WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.512 2.016 14.06 1.01 11.43 1.01c-5.437 0-9.863 4.371-9.867 9.8.001 1.64.453 3.241 1.31 4.673L1.82 20.946l5.728-1.503c1.472.802 3.018 1.226 4.6 1.227h.009zm11.285-7.73c-.3-.149-1.772-.874-2.046-.973-.274-.1-.474-.149-.674.15-.2.299-.774.973-.948 1.172-.175.2-.349.224-.649.075-.3-.15-1.265-.466-2.41-1.485-.89-.794-1.49-1.775-1.665-2.074-.175-.3-.019-.461.13-.61.135-.133.3-.349.449-.524.149-.175.199-.299.299-.499.1-.2.05-.374-.025-.524-.075-.15-.674-1.622-.924-2.221-.244-.588-.492-.51-.674-.519-.173-.009-.372-.01-.572-.01-.2 0-.523.075-.797.374-.274.299-1.047 1.022-1.047 2.493 0 1.47 1.072 2.892 1.222 3.091.149.2 2.11 3.22 5.11 4.516.714.308 1.272.492 1.707.63.717.228 1.37.196 1.885.119.574-.086 1.772-.724 2.022-1.422.25-.699.25-1.297.175-1.422-.075-.125-.275-.199-.575-.349z" />
              </svg>
              <span className="absolute right-16 bg-white text-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-md border border-slate-100 tracking-widest whitespace-nowrap uppercase">
                Chat on WhatsApp
              </span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
