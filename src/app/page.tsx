"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Menu } from "lucide-react";

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";
const SPOTLIGHT_R = 260;

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const div = divRef.current;
    if (!canvas || !div || size.width === 0 || size.height === 0) return;

    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size.width, size.height);

    // Build radial gradient at (cursorX, cursorY)
    const grad = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R
    );
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.4, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.6, "rgba(255, 255, 255, 0.75)");
    grad.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
    grad.addColorStop(0.88, "rgba(255, 255, 255, 0.12)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = canvas.toDataURL();
    div.style.maskImage = `url(${dataUrl})`;
    div.style.webkitMaskImage = `url(${dataUrl})`;
    div.style.maskSize = "100% 100%";
    div.style.webkitMaskSize = "100% 100%";
  }, [cursorX, cursorY, size]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <div
        ref={divRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

export default function Home() {
  const [cursorPos, setCursorPos] = useState({ x: -SPOTLIGHT_R, y: -SPOTLIGHT_R });
  const mouseRef = useRef({ x: -SPOTLIGHT_R, y: -SPOTLIGHT_R });
  const smoothRef = useRef({ x: -SPOTLIGHT_R, y: -SPOTLIGHT_R });
  const rafRef = useRef<number | null>(null);

  // Initialize mouse in middle of screen on load
  useEffect(() => {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    mouseRef.current = { x: startX, y: startY };
    smoothRef.current = { x: startX, y: startY };
    setCursorPos({ x: startX, y: startY });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const updateSpotlight = () => {
      if (mouseRef.current.x !== -SPOTLIGHT_R) {
        if (smoothRef.current.x === -SPOTLIGHT_R) {
          smoothRef.current = { ...mouseRef.current };
        } else {
          smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
          smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;
        }
        setCursorPos({ x: smoothRef.current.x, y: smoothRef.current.y });
      }
      rafRef.current = requestAnimationFrame(updateSpotlight);
    };

    rafRef.current = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <main
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Left branding */}
        <div className="flex items-center gap-2">
          <svg
            className="w-[26px] h-[26px]"
            viewBox="0 0 256 256"
            fill="#ffffff"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white text-2xl font-playfair italic">Lithos</span>
        </div>

        {/* Center pill navigation */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <button className="text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            Course
          </button>
          <button className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
            Field Guides
          </button>
          <button className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
            Geology
          </button>
          <button className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
            Plans
          </button>
          <button className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
            Live Tour
          </button>
        </div>

        {/* Right desktop Sign Up / mobile Hamburger */}
        <div className="flex items-center">
          <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
            Sign Up
          </button>
          <button className="md:hidden text-white hover:opacity-80 transition-opacity">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: "100dvh" }}
      >
        {/* 1. Base Image */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* 2. Reveal layer */}
        <RevealLayer
          image={BG_IMAGE_2}
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
        />

        {/* 3. Heading */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95] flex flex-col items-center">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
            >
              Layers hold
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
            >
              tales of time
            </span>
          </h1>
        </div>

        {/* 4. Bottom-left paragraph */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>

        {/* 5. Bottom-right block */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: "0.85s" }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <button className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30">
            Start Digging
          </button>
        </div>
      </section>
    </main>
  );
}
