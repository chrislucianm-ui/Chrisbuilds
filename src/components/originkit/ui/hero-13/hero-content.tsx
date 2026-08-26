// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import { useState } from "react";
import { Variants, motion } from "motion/react";
import { Button } from "@/components/originkit/ui/hero-13/button";
import FocusReveal from "@/components/originkit/ui/hero-13/focus-reveal";

type HeroContentProps = {
  onExploreGallery: () => void;
  onBookShoot: () => void;
};

const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const FADE_UP_ITEM: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const HeroContent = ({
  onExploreGallery,
  onBookShoot,
}: HeroContentProps) => {
  const [headingComplete, setHeadingComplete] = useState(false);

  return (
    <div className="relative z-20 flex w-full items-center justify-center py-4">
      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4 text-center ipad:gap-8">
        <div className="flex w-full flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1], delay: 0.1 }}
            className="font-black tracking-[0.08em] uppercase text-[7vw] sm:text-[5vw] md:text-[3.5vw] text-transparent bg-clip-text bg-gradient-to-r from-[#ff7b1a] to-[#ff9a50] mb-2 select-none drop-shadow-[0_0_25px_rgba(255,123,26,0.22)]"
          >
            Chris Builds
          </motion.div>

          <FocusReveal
            as="h1"
            text="Elevating Digital Design Through Perspective"
            className="w-full font-instrument-serif text-[48px] leading-[1.1] tracking-[-1.44px] text-white text-balance ipad:text-[68px] ipad:leading-[70px] ipad:tracking-[-2.04px] desktop-sm:text-[68px] desktop-sm:leading-[70px] desktop-sm:tracking-[-2.04px]"
            staggerFrom="start"
            blur={20}
            transition={{
              type: "tween",
              duration: 0.4,
              staggerChildren: 0.04,
              ease: "easeOut",
            }}
            onComplete={() => setHeadingComplete(true)}
          />

          <motion.div
            className="flex w-full flex-col items-center gap-6 ipad:gap-8"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate={headingComplete ? "visible" : "hidden"}
          >
            <motion.p
              variants={FADE_UP_ITEM}
              className="w-full max-w-[321px] font-tight text-[16px] leading-[1.5] tracking-[-0.32px] text-white/65 text-pretty ipad:text-[17px] ipad:leading-[25.5px] ipad:tracking-[-0.34px]"
            >
              Thoughtfully crafted interfaces with refined typography, custom layouts, and interactive storytelling.
            </motion.p>

            <motion.div
              variants={FADE_UP_ITEM}
              className="flex w-auto flex-row items-center gap-3 ipad:gap-4"
            >
              <Button
                variant="primary"
                aria-label="Explore Services"
                onClick={onExploreGallery}
                className="w-fit"
              >
                Explore Services
              </Button>
              <Button
                variant="secondary"
                aria-label="Contact Me"
                onClick={onBookShoot}
                className="w-fit"
              >
                Contact Me
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
