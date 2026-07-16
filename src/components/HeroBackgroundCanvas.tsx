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

    // 1. Scene & Setup (Fog removed completely to keep visuals crisp and sharp)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile, // Disable antialiasing on mobile for massive rendering speedup
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 1.0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 2. Add Lighting (Volumetric direction lights for chrome/glass specs)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(12, 8, 12);
    scene.add(mainLight);

    // Skip adding secondary light on mobile to simplify shader computations
    const secondaryLight = new THREE.DirectionalLight(0xffffff, 1.2);
    secondaryLight.position.set(-12, -8, -6);
    if (!isMobile) {
      scene.add(secondaryLight);
    }

    // 3. Crisp 4K Space Backdrop Plane (Milky Way & Space Horizon)
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load(isMobile ? "/hero-bg-mobile.png" : "/hero-bg-desktop.png", (tex) => {
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
    });

    const bgGeom = new THREE.PlaneGeometry(320, 200);
    const bgMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      depthWrite: false,
      transparent: false,
    });
    const bgMesh = new THREE.Mesh(bgGeom, bgMat);
    bgMesh.position.set(0, 0, -140);
    scene.add(bgMesh);

    // 4. Create a circular star texture dynamically
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

    // 5. Starfield setup (Sharp, High-Contrast; Reduced count on mobile)
    const starCount = isMobile ? 600 : 1800;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
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
      opacity: 0.95,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // 6. Foreground Particles (Reduced count on mobile)
    const particleCount = isMobile ? 60 : 220;
    const particlesGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.015;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    particlesGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.07,
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlesMesh = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particlesMesh);

    // 7. Shooting Stars (Dynamic light streaks)
    const shootingStarCount = isMobile ? 1 : 3;
    const shootingStars: {
      mesh: THREE.Line;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
    }[] = [];

    for (let i = 0; i < shootingStarCount; i++) {
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-1.8, -1.2, 0.6)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);

      shootingStars.push({
        mesh: line,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 0
      });
    }

    const triggerShootingStar = (star: typeof shootingStars[0]) => {
      star.mesh.position.set(
        (Math.random() - 0.3) * 45,
        15 + Math.random() * 5,
        -Math.random() * 80 - 20
      );
      star.vx = -0.45 - Math.random() * 0.45;
      star.vy = -0.32 - Math.random() * 0.32;
      star.vz = 0.12 + Math.random() * 0.12;
      star.life = 0;
      star.maxLife = 35 + Math.floor(Math.random() * 45);
      (star.mesh.material as THREE.LineBasicMaterial).opacity = 0.95;
    };

    // 8. Realistic Digital Grid Earth Sphere (High Contrast)
    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthCtx = earthCanvas.getContext("2d");
    if (earthCtx) {
      earthCtx.fillStyle = "#000000";
      earthCtx.fillRect(0, 0, 1024, 512);

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
      roughness: 0.12,
      metalness: 0.95,
      bumpMap: earthTexture,
      bumpScale: 0.08,
      alphaMap: earthTexture,
      transparent: true,
      opacity: 0.95,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    scene.add(earthMesh);

    // Glowing Atmospheric Outer Shell (Sharp intensity gradient)
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
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    earthMesh.add(atmosMesh);

    // Volumetric Sunrise Glow behind Curvature (Pure white gold accent)
    const sunriseGlowCanvas = document.createElement("canvas");
    sunriseGlowCanvas.width = 128;
    sunriseGlowCanvas.height = 128;
    const sunriseCtx = sunriseGlowCanvas.getContext("2d");
    if (sunriseCtx) {
      const grad = sunriseCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      grad.addColorStop(0.3, "rgba(255, 245, 230, 0.12)");
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
      opacity: 0.75,
    });
    const sunriseGlow = new THREE.Mesh(sunriseGeom, sunriseMat);
    scene.add(sunriseGlow);

    // 9. Scene 3 Floating Glass Geometries (High Clarity polish)
    const glassGroup = new THREE.Group();
    scene.add(glassGroup);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.0,
      metalness: 0.1,
      transmission: 0.98,
      ior: 1.62,
      thickness: 1.8,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const serviceShapes = [
      new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), glassMat),
      new THREE.Mesh(new THREE.OctahedronGeometry(1.2), glassMat),
      new THREE.Mesh(new THREE.TorusKnotGeometry(0.7, 0.22, 100, 16), glassMat),
      new THREE.Mesh(new THREE.IcosahedronGeometry(1.2), glassMat),
      new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.8, 32), glassMat),
      new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.35, 16, 100), glassMat)
    ];

    serviceShapes.forEach((shape, i) => {
      const angle = (i / serviceShapes.length) * Math.PI * 2;
      shape.position.set(Math.cos(angle) * 7.5, Math.sin(angle) * 4.5, -30);
      glassGroup.add(shape);
    });

    // 10. Scene 4 Concentric Chrome & Glass Rings (Polished mirror finish)
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.01,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(6.0, 0.12, 16, 100), chromeMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.09, 16, 100), glassMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.06, 16, 100), chromeMat);

    ringsGroup.add(ring1, ring2, ring3);
    ringsGroup.position.set(0, 0, -32);

    // 11. Scene 5 Orbiting Holographic Project Cards
    const projectsGroup = new THREE.Group();
    scene.add(projectsGroup);

    const projectCardGeom = new THREE.PlaneGeometry(3.4, 2.2);
    const createProjectCardTexture = (title: string, label: string) => {
      const cardCanvas = document.createElement("canvas");
      cardCanvas.width = 512;
      cardCanvas.height = 320;
      const ctx = cardCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
        ctx.fillRect(0, 0, 512, 320);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 496, 304);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px var(--font-geist-sans), sans-serif";
        ctx.letterSpacing = "0.08em";
        ctx.fillText(title.toUpperCase(), 35, 150);

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

    // 12. Spline Paths for Cinematic Continuity (6 control points for 6 scenes)
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),      // Scene 1: Arrival (t = 0.0)
      new THREE.Vector3(0, 2.0, 18),    // Scene 2: Philosophy (t = 0.22)
      new THREE.Vector3(-3.0, 0, 28),   // Scene 3: Services (t = 0.37)
      new THREE.Vector3(0, 0, 24),      // Scene 4: Craft approach (t = 0.48)
      new THREE.Vector3(0, 0, -25),     // Scene 4: Craft exit (t = 0.58)
      new THREE.Vector3(0, 0, -50),     // Scene 5: Featured Projects (t = 0.70)
      new THREE.Vector3(2.2, -0.6, 11)  // Scene 6: Contact Earth (t = 0.95)
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),       // Scene 1
      new THREE.Vector3(-3.5, 0.5, 0),  // Scene 2
      new THREE.Vector3(0, 0, -30),     // Scene 3
      new THREE.Vector3(0, 0, -32),     // Scene 4
      new THREE.Vector3(0, 0, -32),     // Scene 4
      new THREE.Vector3(0, 0, -65),     // Scene 5
      new THREE.Vector3(1.5, -0.6, 0)   // Scene 6
    ]);

    // 13. Interactive Mouse Parallax coordinates
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return; // Skip mouse coordinates on mobile
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCamera.x = mouse.x * 0.55;
      targetCamera.y = mouse.y * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 14. Animation Loop
    let animationFrameId: number;
    let lerpedScroll = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth scroll lerping for liquid-fluid transitions
      lerpedScroll += (scrollRef.current - lerpedScroll) * 0.05;

      const tVal = Math.max(0.0, Math.min(1.0, lerpedScroll));

      // Query spline paths for continuous position and target coordinates
      const camPos = cameraPath.getPointAt(tVal);
      const lookTarget = targetPath.getPointAt(tVal);

      camera.position.copy(camPos);
      
      // Inject micro mouse-relative drift coordinates (desktop only)
      if (!isMobile) {
        camera.position.x += targetCamera.x;
        camera.position.y += targetCamera.y;
      }
      
      camera.lookAt(lookTarget);

      // Parallax-offset the huge background backdrop mesh to keep it centered and realistic
      bgMesh.position.x = camera.position.x * 0.95;
      bgMesh.position.y = camera.position.y * 0.95;

      const baseZoom = 1.0 + Math.sin(time * 0.08) * 0.008;

      // ----------------------------------------------------
      // WEBGL MESH ACTIVATION BELL CURVES
      // ----------------------------------------------------

      // 1. Earth mesh active profile (Hero: < 0.15, Contact: > 0.80)
      let earthActive = 0;
      if (tVal < 0.15) {
        earthActive = Math.cos((tVal / 0.15) * Math.PI * 0.5);
        const slideT = tVal / 0.15;
        earthMesh.position.set(-slideT * 3.5, 0, 0);
        sunriseGlow.position.set(2.8 - slideT * 3.5, -1.8, -1.0);
      } else if (tVal > 0.80) {
        earthActive = Math.sin(((tVal - 0.80) / 0.20) * Math.PI * 0.5);
        const slideT = (tVal - 0.80) / 0.20;
        earthMesh.position.set(1.5 + (1.0 - slideT) * 2.0, -0.8, 0);
        sunriseGlow.position.set(4.3 + (1.0 - slideT) * 2.0, -2.6, -1.0);
      } else {
        // Safe offscreen coordinates while inactive
        earthMesh.position.set(999, 999, 999);
      }
      earthMesh.scale.set(earthActive * baseZoom, earthActive * baseZoom, earthActive * baseZoom);

      // 2. Services shapes active profile (peaks at 0.375)
      const shapeCenter = 0.375;
      const shapeRadius = 0.075;
      const distToShape = Math.abs(tVal - shapeCenter);
      let shapeScale = 0;
      if (distToShape < shapeRadius) {
        shapeScale = Math.cos((distToShape / shapeRadius) * Math.PI * 0.5);
      }
      glassGroup.scale.set(shapeScale, shapeScale, shapeScale);
      serviceShapes.forEach((shape, i) => {
        shape.rotation.x = time * 0.12 + i;
        shape.rotation.y = time * 0.18 + i;
        // Subtle floating drift
        shape.position.y = Math.sin(time + i) * 0.3 + (i / serviceShapes.length) * 2.0 - 1.0;
      });

      // 3. Chrome/Glass rings active profile (peaks at 0.525)
      const ringCenter = 0.525;
      const ringRadius = 0.075;
      const distToRing = Math.abs(tVal - ringCenter);
      let ringScale = 0;
      if (distToRing < ringRadius) {
        ringScale = Math.cos((distToRing / ringRadius) * Math.PI * 0.5);
      }
      ringsGroup.scale.set(ringScale, ringScale, ringScale);
      ring1.rotation.y = time * 0.15;
      ring1.rotation.z = time * 0.08;
      ring2.rotation.y = -time * 0.10;
      ring2.rotation.z = -time * 0.12;
      ring3.rotation.y = time * 0.20;

      // 4. Projects cards active profile (peaks at 0.70)
      const projCenter = 0.70;
      const projRadius = 0.10;
      const distToProj = Math.abs(tVal - projCenter);
      let projScale = 0;
      if (distToProj < projRadius) {
        projScale = Math.cos((distToProj / projRadius) * Math.PI * 0.5);
      }
      projectsGroup.scale.set(projScale, projScale, projScale);

      projectCards.forEach((card, idx) => {
        const orbitalRadius = 8.5;
        const speedFactor = time * 0.08;
        const currentAngle = card.angle + speedFactor;

        let cardX = Math.cos(currentAngle) * orbitalRadius;
        let cardY = Math.sin(currentAngle) * 2.8;
        let cardZ = -65 + Math.sin(currentAngle) * 4;

        const isHovered = hoveredIndexRef.current === idx;
        if (isHovered && projScale > 0) {
          card.mesh.position.x += (targetCamera.x - card.mesh.position.x) * 0.12;
          card.mesh.position.y += (targetCamera.y - card.mesh.position.y) * 0.12;
          card.mesh.position.z += (camera.position.z - 4.5 - card.mesh.position.z) * 0.12;
          card.mesh.rotation.set(0, 0, 0);
        } else {
          card.mesh.position.set(cardX, cardY, cardZ);
          card.mesh.rotation.y = Math.sin(time * 0.15 + idx) * 0.08;
          card.mesh.rotation.x = Math.cos(time * 0.1 + idx) * 0.08;
        }
      });

      // ----------------------------------------------------
      // STARFIELD TWINKLE & TRAVEL SPEED ANIMATION
      // ----------------------------------------------------
      const posArr = starGeom.attributes.position.array as Float32Array;
      const isWarpSpeed = tVal >= 0.60 && tVal < 0.75;
      const warpSpeedFactor = isWarpSpeed ? 12.0 : 1.0;

      for (let i = 0; i < starCount; i++) {
        posArr[i * 3 + 2] += starSpeeds[i] * warpSpeedFactor;
        if (posArr[i * 3 + 2] > 15) {
          posArr[i * 3 + 2] = -120;
          posArr[i * 3] = (Math.random() - 0.5) * 120;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 80;
        }
      }
      starGeom.attributes.position.needsUpdate = true;

      // Twinkle star glow
      starMat.opacity = 0.75 + Math.sin(time * 0.5) * 0.2;

      // ----------------------------------------------------
      // FOREGROUND PARTICLES DRIFT (Desktop Only coordinates)
      // ----------------------------------------------------
      const fpArr = particlesGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        fpArr[i * 3] += particleVelocities[i * 3];
        fpArr[i * 3 + 1] += particleVelocities[i * 3 + 1];
        fpArr[i * 3 + 2] += particleVelocities[i * 3 + 2];

        if (!isMobile) {
          fpArr[i * 3] += (targetCamera.x * 2.0 - fpArr[i * 3]) * 0.001;
          fpArr[i * 3 + 1] += (targetCamera.y * 1.5 - fpArr[i * 3 + 1]) * 0.001;
        }

        // Wrap around boundaries
        if (Math.abs(fpArr[i * 3]) > 25) fpArr[i * 3] = -fpArr[i * 3];
        if (Math.abs(fpArr[i * 3 + 1]) > 18) fpArr[i * 3 + 1] = -fpArr[i * 3 + 1];
        if (fpArr[i * 3 + 2] > 20 || fpArr[i * 3 + 2] < -60) fpArr[i * 3 + 2] = -40;
      }
      particlesGeom.attributes.position.needsUpdate = true;

      // ----------------------------------------------------
      // UPDATE SHOOTING STARS
      // ----------------------------------------------------
      shootingStars.forEach(star => {
        if (star.life < star.maxLife) {
          star.mesh.position.x += star.vx;
          star.mesh.position.y += star.vy;
          star.mesh.position.z += star.vz;
          star.life++;
          
          if (star.life > star.maxLife - 10) {
            (star.mesh.material as THREE.LineBasicMaterial).opacity = (star.maxLife - star.life) / 10;
          }
        } else {
          if (Math.random() < 0.008) {
            triggerShootingStar(star);
          }
        }
      });

      // Gently rotate Earth
      earthMesh.rotation.y = time * 0.015;

      renderer.render(scene, camera);
    };

    animate();

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
      particlesGeom.dispose();
      particlesMat.dispose();
      shootingStars.forEach(s => {
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) {
          s.mesh.material.forEach(m => m.dispose());
        } else {
          s.mesh.material.dispose();
        }
      });
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
        const mat = c.mesh.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            m.dispose();
            if ('map' in m && m.map) m.map.dispose();
          });
        } else {
          mat.dispose();
          if ('map' in mat && mat.map) mat.map.dispose();
        }
      });
      bgGeom.dispose();
      bgMat.dispose();
      bgTexture.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
