"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroBackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = container.clientWidth;
    let height = container.clientHeight;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.04);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // Turn off anti-alias for stars to make them sharper and save performance
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 1.0);

    // 2. Ambient Lights (Extremely soft)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
    scene.add(ambientLight);

    // Faint point light at the center to create a subtle central glow behind the text
    const glowLight = new THREE.PointLight(0xffffff, 0.8, 20);
    glowLight.position.set(0, 0, 0);
    scene.add(glowLight);

    // 3. Helper to create high-resolution blurred point textures
    const createStarTexture = (opacity = 1.0) => {
      const size = 16;
      const starCanvas = document.createElement("canvas");
      starCanvas.width = size;
      starCanvas.height = size;
      const ctx = starCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        grad.addColorStop(0.2, `rgba(255, 255, 255, ${opacity * 0.7})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(starCanvas);
    };

    const textureFar = createStarTexture(0.7);
    const textureMid = createStarTexture(0.85);
    const textureNear = createStarTexture(0.95);
    const textureDust = createStarTexture(0.3);

    // Star Groups (to apply slow independent parallax rotations)
    const farStarsGroup = new THREE.Group();
    const midStarsGroup = new THREE.Group();
    const nearStarsGroup = new THREE.Group();
    const dustGroup = new THREE.Group();

    scene.add(farStarsGroup);
    scene.add(midStarsGroup);
    scene.add(nearStarsGroup);
    scene.add(dustGroup);

    // Layer 1: Thousands of Distant Tiny Stars (2500 stars)
    const farCount = isMobile ? 800 : 2500;
    const farGeom = new THREE.BufferGeometry();
    const farPositions = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      farPositions[i * 3] = (Math.random() - 0.5) * 60;
      farPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      farPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 25; // Far Z-plane
    }
    farGeom.setAttribute("position", new THREE.BufferAttribute(farPositions, 3));
    const farMat = new THREE.PointsMaterial({
      size: 0.035,
      map: textureFar,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.25,
    });
    const farStars = new THREE.Points(farGeom, farMat);
    farStarsGroup.add(farStars);

    // Layer 2: Mid-field Stars (1200 stars)
    const midCount = isMobile ? 400 : 1200;
    const midGeom = new THREE.BufferGeometry();
    const midPositions = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      midPositions[i * 3] = (Math.random() - 0.5) * 45;
      midPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      midPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5; // Mid Z-plane
    }
    midGeom.setAttribute("position", new THREE.BufferAttribute(midPositions, 3));
    const midMat = new THREE.PointsMaterial({
      size: 0.055,
      map: textureMid,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.45,
    });
    const midStars = new THREE.Points(midGeom, midMat);
    midStarsGroup.add(midStars);

    // Layer 3: Near Stars (400 stars)
    const nearCount = isMobile ? 120 : 400;
    const nearGeom = new THREE.BufferGeometry();
    const nearPositions = new Float32Array(nearCount * 3);
    for (let i = 0; i < nearCount; i++) {
      nearPositions[i * 3] = (Math.random() - 0.5) * 30;
      nearPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      nearPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 + 5; // Close Z-plane
    }
    nearGeom.setAttribute("position", new THREE.BufferAttribute(nearPositions, 3));
    const nearMat = new THREE.PointsMaterial({
      size: 0.075,
      map: textureNear,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.55,
    });
    const nearStars = new THREE.Points(nearGeom, nearMat);
    nearStarsGroup.add(nearStars);

    // Layer 4: Occasional Silver Cosmic Dust (80 particles drifting)
    const dustCount = isMobile ? 20 : 80;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeedsY = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 25;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 + 2;
      dustSpeedsY[i] = 0.0003 + Math.random() * 0.0006; // Ultra-slow drift
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.18,
      map: textureDust,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.15,
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    dustGroup.add(dustParticles);

    // 4. Soft Volumetric Far Glow Plane (Faint nebula-like ray band backplane)
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext("2d");
    if (glowCtx) {
      const grad = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.025)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.01)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      glowCtx.fillStyle = grad;
      glowCtx.fillRect(0, 0, 128, 128);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowGeom = new THREE.PlaneGeometry(40, 20);
    const glowPlaneMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowPlaneMat);
    glowMesh.position.set(0, 0, -15);
    scene.add(glowMesh);

    // 5. Mouse Parallax Coordinate Interpolation
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCamera.x = mouse.x * 0.9; // Minimal parallax drift to keep text locked
      targetCamera.y = mouse.y * 0.6;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 6. Scroll Intersection Observer
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      if (isVisible) {
        const time = clock.getElapsedTime();

        // 1. Natural subtle twinkling (sine modulation on star layer opacity)
        farMat.opacity = 0.12 + Math.sin(time * 0.3) * 0.08;
        midMat.opacity = 0.25 + Math.cos(time * 0.5) * 0.15;
        nearMat.opacity = 0.3 + Math.sin(time * 0.7) * 0.15;

        // 2. Slow rotational drift on star clusters to build parallax movement
        farStarsGroup.rotation.y = time * 0.0006;
        midStarsGroup.rotation.y = -time * 0.0004;
        nearStarsGroup.rotation.y = time * 0.0008;

        // 3. Drift the foreground silver dust upward
        const posArr = dustGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3 + 1] += dustSpeedsY[i] * 0.15; // Slow vertical drift
          posArr[i * 3] += Math.sin(time * 0.1 + i) * 0.0002; // Sway
          
          if (posArr[i * 3 + 1] > 9) {
            posArr[i * 3 + 1] = -9; // Recycle to bottom
          }
        }
        dustGeom.attributes.position.needsUpdate = true;

        // 4. Smooth camera parallax interpolation (Lerping)
        camera.position.x += (targetCamera.x - camera.position.x) * 0.04;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
    };

    animate();

    // 8. Resize handling
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    };
    window.addEventListener("resize", handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();

      farGeom.dispose();
      farMat.dispose();
      midGeom.dispose();
      midMat.dispose();
      nearGeom.dispose();
      nearMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      glowGeom.dispose();
      glowPlaneMat.dispose();
      glowTexture.dispose();
      textureFar.dispose();
      textureMid.dispose();
      textureNear.dispose();
      textureDust.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
