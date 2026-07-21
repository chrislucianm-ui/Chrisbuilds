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
  center = false,
}) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative inline-block overflow-hidden cursor-pointer select-none", className)}
      style={{
        lineHeight: 0.9,
      }}
    >
      <div className="flex justify-center items-center">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                duration: 0.35,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block whitespace-pre"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                duration: 0.35,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block whitespace-pre"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};
