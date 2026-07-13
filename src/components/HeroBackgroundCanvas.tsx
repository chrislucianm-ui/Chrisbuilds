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
    scene.fog = new THREE.FogExp2(0x000000, 0.08);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1.0);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // Moving spotlight 1
    const spotLight1 = new THREE.PointLight(0xffffff, 4.0, 15);
    spotLight1.position.set(5, 5, 2);
    scene.add(spotLight1);

    // Moving spotlight 2 (low opacity fill)
    const spotLight2 = new THREE.PointLight(0xffffff, 2.0, 15);
    spotLight2.position.set(-5, -5, 2);
    scene.add(spotLight2);

    // 3. Floating Particles (Starfield style)
    const particleCount = isMobile ? 120 : 250;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spread particles across a box region
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.005 + Math.random() * 0.01;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Custom circle particle texture mapping
    const canvasParticle = document.createElement("canvas");
    canvasParticle.width = 16;
    canvasParticle.height = 16;
    const ctx = canvasParticle.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvasParticle);

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.35,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 4. Abstract Central Geometry (Luxurious slowly rotating torus knot sculpture catching shiny highlights)
    const torusGeom = new THREE.TorusKnotGeometry(2.2, 0.5, 120, 16, 3, 4);
    const torusMat = new THREE.MeshPhysicalMaterial({
      color: 0x888888,
      roughness: 0.08,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.28,
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    scene.add(torusMesh);

    // 5. Scroll Interaction Observer
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

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        // If reduced motion is requested, just render a single static frame and stop
        renderer.render(scene, camera);
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      // Only perform computations & render if the element is visible
      if (isVisible) {
        const time = clock.getElapsedTime();

        // Slow mesh rotations
        torusMesh.rotation.x = time * 0.03;
        torusMesh.rotation.y = time * 0.05;

        // Move light sources in a slow orbital wave
        spotLight1.position.x = Math.sin(time * 0.4) * 6;
        spotLight1.position.y = Math.cos(time * 0.3) * 4;

        spotLight2.position.x = -Math.sin(time * 0.3) * 6;
        spotLight2.position.y = -Math.cos(time * 0.4) * 4;

        // Slow floating particles movement (moving upwards slowly)
        const posArr = particleGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          posArr[i * 3 + 1] += speeds[i]; // Move y coordinate
          if (posArr[i * 3 + 1] > 4) {
            posArr[i * 3 + 1] = -4; // Reset to bottom
          }
        }
        particleGeom.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      }
    };

    animate();

    // 7. Resize handling
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

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();

      particleGeom.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      torusGeom.dispose();
      torusMat.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
