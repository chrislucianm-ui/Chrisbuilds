"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

const STAGGER = 0.035;

export interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
}

export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className,
  center = true,
}) => {
  const letters = children.split("");

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn(
        "relative inline-flex overflow-hidden cursor-pointer select-none pointer-events-auto leading-none py-1",
        className
      )}
    >
      {/* Primary Row (Rolls Upward out of view) */}
      <span className="flex justify-center items-center leading-none">
        {letters.map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (letters.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              key={i}
              variants={{
                initial: { y: "0%" },
                hovered: { y: "-100%" },
              }}
              transition={{
                duration: 0.35,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block whitespace-pre hero-heading leading-none"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </span>

      {/* Secondary Duplicate Row (Rolls Upward into view) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex justify-center items-center leading-none pointer-events-none"
      >
        {letters.map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (letters.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              key={i}
              variants={{
                initial: { y: "100%" },
                hovered: { y: "0%" },
              }}
              transition={{
                duration: 0.35,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block whitespace-pre hero-heading leading-none"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </span>
    </motion.span>
  );
};
