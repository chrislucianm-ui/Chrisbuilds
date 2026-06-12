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
        const step = Math.floor(Math.random() * 8) + 4;
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

  // Staggered letters for modern typographic reveal
  const titleLetters = "CHRISBUILDS".split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-gradient-to-tr from-[#cbe3fc] via-[#e5d1fa] to-[#ffd3e8] text-slate-800 p-12 select-none overflow-hidden"
        >
          {/* Ambient colorful backdrop lights */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/40 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/40 rounded-full blur-[90px] pointer-events-none" />

          {/* Minimal Header */}
          <div className="w-full flex justify-between items-center text-[10px] tracking-[0.3em] text-slate-500 font-medium">
            <span>CHRISBUILDS.COM</span>
            <span>CREATIVE STUDIO</span>
          </div>

          {/* Centered Logo Reveal */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex overflow-hidden">
              {titleLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 120, filter: "blur(8px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`text-5xl md:text-7xl font-black tracking-tight ${
                    index >= 5 
                      ? "text-gradient-cyan-purple" 
                      : "text-slate-800"
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-[10px] tracking-[0.4em] text-center text-slate-600 font-semibold"
            >
              A STORY IN MOTION
            </motion.p>
          </div>

          {/* Bottom minimal progress footer */}
          <div className="w-full max-w-xs flex flex-col gap-3 items-center">
            <div className="flex justify-between items-end w-full text-[10px] text-slate-500 font-medium">
              <span>EXPLORING THE LANDSCAPE</span>
              <span>{progress}%</span>
            </div>
            
            <div className="w-full h-[2px] bg-slate-800/5 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00a0c2] via-[#6c00d9] to-[#d9006c]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
