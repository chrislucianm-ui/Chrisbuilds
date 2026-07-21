"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "Яānō",
  "Hallo",
  "Hola",
  "Hello",
];

const cubicEase = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Preload fonts & assets before initiating animation loop
  useEffect(() => {
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);

  // Sequential word cycling without word skipping
  useEffect(() => {
    if (!isReady) return;

    if (index < words.length - 1) {
      const delay = index === 0 ? 850 : 170;
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Final greeting reached -> hold for 400ms then initiate exit curtain
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
      }, 420);
      return () => clearTimeout(exitTimer);
    }
  }, [index, isReady]);

  const slideUp = {
    initial: { y: "0%" },
    exit: {
      y: "-100%",
      transition: { duration: 0.85, ease: cubicEase, delay: 0.15 },
    },
  };

  const curveVariants = {
    initial: {
      d: "M0 0 L100 0 L100 100 L0 100 Z",
    },
    exit: {
      d: "M0 0 L100 0 L100 100 Q50 160 0 100 Z",
      transition: { duration: 0.75, ease: cubicEase, delay: 0.25 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#000000] text-[#FFFFFF] select-none pointer-events-none overflow-hidden will-change-transform transform-gpu"
        >
          {/* Word Indicator Container */}
          <div className="relative z-10 flex items-center gap-3.5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#FFFFFF] select-none">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FFFFFF] inline-block animate-pulse shrink-0" />
            <span className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] text-left inline-block">
              {words[index]}
            </span>
          </div>

          {/* GPU Hardware Accelerated SVG Exit Curve Mask */}
          <svg
            className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-[#000000]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.path
              variants={curveVariants}
              initial="initial"
              exit="exit"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
