"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Smooth progress loading curve
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 5;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 1200); // Wait for the exit wipe animation to finish
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} // GSAP Power4.inOut easing curve
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between brushed-chrome text-white p-12 select-none overflow-hidden border-b border-white/10"
        >
          {/* Subtle metallic shimmer that travels across the panel */}
          <div className="shimmer-line" />

          {/* Soft white ambient lights */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.015] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-white/[0.015] rounded-full blur-[80px] pointer-events-none" />

          {/* Minimal Header */}
          <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-[0.3em] text-white/40 font-medium">
            <span>CHRISBUILDS // STUDIO</span>
            <span>SPECIFICATION GATE</span>
          </div>

          {/* Centered Logo Reveal with Silver Shine */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline justify-center select-none logo-shine-text"
            >
              {/* Refined signature script font for "Chris" */}
              <span className="font-pinyon text-6xl md:text-8xl font-normal lowercase tracking-wide mr-2 capitalize">
                Chris
              </span>
              {/* Modern bold sans-serif font for "Builds" */}
              <span className="text-3xl md:text-5xl font-black tracking-[0.25em] uppercase font-sans">
                BUILDS
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-[9px] font-mono tracking-[0.45em] text-center text-white/80 uppercase"
            >
              DIGITAL LABS // CALIBRATION
            </motion.p>
          </div>

          {/* Bottom minimal progress footer */}
          <div className="w-full max-w-xs flex flex-col gap-3 items-center relative z-10">
            <div className="flex justify-between items-end w-full text-[9px] font-mono text-white/40 font-bold">
              <span>PRE-RENDERING VIEWPORTS</span>
              <span>{progress}%</span>
            </div>
            
            <div className="w-full h-[2px] bg-white/5 relative overflow-hidden rounded-full border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/10 via-white to-white/10"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
