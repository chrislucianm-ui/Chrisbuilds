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
    scene.fog = new THREE.FogExp2(0x000000, 0.045);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 1.0);

    // 2. Ambient and Directional Lights (Backlit configuration for the sunrise effect)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
    scene.add(ambientLight);

    // Bright directional light emerging from the horizon behind the planet
    const sunLight = new THREE.DirectionalLight(0xffffff, 5.0);
    sunLight.position.set(1.5, -2.0, -2.5); // Backlit positioning
    scene.add(sunLight);

    // Very soft secondary fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.15);
    fillLight.position.set(-6, 3, 2);
    scene.add(fillLight);

    // 3. Helper Textures (Procedural canvas-based for absolute compatibility)
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

    const createPlanetTexture = () => {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, size, size);
        // Draw subtle fine surface texture/noise
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = Math.random() * 35 + 5;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.008)");
          grad.addColorStop(0.5, "rgba(0, 0, 0, 0.015)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    const createSunriseGlowTexture = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.08, "rgba(255, 255, 255, 0.85)");
        grad.addColorStop(0.2, "rgba(255, 255, 255, 0.25)");
        grad.addColorStop(0.45, "rgba(240, 240, 240, 0.05)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const createFlareRayTexture = () => {
      const w = 512;
      const h = 64;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.12)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 0.7)");
        grad.addColorStop(0.6, "rgba(255, 255, 255, 0.12)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const createMilkyWayTexture = () => {
      const w = 512;
      const h = 256;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Soft cloud gradient diagonal path
        const grad = ctx.createLinearGradient(0, h, w, 0);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.35, "rgba(255,255,255,0.015)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.08)");
        grad.addColorStop(0.65, "rgba(255,255,255,0.015)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const textureFar = createStarTexture(0.7);
    const textureMid = createStarTexture(0.85);
    const textureDust = createStarTexture(0.35);

    // Star Groups (for parallax rotation)
    const farStarsGroup = new THREE.Group();
    const midStarsGroup = new THREE.Group();
    const dustGroup = new THREE.Group();

    scene.add(farStarsGroup);
    scene.add(midStarsGroup);
    scene.add(dustGroup);

    // Layer 1: Thousands of Distant Tiny Stars (3000 count)
    const farCount = isMobile ? 1000 : 3000;
    const farGeom = new THREE.BufferGeometry();
    const farPositions = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      farPositions[i * 3] = (Math.random() - 0.5) * 80;
      farPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      farPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 30; // Far Z-plane
    }
    farGeom.setAttribute("position", new THREE.BufferAttribute(farPositions, 3));
    const farMat = new THREE.PointsMaterial({
      size: 0.032,
      map: textureFar,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.22,
    });
    const farStars = new THREE.Points(farGeom, farMat);
    farStarsGroup.add(farStars);

    // Layer 2: Mid-field Stars (1200 count)
    const midCount = isMobile ? 400 : 1200;
    const midGeom = new THREE.BufferGeometry();
    const midPositions = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      midPositions[i * 3] = (Math.random() - 0.5) * 55;
      midPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      midPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
    }
    midGeom.setAttribute("position", new THREE.BufferAttribute(midPositions, 3));
    const midMat = new THREE.PointsMaterial({
      size: 0.052,
      map: textureFar,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.42,
    });
    const midStars = new THREE.Points(midGeom, midMat);
    midStarsGroup.add(midStars);

    // Layer 3: Occasional Silver Cosmic Dust (60 count)
    const dustCount = isMobile ? 15 : 60;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeedsY = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 + 2;
      dustSpeedsY[i] = 0.0002 + Math.random() * 0.0004;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.16,
      map: textureDust,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.12,
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    dustGroup.add(dustParticles);

    // 4. Milky Way Diagonal Band (Background Plane)
    const mwGeom = new THREE.PlaneGeometry(45, 20);
    const mwMat = new THREE.MeshBasicMaterial({
      map: createMilkyWayTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.65,
    });
    const mwMesh = new THREE.Mesh(mwGeom, mwMat);
    mwMesh.position.set(-2, 2, -18);
    mwMesh.rotation.z = -0.36; // Diagonal cross behind headline
    scene.add(mwMesh);

    // 5. Massive Dark Planet (Bottom Right)
    const planetRadius = isMobile ? 6.5 : 8.5;
    const planetGeom = new THREE.SphereGeometry(planetRadius, 64, 64);
    const planetMat = new THREE.MeshPhysicalMaterial({
      color: 0x070707,
      roughness: 0.95,
      metalness: 0.02,
      sheen: 1.0, // Atmospheric edge highlights
      sheenColor: 0xbbbbbb,
      sheenRoughness: 0.35,
      map: createPlanetTexture(),
    });
    const planet = new THREE.Mesh(planetGeom, planetMat);
    // Positioned tilted at bottom right
    const planetX = isMobile ? 4.5 : 6.8;
    const planetY = isMobile ? -6.8 : -8.5;
    const planetZ = isMobile ? 3.0 : 4.0;
    planet.position.set(planetX, planetY, planetZ);
    scene.add(planet);

    // 6. Silver Sunrise Glow (Lens Flare Plane right on the planet horizon edge)
    const sunriseGlowGeom = new THREE.PlaneGeometry(7.5, 7.5);
    const sunriseGlowMat = new THREE.MeshBasicMaterial({
      map: createSunriseGlowTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    });
    const sunriseGlow = new THREE.Mesh(sunriseGlowGeom, sunriseGlowMat);
    // Placed exactly on the upper-left horizon curve of the planet
    const sunriseX = isMobile ? 1.0 : 1.6;
    const sunriseY = isMobile ? -1.3 : -1.7;
    const sunriseZ = isMobile ? 2.5 : 3.2;
    sunriseGlow.position.set(sunriseX, sunriseY, sunriseZ);
    scene.add(sunriseGlow);

    // Volumetric Horizon Flare Ray
    const rayGeom = new THREE.PlaneGeometry(18, 2.2);
    const rayMat = new THREE.MeshBasicMaterial({
      map: createFlareRayTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });
    const rayMesh = new THREE.Mesh(rayGeom, rayMat);
    rayMesh.position.set(sunriseX, sunriseY, sunriseZ + 0.1);
    rayMesh.rotation.z = -0.42; // Tilted parallel to planet curvature
    scene.add(rayMesh);

    // 7. Faint Crescent Moon (Left Side)
    const moonGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const moonMat = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      roughness: 0.95,
      metalness: 0.01,
      sheen: 0.8,
      sheenColor: 0x999999,
      sheenRoughness: 0.4,
    });
    const moon = new THREE.Mesh(moonGeom, moonMat);
    moon.position.set(-8, -0.6, -2);
    scene.add(moon);

    // 8. Mouse Parallax Coordinate Interpolation
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCamera.x = mouse.x * 0.45; // Very subtle, premium drift
      targetCamera.y = mouse.y * 0.3;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 9. Scroll Intersection Observer
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

    // 10. Animation Loop
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

        // Stars Twinkling Opacity Modulation
        farMat.opacity = 0.15 + Math.sin(time * 0.35) * 0.07;
        midMat.opacity = 0.28 + Math.cos(time * 0.55) * 0.14;

        // Slow parallax orbital rotation drift
        farStarsGroup.rotation.y = time * 0.0003;
        midStarsGroup.rotation.y = -time * 0.0002;

        // Drift the cosmic dust
        const posArr = dustGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3 + 1] += dustSpeedsY[i] * 0.15;
          posArr[i * 3] += Math.sin(time * 0.08 + i) * 0.0002;
          
          if (posArr[i * 3 + 1] > 10) {
            posArr[i * 3 + 1] = -10;
          }
        }
        dustGeom.attributes.position.needsUpdate = true;

        // Very slow planet and moon self-rotation
        planet.rotation.y = time * 0.001;
        moon.rotation.y = time * 0.002;

        // Soft shimmer on the sunrise rays
        rayMat.opacity = 0.5 + Math.sin(time * 0.8) * 0.1;

        // Camera Parallax Lerping
        camera.position.x += (targetCamera.x - camera.position.x) * 0.04;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
    };

    animate();

    // 11. Resize handling
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

    // 12. Cleanup
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
      dustGeom.dispose();
      dustMat.dispose();
      mwGeom.dispose();
      mwMat.dispose();
      planetGeom.dispose();
      planetMat.dispose();
      sunriseGlowGeom.dispose();
      sunriseGlowMat.dispose();
      rayGeom.dispose();
      rayMat.dispose();
      moonGeom.dispose();
      moonMat.dispose();
      textureFar.dispose();
      textureMid.dispose();
      textureDust.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
