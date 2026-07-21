"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { FadeIn } from "./FadeIn";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 40 - 180 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = randomRange(12, 22);
      const yDuration = 0.28;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.6, 1.4));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 12,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => {
        peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-[32vh] sm:h-[35vh] md:h-[40vh] pointer-events-none z-10 opacity-75" />
  );
};

export function ContactSection() {
  return (
    <section className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col justify-between items-center text-center relative overflow-hidden select-none px-6 pt-24 pb-8">
      {/* Background soft ambient grid glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-white/[0.015] blur-[110px] pointer-events-none z-0" />

      {/* Top Header */}
      <div className="z-20 max-w-xl flex flex-col items-center gap-6 mt-4">
        <FadeIn delay={0.1} y={20}>
          <span className="text-xs sm:text-sm tracking-[0.25em] text-[#D7E2EA]/50 uppercase font-medium">
            Let&apos;s build something unforgettable.
          </span>
        </FadeIn>
      </div>

      {/* Centerpiece Branding (Huge with subtle white glow) */}
      <div className="z-20 flex flex-col items-center justify-center my-auto py-8">
        <FadeIn delay={0.25} y={30}>
          <h2 
            className="font-black tracking-[0.06em] leading-none uppercase select-none text-[12vw] sm:text-[11vw] md:text-[9.5vw] text-white"
            style={{
              textShadow: "0 0 70px rgba(255, 255, 255, 0.22), 0 0 35px rgba(255, 255, 255, 0.12)",
            }}
          >
            CHRISBUILDS
          </h2>
        </FadeIn>
        <FadeIn delay={0.35} y={20} className="mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm md:text-base tracking-[0.38em] text-[#D7E2EA]/70 uppercase font-light">
            Luxury Digital Experiences.
          </p>
        </FadeIn>
      </div>

      {/* Contact Channels (Only Email and WhatsApp) */}
      <div className="z-20 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20 md:gap-32 w-full max-w-4xl mt-auto mb-16 px-4">
        {/* Email */}
        <FadeIn delay={0.45} y={20} className="flex flex-col items-center gap-2">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] text-[#D7E2EA]/40 uppercase font-semibold">
            EMAIL
          </span>
          <a
            href="mailto:chrisbuilds.dev@gmail.com"
            className="text-sm sm:text-base md:text-lg font-light tracking-wider hover:text-white transition-colors duration-300"
          >
            chrisbuilds.dev@gmail.com
          </a>
        </FadeIn>

        {/* WhatsApp */}
        <FadeIn delay={0.55} y={20} className="flex flex-col items-center gap-2">
          <span className="text-[10px] sm:text-xs tracking-[0.3em] text-[#D7E2EA]/40 uppercase font-semibold">
            WHATSAPP
          </span>
          <a
            href="https://wa.me/918738882912?text=Hi%20Chris!%20I%20visited%20your%20portfolio%20website%20and%20would%20like%20to%20discuss%20a%20project%20with%20you."
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base md:text-lg font-light tracking-wider hover:text-white transition-colors duration-300"
          >
            +91 87388 82912
          </a>
        </FadeIn>
      </div>

      {/* Animated Walking Crowd Canvas at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-10">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>

      {/* Footer Info (All Rights Reserved) */}
      <div className="z-20 w-full border-t border-white/[0.05] pt-6 pb-2">
        <FadeIn delay={0.65} y={15}>
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#D7E2EA]/40 font-light uppercase">
            © 2026 CHRISBUILDS. ALL RIGHTS RESERVED.
          </span>
        </FadeIn>
      </div>
    </section>
  );
}
