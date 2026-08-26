"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import LiquidHover from "@/components/originkit/ui/hero-11/liquid-distortion";

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

const HERO_SRC = "/hero-character.png";

const PORTRAIT_FRAME =
  "absolute top-[14%] left-1/2 z-[5] aspect-square w-[min(92vw,400px)] -translate-x-1/2 pointer-events-auto ipad:top-[8%] ipad:w-[min(72vw,520px)] desktop-sm:top-[58%] desktop-sm:h-[100svh] desktop-sm:w-[100svh] desktop-sm:max-w-none desktop-sm:-translate-y-1/2";

const BOTTOM_BLEND: CSSProperties = {
  maskImage:
    "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.55) 78%, transparent 98%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.55) 78%, transparent 98%)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
};

export const PortraitStage = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={PORTRAIT_FRAME}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.1 }}
      aria-hidden="true"
    >
      <div className="relative size-full overflow-hidden" style={BOTTOM_BLEND}>
        <img
          src={HERO_SRC}
          alt=""
          aria-hidden="true"
          crossOrigin="anonymous"
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute size-0 opacity-0"
        />
        <LiquidHover
          imageSrc={HERO_SRC}
          resolution={12}
          cursorSize={18}
          intensity={20}
          style={{ width: "100%", height: "100%", cursor: "crosshair" }}
        />
      </div>
    </motion.div>
  );
};
