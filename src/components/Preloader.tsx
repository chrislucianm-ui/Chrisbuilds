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
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (index === words.length - 1) return;
    const timeout = setTimeout(
      () => {
        setIndex((prevIndex) => prevIndex + 1);
      },
      index === 0 ? 1000 : 150
    );
    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } L0 ${dimension.height} Z`;

  const targetPath = `M0 0 L${dimension.width} 0 L${
    dimension.width
  } ${dimension.height} Q${dimension.width / 2} ${
    dimension.height + 300
  } 0 ${dimension.height} Z`;

  const curveVariants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: cubicEase },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: cubicEase, delay: 0.3 },
    },
  };

  const slideUp = {
    initial: { top: 0 },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: cubicEase, delay: 0.2 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#141519] text-white select-none pointer-events-none overflow-hidden"
        >
          {dimension.width > 0 && (
            <>
              {/* Multilingual Greetings Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white select-none"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white inline-block animate-pulse" />
                <span>{words[index]}</span>
              </motion.div>

              {/* Curved SVG Exit Mask */}
              <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-[#141519]">
                <motion.path
                  variants={curveVariants}
                  initial="initial"
                  exit="exit"
                />
              </svg>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
