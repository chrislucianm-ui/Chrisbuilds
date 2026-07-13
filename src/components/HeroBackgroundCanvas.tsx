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
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1.0);

    // 2. Lights (Subtle highlights for chrome fragments and silver rings)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    // Soft white light sources catching specular highlights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    // 3. Multi-Layered Space Stars & Dust
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);

    // Helper to generate circular blurred point texture
    const createCircleTexture = (opacity = 1.0) => {
      const size = 16;
      const pointCanvas = document.createElement("canvas");
      pointCanvas.width = size;
      pointCanvas.height = size;
      const ctx = pointCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        grad.addColorStop(0.3, `rgba(255, 255, 255, ${opacity * 0.8})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(pointCanvas);
    };

    const textureTiny = createCircleTexture(0.85);
    const textureMedium = createCircleTexture(0.95);
    const textureDust = createCircleTexture(0.4);

    // Star Layer 1: Tiny Distant Stars (1000 count)
    const tinyStarsCount = isMobile ? 400 : 1000;
    const tinyStarsGeom = new THREE.BufferGeometry();
    const tinyPositions = new Float32Array(tinyStarsCount * 3);
    for (let i = 0; i < tinyStarsCount; i++) {
      tinyPositions[i * 3] = (Math.random() - 0.5) * 45;
      tinyPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      tinyPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 15; // Deeper distance
    }
    tinyStarsGeom.setAttribute("position", new THREE.BufferAttribute(tinyPositions, 3));
    const tinyStarsMat = new THREE.PointsMaterial({
      size: 0.05,
      map: textureTiny,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.35,
    });
    const tinyStars = new THREE.Points(tinyStarsGeom, tinyStarsMat);
    starsGroup.add(tinyStars);

    // Star Layer 2: Mid-field Twinkling Stars (300 count)
    const midStarsCount = isMobile ? 100 : 300;
    const midStarsGeom = new THREE.BufferGeometry();
    const midPositions = new Float32Array(midStarsCount * 3);
    for (let i = 0; i < midStarsCount; i++) {
      midPositions[i * 3] = (Math.random() - 0.5) * 30;
      midPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      midPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    midStarsGeom.setAttribute("position", new THREE.BufferAttribute(midPositions, 3));
    const midStarsMat = new THREE.PointsMaterial({
      size: 0.1,
      map: textureMedium,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });
    const midStars = new THREE.Points(midStarsGeom, midStarsMat);
    starsGroup.add(midStars);

    // Star Layer 3: Soft Reflective Cosmic Dust (120 count)
    const dustCount = isMobile ? 30 : 120;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeedsY = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      dustSpeedsY[i] = 0.0005 + Math.random() * 0.001; // Extremely slow drift
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.25,
      map: textureDust,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.2,
    });
    const dustParticles = new THREE.Points(dustGeom, dustMat);
    starsGroup.add(dustParticles);

    // 4. Milky Way Faint Ambient Band
    const mwCanvas = document.createElement("canvas");
    mwCanvas.width = 128;
    mwCanvas.height = 128;
    const mwCtx = mwCanvas.getContext("2d");
    if (mwCtx) {
      const grad = mwCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.025)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.015)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      mwCtx.fillStyle = grad;
      mwCtx.fillRect(0, 0, 128, 128);
    }
    const mwTexture = new THREE.CanvasTexture(mwCanvas);
    const mwGeom = new THREE.PlaneGeometry(35, 15);
    const mwMat = new THREE.MeshBasicMaterial({
      map: mwTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
    });
    const mwMesh = new THREE.Mesh(mwGeom, mwMat);
    mwMesh.position.set(2, 1, -12); // Deep far background
    mwMesh.rotation.z = -0.3; // Tilted space angle
    scene.add(mwMesh);

    // 5. Luxury Elements: Thin Silver Orbital Rings (2 rings)
    const ring1Geom = new THREE.RingGeometry(4.5, 4.505, 120);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.LineLoop(ring1Geom, ringMat);
    ring1.rotation.set(1.1, 0.4, 0);
    scene.add(ring1);

    const ring2Geom = new THREE.RingGeometry(6.0, 6.006, 120);
    const ring2 = new THREE.LineLoop(ring2Geom, ringMat);
    ring2.rotation.set(-0.8, -0.6, 0.3);
    scene.add(ring2);

    // 6. Luxury Elements: Floating Chrome Octahedron Fragments (3 fragments)
    const fragments: THREE.Mesh[] = [];
    const fragmentGeom = new THREE.OctahedronGeometry(0.2, 0);
    const fragmentMat = new THREE.MeshPhysicalMaterial({
      color: 0x888888,
      metalness: 1.0,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.45,
    });

    if (!isMobile) {
      // Spawn floating octahedrons at spaced coordinate slots
      const coordinates = [
        { x: -3.5, y: 1.8, z: 2 },
        { x: 3.8, y: -2.0, z: 1 },
        { x: -1.8, y: -3.2, z: 3 }
      ];
      coordinates.forEach((coords) => {
        const mesh = new THREE.Mesh(fragmentGeom, fragmentMat);
        mesh.position.set(coords.x, coords.y, coords.z);
        // Random rotational offsets
        mesh.rotation.set(Math.random(), Math.random(), Math.random());
        scene.add(mesh);
        fragments.push(mesh);
      });
    }

    // 7. Mouse Parallax Coordinates Tracking
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions to [-1, 1]
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCamera.x = mouse.x * 1.2; // Soft parallax amount
      targetCamera.y = mouse.y * 0.8;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 8. Scroll Visibility Observer
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

    // 9. Animation Loop
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

        // Very slow star twinkling (sine opacity modulation)
        tinyStarsMat.opacity = 0.2 + Math.sin(time * 0.5) * 0.15;
        midStarsMat.opacity = 0.35 + Math.cos(time * 0.8) * 0.25;

        // Very slow stellar dust flow
        const posArr = dustGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          posArr[i * 3 + 1] += dustSpeedsY[i] * 0.2; // Slowly float upward
          // Slow sway
          posArr[i * 3] += Math.sin(time * 0.2 + i) * 0.0003;
          
          if (posArr[i * 3 + 1] > 8) {
            posArr[i * 3 + 1] = -8; // Recycle to bottom
          }
        }
        dustGeom.attributes.position.needsUpdate = true;

        // Rotate orbits extremely slowly
        ring1.rotation.z = time * 0.003;
        ring2.rotation.z = -time * 0.002;

        // Rotate & slowly float chrome fragments
        fragments.forEach((fragment, idx) => {
          fragment.rotation.x += 0.003;
          fragment.rotation.y += 0.002;
          fragment.position.y += Math.sin(time * 0.4 + idx) * 0.0008;
        });

        // Smooth camera parallax interpolation (Lerping)
        camera.position.x += (targetCamera.x - camera.position.x) * 0.04;
        camera.position.y += (targetCamera.y - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
    };

    animate();

    // 10. Resize handling
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();

      tinyStarsGeom.dispose();
      tinyStarsMat.dispose();
      midStarsGeom.dispose();
      midStarsMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      mwGeom.dispose();
      mwMat.dispose();
      mwTexture.dispose();
      ring1Geom.dispose();
      ring2Geom.dispose();
      ringMat.dispose();
      fragmentGeom.dispose();
      fragmentMat.dispose();
      textureTiny.dispose();
      textureMedium.dispose();
      textureDust.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
