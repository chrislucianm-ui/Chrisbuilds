"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  scrollProgress: number; // 0.0 to 1.0
  hoveredProjectIndex: number | null;
}

export default function HeroBackgroundCanvas({ scrollProgress, hoveredProjectIndex }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use refs to pass variables into the animation loop without triggering react re-renders
  const scrollRef = useRef(0);
  const hoveredIndexRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    hoveredIndexRef.current = hoveredProjectIndex;
  }, [hoveredProjectIndex]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 1.0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 2. Add Lighting (Volumetric direction lights for chrome/glass specs)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(10, 5, 10);
    scene.add(mainLight);

    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.6);
    secondaryLight.position.set(-10, -5, -5);
    scene.add(secondaryLight);

    // 3. Create a circular star texture dynamically
    const createStarTexture = () => {
      const size = 16;
      const starCanvas = document.createElement("canvas");
      starCanvas.width = size;
      starCanvas.height = size;
      const ctx = starCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.2, "rgba(255, 255, 255, 0.7)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(starCanvas);
    };

    const starTexture = createStarTexture();

    // 4. Starfield setup (1500 points)
    const starCount = isMobile ? 600 : 1500;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      // Spread stars far back
      starPositions[i * 3 + 2] = -Math.random() * 120;
      starSpeeds[i] = 0.05 + Math.random() * 0.15;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // 5. Realistic Digital Grid Earth Sphere
    // Draw Earth landmasses & grid onto canvas programmatically
    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthCtx = earthCanvas.getContext("2d");
    if (earthCtx) {
      earthCtx.fillStyle = "#000000";
      earthCtx.fillRect(0, 0, 1024, 512);

      // Draw stylized continents
      earthCtx.fillStyle = "#ffffff";
      const continentBlobs = [
        { x: 300, y: 200, r: 90 }, { x: 380, y: 220, r: 70 },
        { x: 650, y: 180, r: 85 }, { x: 740, y: 220, r: 75 }, { x: 600, y: 250, r: 60 },
        { x: 220, y: 350, r: 80 }, { x: 300, y: 320, r: 60 },
        { x: 800, y: 360, r: 70 }, { x: 850, y: 320, r: 50 },
        { x: 500, y: 120, r: 40 }, { x: 450, y: 80, r: 60 }
      ];
      continentBlobs.forEach(blob => {
        earthCtx.beginPath();
        earthCtx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        earthCtx.fill();
      });

      // Destination-in composition locks grid to landmass blobs only
      earthCtx.globalCompositeOperation = "destination-in";
      earthCtx.strokeStyle = "#ffffff";
      earthCtx.lineWidth = 1.5;
      for (let y = 0; y < 512; y += 10) {
        earthCtx.beginPath();
        earthCtx.moveTo(0, y);
        earthCtx.lineTo(1024, y);
        earthCtx.stroke();
      }
      for (let x = 0; x < 1024; x += 10) {
        earthCtx.beginPath();
        earthCtx.moveTo(x, 0);
        earthCtx.lineTo(x, 512);
        earthCtx.stroke();
      }
      earthCtx.globalCompositeOperation = "source-over";
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const earthGeom = new THREE.SphereGeometry(3.5, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.15,
      metalness: 0.95,
      bumpMap: earthTexture,
      bumpScale: 0.08,
      alphaMap: earthTexture,
      transparent: true,
      opacity: 0.95,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    earthMesh.position.set(0, 0, 0);
    scene.add(earthMesh);

    // Glowing Atmospheric Outer Shell
    const atmosGeom = new THREE.SphereGeometry(3.68, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0, 0, 1.0)), 2.8);
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity * 0.35;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    earthMesh.add(atmosMesh);

    // Volumetric Sunrise Glow behind Curvature
    const sunriseGlowCanvas = document.createElement("canvas");
    sunriseGlowCanvas.width = 128;
    sunriseGlowCanvas.height = 128;
    const sunriseCtx = sunriseGlowCanvas.getContext("2d");
    if (sunriseCtx) {
      const grad = sunriseCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.25)");
      grad.addColorStop(0.3, "rgba(255, 245, 230, 0.08)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      sunriseCtx.fillStyle = grad;
      sunriseCtx.fillRect(0, 0, 128, 128);
    }
    const sunriseTexture = new THREE.CanvasTexture(sunriseGlowCanvas);
    const sunriseGeom = new THREE.PlaneGeometry(16, 12);
    const sunriseMat = new THREE.MeshBasicMaterial({
      map: sunriseTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });
    const sunriseGlow = new THREE.Mesh(sunriseGeom, sunriseMat);
    sunriseGlow.position.set(2.8, -1.8, -1.0);
    scene.add(sunriseGlow);

    // 6. Scene 3 Floating Glass Geometries
    const glassGroup = new THREE.Group();
    scene.add(glassGroup);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.95,
      ior: 1.52,
      thickness: 1.5,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const serviceShapes = [
      new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), glassMat), // Websites
      new THREE.Mesh(new THREE.OctahedronGeometry(1.2), glassMat), // Web Apps
      new THREE.Mesh(new THREE.TorusKnotGeometry(0.7, 0.22, 100, 16), glassMat), // Mobile
      new THREE.Mesh(new THREE.IcosahedronGeometry(1.2), glassMat), // AI Solutions
      new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.8, 32), glassMat), // Automations
      new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.35, 16, 100), glassMat) // Branding
    ];

    // Position in a wide hexagonal arrangement in Z-depth
    serviceShapes.forEach((shape, i) => {
      const angle = (i / serviceShapes.length) * Math.PI * 2;
      shape.position.set(Math.cos(angle) * 7.5, Math.sin(angle) * 4.5, -30);
      shape.scale.set(0, 0, 0); // start hidden
      glassGroup.add(shape);
    });

    // 7. Scene 4 Concentric Chrome & Glass Rings
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 1.0,
      roughness: 0.06,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(6.0, 0.12, 16, 100), chromeMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.09, 16, 100), glassMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.06, 16, 100), chromeMat);

    ringsGroup.add(ring1, ring2, ring3);
    ringsGroup.position.set(0, 0, -32); // Positioned for fly-through

    // 8. Scene 6 Orbiting Holographic Project Cards
    const projectsGroup = new THREE.Group();
    scene.add(projectsGroup);

    const projectCardGeom = new THREE.PlaneGeometry(3.4, 2.2);
    // Dynamic canvas texture for holographic borders
    const createProjectCardTexture = (title: string, label: string) => {
      const cardCanvas = document.createElement("canvas");
      cardCanvas.width = 512;
      cardCanvas.height = 320;
      const ctx = cardCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        ctx.fillRect(0, 0, 512, 320);

        // Thin glow border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 496, 304);

        // Title text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px var(--font-geist-sans), sans-serif";
        ctx.letterSpacing = "0.08em";
        ctx.fillText(title.toUpperCase(), 35, 150);

        // Label details
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "14px var(--font-geist-mono), monospace";
        ctx.fillText(label.toUpperCase(), 35, 195);
      }
      return new THREE.CanvasTexture(cardCanvas);
    };

    const projectCards = [
      { mesh: new THREE.Mesh(projectCardGeom, new THREE.MeshPhysicalMaterial({ map: createProjectCardTexture("Noir.io", "Creative Scroll Studio"), transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.1, transmission: 0.4, side: THREE.DoubleSide })), angle: 0 },
      { mesh: new THREE.Mesh(projectCardGeom, new THREE.MeshPhysicalMaterial({ map: createProjectCardTexture("SpaceX Orbit", "Cinematic Traversal"), transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.1, transmission: 0.4, side: THREE.DoubleSide })), angle: Math.PI * 0.5 },
      { mesh: new THREE.Mesh(projectCardGeom, new THREE.MeshPhysicalMaterial({ map: createProjectCardTexture("Apple Bloom", "Luxury Product Film"), transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.1, transmission: 0.4, side: THREE.DoubleSide })), angle: Math.PI },
      { mesh: new THREE.Mesh(projectCardGeom, new THREE.MeshPhysicalMaterial({ map: createProjectCardTexture("Awwwards", "Digital Space Story"), transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.1, transmission: 0.4, side: THREE.DoubleSide })), angle: Math.PI * 1.5 }
    ];

    projectCards.forEach((card) => {
      card.mesh.position.set(Math.cos(card.angle) * 9, Math.sin(card.angle) * 3, -65);
      projectsGroup.add(card.mesh);
    });

    // 9. Interactive Mouse Parallax coordinates
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCamera.x = mouse.x * 0.5;
      targetCamera.y = mouse.y * 0.35;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 10. Animation Loop
    let animationFrameId: number;
    let lerpedScroll = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth scroll lerping for liquid-fluid transitions
      lerpedScroll += (scrollRef.current - lerpedScroll) * 0.05;

      // ----------------------------------------------------
      // WEBGL SCROLL TIMELINE PHYSICS
      // ----------------------------------------------------

      // Camera base zoom & float drift
      const baseZoom = 1.0 + Math.sin(time * 0.08) * 0.008;

      // Reset positions to handle parallax overlays cleanly
      earthMesh.position.set(0, 0, 0);
      glassGroup.position.set(0, 0, 0);
      ringsGroup.position.set(0, 0, 0);
      projectsGroup.position.set(0, 0, 0);

      // Section thresholds
      if (lerpedScroll < 0.15) {
        // Scene 1: Earth close up
        const t = lerpedScroll / 0.15;
        camera.position.set(targetCamera.x, targetCamera.y, 9.5 + t * 4.5);
        earthMesh.scale.set(baseZoom, baseZoom, baseZoom);
        earthMesh.position.x = -t * 1.5; // slow shift left
        sunriseGlow.position.x = 2.8 - t * 1.5;

        // Hide other items
        glassGroup.scale.set(0, 0, 0);
        ringsGroup.scale.set(0, 0, 0);
        projectsGroup.scale.set(0, 0, 0);

      } else if (lerpedScroll >= 0.15 && lerpedScroll < 0.30) {
        // Scene 2: Pulling away from Earth
        const t = (lerpedScroll - 0.15) / 0.15;
        camera.position.set(targetCamera.x, targetCamera.y, 14.0 + t * 14.0);
        earthMesh.position.x = -1.5 - t * 10; // Earth slides off-screen left
        sunriseGlow.position.x = 1.3 - t * 10;
        
        glassGroup.scale.set(0, 0, 0);
        ringsGroup.scale.set(0, 0, 0);
        projectsGroup.scale.set(0, 0, 0);

      } else if (lerpedScroll >= 0.30 && lerpedScroll < 0.45) {
        // Scene 3: Entering the Galaxy, floating Glass Services
        const t = (lerpedScroll - 0.30) / 0.15;
        camera.position.set(targetCamera.x, targetCamera.y, 28.0 - t * 4.0);
        earthMesh.position.x = -11.5 - t * 15; // completely hide Earth

        // Float and scale services glass objects
        glassGroup.scale.set(1, 1, 1);
        serviceShapes.forEach((shape, i) => {
          const baseScale = 1.0 + Math.sin(time + i) * 0.05;
          const s = t * baseScale;
          shape.scale.set(s, s, s);
          // spin
          shape.rotation.x = time * 0.1 + i;
          shape.rotation.y = time * 0.15 + i;
        });

        ringsGroup.scale.set(0, 0, 0);
        projectsGroup.scale.set(0, 0, 0);

      } else if (lerpedScroll >= 0.45 && lerpedScroll < 0.60) {
        // Scene 4: Flying through Chrome/Glass Rings
        const t = (lerpedScroll - 0.45) / 0.15;
        // Fade service glass shapes
        serviceShapes.forEach((shape) => {
          const s = (1.0 - t);
          shape.scale.set(s, s, s);
        });

        // Camera flies right through rings at Z=-32. Z moves 24 to -42.
        camera.position.set(targetCamera.x, targetCamera.y, 24.0 - t * 66.0);
        
        ringsGroup.scale.set(1, 1, 1);
        // Spin concentric rings
        ring1.rotation.y = time * 0.18;
        ring1.rotation.z = time * 0.08;
        ring2.rotation.y = -time * 0.12;
        ring2.rotation.z = -time * 0.14;
        ring3.rotation.y = time * 0.22;

        projectsGroup.scale.set(0, 0, 0);

      } else if (lerpedScroll >= 0.60 && lerpedScroll < 0.75) {
        // Scene 5: Speed-warp / philosophy
        const t = (lerpedScroll - 0.60) / 0.15;
        ringsGroup.scale.set(0, 0, 0);
        projectsGroup.scale.set(0, 0, 0);

        // Keep camera steady while star speed increases
        camera.position.set(targetCamera.x, targetCamera.y, -42.0 - t * 8.0);

      } else if (lerpedScroll >= 0.75 && lerpedScroll < 0.90) {
        // Scene 6: Featured Orbiting Projects
        const t = (lerpedScroll - 0.75) / 0.15;
        camera.position.set(targetCamera.x, targetCamera.y, -50.0 - t * 4.0);

        // Show orbiting project panels
        projectsGroup.scale.set(1, 1, 1);
        
        projectCards.forEach((card, idx) => {
          const orbitalRadius = 8.5;
          const speedFactor = time * 0.08;
          const currentAngle = card.angle + speedFactor;
          
          let cardX = Math.cos(currentAngle) * orbitalRadius;
          let cardY = Math.sin(currentAngle) * 2.8;
          let cardZ = -65 + Math.sin(currentAngle) * 4;

          const isHovered = hoveredIndexRef.current === idx;
          if (isHovered) {
            // Lerp selected project card to center-focus in front of camera
            card.mesh.position.x += (targetCamera.x - card.mesh.position.x) * 0.12;
            card.mesh.position.y += (targetCamera.y - card.mesh.position.y) * 0.12;
            card.mesh.position.z += (camera.position.z - 4.5 - card.mesh.position.z) * 0.12;
            
            // Align rotation directly to camera face
            card.mesh.rotation.set(0, 0, 0);
          } else {
            // Normal orbit movement
            card.mesh.position.set(cardX, cardY, cardZ);
            card.mesh.rotation.y = Math.sin(time * 0.15 + idx) * 0.08;
            card.mesh.rotation.x = Math.cos(time * 0.1 + idx) * 0.08;
          }
        });

      } else if (lerpedScroll >= 0.90) {
        // Scene 7: Contact orbit back
        const t = (lerpedScroll - 0.90) / 0.10;
        projectsGroup.scale.set(0, 0, 0);

        // Transition camera from project coordinate system back to Earth close orbit
        camera.position.set(
          targetCamera.x + (1.0 - t) * 0,
          targetCamera.y + (1.0 - t) * 0,
          -54.0 + t * 65.5 // Z moves from -54 to 11.5
        );

        // Scale and align Earth back
        earthMesh.position.set(1.5, -0.8, 0); // Position on the right side of Contact overlay
        earthMesh.scale.set(baseZoom, baseZoom, baseZoom);
        sunriseGlow.position.set(4.3, -2.6, -1.0);
      }

      // ----------------------------------------------------
      // STARFIELD TWINKLE & TRAVEL SPEED ANIMATION
      // ----------------------------------------------------
      const posArr = starGeom.attributes.position.array as Float32Array;
      const isWarpSpeed = lerpedScroll >= 0.60 && lerpedScroll < 0.75;
      const warpSpeedFactor = isWarpSpeed ? 12.0 : 1.0;

      for (let i = 0; i < starCount; i++) {
        // Stars translate towards camera along Z
        posArr[i * 3 + 2] += starSpeeds[i] * warpSpeedFactor;
        
        // Reset stars passing the viewport
        if (posArr[i * 3 + 2] > 15) {
          posArr[i * 3 + 2] = -120;
          posArr[i * 3] = (Math.random() - 0.5) * 120;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 80;
        }
      }
      starGeom.attributes.position.needsUpdate = true;

      // Soft twinkle glow modulation
      starMat.opacity = 0.5 + Math.sin(time * 0.5) * 0.25;

      // Gently rotate Earth
      earthMesh.rotation.y = time * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Responsive resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();

      starGeom.dispose();
      starMat.dispose();
      starTexture.dispose();
      earthGeom.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
      sunriseGeom.dispose();
      sunriseMat.dispose();
      sunriseTexture.dispose();
      glassMat.dispose();
      chromeMat.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      ring3.geometry.dispose();
      projectCardGeom.dispose();
      projectCards.forEach((c) => {
        c.mesh.material.dispose();
        if (c.mesh.material.map) c.mesh.material.map.dispose();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
