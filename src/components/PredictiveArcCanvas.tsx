"use client";

import React, { useEffect, useRef } from "react";

interface PredictiveArcCanvasProps {
  variant?: "signal-particles" | "predictive" | "amber-halftone" | string;
  mode?: "dark" | "light";
  speed?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PredictiveArcCanvas({
  variant = "signal-particles",
  mode = "dark",
  speed = 0.6,
  hue = 20,
  saturation = 1,
  brightness = 0.8,
  className = "",
  style,
}: PredictiveArcCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animFrameId: number | null = null;
    let isVisible = true;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches);

    const particleCount = isMobile ? 35 : 70;
    const maxConnectDistance = isMobile ? 100 : 135;

    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      pulseAngle: number;
    }

    let particles: Particle[] = [];

    interface SignalPulse {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
    }

    let pulses: SignalPulse[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx!.scale(dpr, dpr);
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8 * speed,
          vy: (Math.random() - 0.5) * 0.8 * speed,
          radius: Math.random() * 2 + 1.2,
          baseAlpha: Math.random() * 0.5 + 0.3,
          alpha: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    }

    resize();
    initParticles();

    let lastPulseTime = 0;

    function render(time: number) {
      if (!isVisible || !ctx) {
        animFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Periodically spawn ambient signal pulse rings
      if (time - lastPulseTime > 2800 && pulses.length < 3) {
        pulses.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 5,
          maxRadius: Math.min(width, height) * 0.35,
          alpha: 0.45,
          speed: 1.5 * speed,
        });
        lastPulseTime = time;
      }

      // Draw and update signal pulses
      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
        const pulse = pulses[pIdx];
        pulse.radius += pulse.speed;
        const progress = pulse.radius / pulse.maxRadius;
        pulse.alpha = (1 - progress) * 0.4;

        if (progress >= 1) {
          pulses.splice(pIdx, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 123, 26, ${pulse.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        p.pulseAngle += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.2;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction / gentle displacement
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140 && mdist > 0) {
            const force = (140 - mdist) / 140;
            p.x -= (mdx / mdist) * force * 1.5;
            p.y -= (mdy / mdist) * force * 1.5;
          }
        }
      }

      // Draw particle connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha =
              (1 - dist / maxConnectDistance) *
              0.35 *
              Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 138, 45, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Glow aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 123, 26, ${p.alpha * 0.25})`;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 110, ${Math.min(1, p.alpha + 0.2)})`;
        ctx.fill();
      }

      animFrameId = requestAnimationFrame(render);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animFrameId) {
          animFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    animFrameId = requestAnimationFrame(render);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [speed, hue, saturation, brightness]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
