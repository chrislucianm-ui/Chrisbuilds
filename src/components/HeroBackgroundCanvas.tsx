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

    // 2. Helper to create circular star textures
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

    const createMilkyWayTexture = () => {
      const w = 512;
      const h = 256;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Soft gradient representing a distant galaxy band
        const grad = ctx.createLinearGradient(0, h, w, 0);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.015)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 0.07)");
        grad.addColorStop(0.6, "rgba(255, 255, 255, 0.015)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const textureFar = createStarTexture(0.65);
    const textureMid = createStarTexture(0.85);
    const textureDust = createStarTexture(0.3);

    // Star Groups (for slow independent rotations)
    const farStarsGroup = new THREE.Group();
    const midStarsGroup = new THREE.Group();
    const nearStarsGroup = new THREE.Group();
    const dustGroup = new THREE.Group();

    scene.add(farStarsGroup);
    scene.add(midStarsGroup);
    scene.add(nearStarsGroup);
    scene.add(dustGroup);

    // Layer 1: Thousands of Distant Tiny Stars (3200 count)
    const farCount = isMobile ? 1200 : 3200;
    const farGeom = new THREE.BufferGeometry();
    const farPositions = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      farPositions[i * 3] = (Math.random() - 0.5) * 85;
      farPositions[i * 3 + 1] = (Math.random() - 0.5) * 55;
      farPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 32; // Far Z-depth
    }
    farGeom.setAttribute("position", new THREE.BufferAttribute(farPositions, 3));
    const farMat = new THREE.PointsMaterial({
      size: 0.03,
      map: textureFar,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.22,
    });
    const farStars = new THREE.Points(farGeom, farMat);
    farStarsGroup.add(farStars);

    // Layer 2: Mid-field Stars (1400 count)
    const midCount = isMobile ? 500 : 1400;
    const midGeom = new THREE.BufferGeometry();
    const midPositions = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      midPositions[i * 3] = (Math.random() - 0.5) * 60;
      midPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      midPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
    }
    midGeom.setAttribute("position", new THREE.BufferAttribute(midPositions, 3));
    const midMat = new THREE.PointsMaterial({
      size: 0.05,
      map: textureMid,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.45,
    });
    const midStars = new THREE.Points(midGeom, midMat);
    midStarsGroup.add(midStars);

    // Layer 3: Near-field Stars (500 count)
    const nearCount = isMobile ? 150 : 500;
    const nearGeom = new THREE.BufferGeometry();
    const nearPositions = new Float32Array(nearCount * 3);
    for (let i = 0; i < nearCount; i++) {
      nearPositions[i * 3] = (Math.random() - 0.5) * 35;
      nearPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      nearPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 + 4;
    }
    nearGeom.setAttribute("position", new THREE.BufferAttribute(nearPositions, 3));
    const nearMat = new THREE.PointsMaterial({
      size: 0.07,
      map: textureMid,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.55,
    });
    const nearStars = new THREE.Points(nearGeom, nearMat);
    nearStarsGroup.add(nearStars);

    // Layer 4: Soft Cosmic Dust (90 count)
    const dustCount = isMobile ? 25 : 90;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeedsY = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 25;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      dustSpeedsY[i] = 0.00015 + Math.random() * 0.00035; // Very slow upward drift
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

    // 3. Faint Milky Way Diagonal Band (Background Plane)
    const mwGeom = new THREE.PlaneGeometry(45, 20);
    const mwMat = new THREE.MeshBasicMaterial({
      map: createMilkyWayTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.55,
    });
    const mwMesh = new THREE.Mesh(mwGeom, mwMat);
    mwMesh.position.set(-1, 1, -16);
    mwMesh.rotation.z = -0.32; // Diagonal cross behind the typography
    scene.add(mwMesh);

    // 4. Volumetric Center Glow Plane (Glow behind the headline)
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
    const glowGeom = new THREE.PlaneGeometry(35, 18);
    const glowPlaneMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.45,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowPlaneMat);
    glowMesh.position.set(0, 0, -12);
    scene.add(glowMesh);

    // 5. Dynamic Shooting Stars (Cinematic streaks triggered randomly)
    const shootingStarGeom = new THREE.BufferGeometry();
    const streakPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-1.8, 1.2, 0) // Streak direction (top-right to bottom-left)
    ];
    shootingStarGeom.setFromPoints(streakPoints);
    const shootingStarMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      linewidth: 1,
    });
    const shootingStar = new THREE.Line(shootingStarGeom, shootingStarMat);
    scene.add(shootingStar);

    let streakActive = false;
    let streakTime = 0;
    const streakDuration = 0.8; // Duration of the streak in seconds
    const streakSpeed = { x: -16, y: 11 }; // Speed of movement across the viewport
    let streakStartPos = { x: 0, y: 0, z: -5 };

    const triggerShootingStar = () => {
      if (streakActive) return;
      streakActive = true;
      streakTime = 0;
      // Spawn at random top-right coordinates
      streakStartPos.x = Math.random() * 12 + 2;
      streakStartPos.y = Math.random() * 6 + 2;
      streakStartPos.z = Math.random() * -10 - 5;
      shootingStar.position.set(streakStartPos.x, streakStartPos.y, streakStartPos.z);
    };

    // Trigger a shooting star every 8 to 14 seconds
    const shootingInterval = setInterval(() => {
      if (!prefersReducedMotion && !isMobile) {
        triggerShootingStar();
      }
    }, 11000);

    // 6. Mouse Parallax Coordinate Tracking
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCamera.x = mouse.x * 0.75; // Subtle camera drift
      targetCamera.y = mouse.y * 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 7. Scroll Intersection Observer
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

    // 8. Animation Loop
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
        const delta = clock.getDelta();

        // 1. Natural slow twinkling modulation
        farMat.opacity = 0.16 + Math.sin(time * 0.35) * 0.08;
        midMat.opacity = 0.28 + Math.cos(time * 0.5) * 0.16;
        nearMat.opacity = 0.32 + Math.sin(time * 0.7) * 0.18;

        // 2. Slow rotational drift on star groups (creates depth and parallax)
        farStarsGroup.rotation.y = time * 0.0004;
        midStarsGroup.rotation.y = -time * 0.0003;
        nearStarsGroup.rotation.y = time * 0.0006;

        // 3. Drift the cosmic dust points upward
        const posArr = dustGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3 + 1] += dustSpeedsY[i] * 0.15;
          posArr[i * 3] += Math.sin(time * 0.1 + i) * 0.00025;
          
          if (posArr[i * 3 + 1] > 10) {
            posArr[i * 3 + 1] = -10; // Recycle back to bottom
          }
        }
        dustGeom.attributes.position.needsUpdate = true;

        // 4. Update Shooting Star position and opacity
        if (streakActive) {
          streakTime += 0.016; // increment approximate frame time
          if (streakTime >= streakDuration) {
            streakActive = false;
            shootingStarMat.opacity = 0;
          } else {
            // Move along trajectory path
            shootingStar.position.x = streakStartPos.x + streakTime * streakSpeed.x;
            shootingStar.position.y = streakStartPos.y + streakTime * streakSpeed.y;
            
            // Fading envelope: quick fade-in, long fade-out
            if (streakTime < streakDuration * 0.2) {
              shootingStarMat.opacity = (streakTime / (streakDuration * 0.2)) * 0.45;
            } else {
              shootingStarMat.opacity = (1.0 - (streakTime - streakDuration * 0.2) / (streakDuration * 0.8)) * 0.45;
            }
          }
        }

        // 5. Smooth camera parallax interpolation (Lerping)
        camera.position.x += (targetCamera.x - camera.position.x) * 0.04;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
    };

    animate();

    // 9. Resize handling
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

    // 10. Cleanup
    return () => {
      clearInterval(shootingInterval);
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
      shootingStarGeom.dispose();
      shootingStarMat.dispose();
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
