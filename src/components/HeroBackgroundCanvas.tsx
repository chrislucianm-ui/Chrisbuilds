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

    // 2. Load the exact attached image as a WebGL texture
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load("/hero-bg.jpg", (tex) => {
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      handleResize(); // Trigger cover calculations once texture dimensions are resolved
    });

    // Create a background plane mapping the image
    const bgGeom = new THREE.PlaneGeometry(36, 24);
    const bgMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeom, bgMat);
    bgMesh.position.set(0, 0, -18); // Put it deep behind all elements
    scene.add(bgMesh);

    // Initialize baseScale userData parameters
    bgMesh.userData = { baseScaleX: 1.0, baseScaleY: 1.0 };

    // 3. Helper to create circular star overlay textures
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

    const textureFar = createStarTexture(0.45);
    const textureMid = createStarTexture(0.65);
    const textureDust = createStarTexture(0.25);

    // Star Groups (for parallax depth overlaying the image)
    const farStarsGroup = new THREE.Group();
    const midStarsGroup = new THREE.Group();
    const dustGroup = new THREE.Group();

    scene.add(farStarsGroup);
    scene.add(midStarsGroup);
    scene.add(dustGroup);

    // Star Layer 1 (500 count overlaying background)
    const farCount = isMobile ? 150 : 500;
    const farGeom = new THREE.BufferGeometry();
    const farPositions = new Float32Array(farCount * 3);
    for (let i = 0; i < farCount; i++) {
      farPositions[i * 3] = (Math.random() - 0.5) * 60;
      farPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      farPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 12; // In front of backplane
    }
    farGeom.setAttribute("position", new THREE.BufferAttribute(farPositions, 3));
    const farMat = new THREE.PointsMaterial({
      size: 0.035,
      map: textureFar,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.15,
    });
    const farStars = new THREE.Points(farGeom, farMat);
    farStarsGroup.add(farStars);

    // Star Layer 2 (200 count)
    const midCount = isMobile ? 60 : 200;
    const midGeom = new THREE.BufferGeometry();
    const midPositions = new Float32Array(midCount * 3);
    for (let i = 0; i < midCount; i++) {
      midPositions[i * 3] = (Math.random() - 0.5) * 40;
      midPositions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      midPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    midGeom.setAttribute("position", new THREE.BufferAttribute(midPositions, 3));
    const midMat = new THREE.PointsMaterial({
      size: 0.055,
      map: textureMid,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.35,
    });
    const midStars = new THREE.Points(midGeom, midMat);
    midStarsGroup.add(midStars);

    // Cosmic Dust (50 count)
    const dustCount = isMobile ? 15 : 50;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeedsY = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 + 2;
      dustSpeedsY[i] = 0.0001 + Math.random() * 0.00025;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.15,
      map: textureDust,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.1,
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    dustGroup.add(dustParticles);

    // 4. Volumetric Center Glow Plane (Glow behind the headline)
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext("2d");
    if (glowCtx) {
      const grad = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.02)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.008)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      glowCtx.fillStyle = grad;
      glowCtx.fillRect(0, 0, 128, 128);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowGeom = new THREE.PlaneGeometry(32, 16);
    const glowPlaneMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.45,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowPlaneMat);
    glowMesh.position.set(0, 0, -10);
    scene.add(glowMesh);

    // 5. Dynamic Shooting Stars (Streaking across every 20-30s)
    const shootingStarGeom = new THREE.BufferGeometry();
    const streakPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-1.6, 1.0, 0)
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
    const streakDuration = 0.75;
    const streakSpeed = { x: -15, y: 9.3 };
    let streakStartPos = { x: 0, y: 0, z: -5 };

    const triggerShootingStar = () => {
      if (streakActive) return;
      streakActive = true;
      streakTime = 0;
      streakStartPos.x = Math.random() * 12 + 1;
      streakStartPos.y = Math.random() * 5 + 2;
      streakStartPos.z = Math.random() * -8 - 4;
      shootingStar.position.set(streakStartPos.x, streakStartPos.y, streakStartPos.z);
    };

    // Trigger every 25 seconds (Rare shooting stars)
    const shootingInterval = setInterval(() => {
      if (!prefersReducedMotion && !isMobile) {
        triggerShootingStar();
      }
    }, 25000);

    // 6. Mouse Parallax Coordinate Tracking
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCamera.x = mouse.x * 0.45; // Very subtle, premium drift
      targetCamera.y = mouse.y * 0.3;
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

        // 1. Slow Zoom (Scale 1.00 -> 1.02 over 40 seconds, looping smoothly)
        const zoomTime = 40;
        const loopCycle = time % (zoomTime * 2);
        let zoomVal = 1.0;
        if (loopCycle < zoomTime) {
          zoomVal = 1.0 + (loopCycle / zoomTime) * 0.02;
        } else {
          zoomVal = 1.02 - ((loopCycle - zoomTime) / zoomTime) * 0.02;
        }

        const baseSX = bgMesh.userData.baseScaleX || 1.0;
        const baseSY = bgMesh.userData.baseScaleY || 1.0;
        bgMesh.scale.set(baseSX * zoomVal, baseSY * zoomVal, 1.0);

        // 2. Gentle vertical drift
        bgMesh.position.y = Math.sin(time * 0.04) * 0.12;

        // 3. Stars Twinkling Opacity Modulation
        farMat.opacity = 0.1 + Math.sin(time * 0.4) * 0.05;
        midMat.opacity = 0.22 + Math.cos(time * 0.6) * 0.1;

        // 4. Parallax star layer rotations
        farStarsGroup.rotation.y = time * 0.0002;
        midStarsGroup.rotation.y = -time * 0.0001;

        // 5. Drift the cosmic dust points
        const posArr = dustGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3 + 1] += dustSpeedsY[i] * 0.12;
          posArr[i * 3] += Math.sin(time * 0.08 + i) * 0.0002;
          
          if (posArr[i * 3 + 1] > 10) {
            posArr[i * 3 + 1] = -10;
          }
        }
        dustGeom.attributes.position.needsUpdate = true;

        // 6. Update Shooting Star position
        if (streakActive) {
          streakTime += 0.016;
          if (streakTime >= streakDuration) {
            streakActive = false;
            shootingStarMat.opacity = 0;
          } else {
            shootingStar.position.x = streakStartPos.x + streakTime * streakSpeed.x;
            shootingStar.position.y = streakStartPos.y + streakTime * streakSpeed.y;
            
            if (streakTime < streakDuration * 0.2) {
              shootingStarMat.opacity = (streakTime / (streakDuration * 0.2)) * 0.4;
            } else {
              shootingStarMat.opacity = (1.0 - (streakTime - streakDuration * 0.2) / (streakDuration * 0.8)) * 0.4;
            }
          }
        }

        // 7. Smooth camera parallax interpolation (Lerping)
        camera.position.x += (targetCamera.x - camera.position.x) * 0.04;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
    };

    animate();

    // 9. Resize handling (Calculates cover aspect ratio matching background-size: cover)
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));

      // Calculate cover scale for bgMesh
      const vFOV = (camera.fov * Math.PI) / 180;
      const viewportHeight = 2 * Math.tan(vFOV / 2) * 30; // camera.z=12 to bgMesh.z=-18 is 30 distance
      const viewportWidth = viewportHeight * camera.aspect;

      const imageAspect = 1.5; // aspect ratio of 36x24 plane
      
      let scaleX = 1;
      let scaleY = 1;

      if (camera.aspect > imageAspect) {
        scaleX = viewportWidth / 36;
        scaleY = scaleX;
      } else {
        scaleY = viewportHeight / 24;
        scaleX = scaleY;
      }

      bgMesh.userData.baseScaleX = scaleX;
      bgMesh.userData.baseScaleY = scaleY;
    };
    window.addEventListener("resize", handleResize);

    // Call resize once immediately to initialize scale
    handleResize();

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
      dustGeom.dispose();
      dustMat.dispose();
      bgGeom.dispose();
      bgMat.dispose();
      bgTexture.dispose();
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
