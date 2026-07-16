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

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

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

    // 2. Add Lighting (Volumetric direction lights for Earth grid specs)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
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

    // ----------------------------------------------------
    // POPULATE LIVING SPACE UNIVERSE WITH REAL 3D OBJECTS
    // ----------------------------------------------------

    // A. Orbiting Chrome Rings in background
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.02,
    });
    const ringsGroup = new THREE.Group();
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(12.0, 0.1, 16, 100), chromeMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(18.0, 0.08, 16, 100), chromeMat);
    ringsGroup.add(ring1, ring2);
    ringsGroup.position.set(0, 0, -45);
    scene.add(ringsGroup);

    // B. Floating Refractive Glass Crystals
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.02,
      metalness: 0.1,
      transmission: 0.98,
      ior: 1.62,
      thickness: 1.8,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    const crystalsGroup = new THREE.Group();
    const crystalGeom = new THREE.OctahedronGeometry(0.35);
    const crystals = Array.from({ length: 6 }).map((_, idx) => {
      const mesh = new THREE.Mesh(crystalGeom, glassMat);
      const angle = (idx / 6) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * (14 + Math.random() * 5),
        Math.sin(angle) * (7 + Math.random() * 3),
        -Math.random() * 30 - 20
      );
      crystalsGroup.add(mesh);
      return {
        mesh,
        rotSpeedX: 0.008 + Math.random() * 0.015,
        rotSpeedY: 0.008 + Math.random() * 0.015,
        floatOffset: idx * 1.8
      };
    });
    scene.add(crystalsGroup);

    // C. Satellites / Moons far in background
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.85,
      metalness: 0.1
    });
    const satGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const sat1 = new THREE.Mesh(satGeom, satMat);
    sat1.position.set(-22, 12, -90);
    const sat2 = new THREE.Mesh(satGeom, satMat);
    sat2.position.set(24, -12, -75);
    scene.add(sat1, sat2);

    // D. Four Volumetric 3D Glass Display Panels for Page 2
    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    const createCardTexture = (title: string, desc: string) => {
      const cardCanvas = document.createElement("canvas");
      cardCanvas.width = 512;
      cardCanvas.height = 340;
      const ctx = cardCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(10, 10, 10, 0.95)";
        ctx.fillRect(0, 0, 512, 340);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 496, 324);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText(title.toUpperCase(), 35, 140);

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "14px monospace";
        ctx.fillText(desc.toUpperCase(), 35, 190);

        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "10px monospace";
        ctx.fillText("01 / PRECISION", 35, 260);
      }
      const tex = new THREE.CanvasTexture(cardCanvas);
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      return tex;
    };

    const cardGeom = new THREE.BoxGeometry(3.6, 2.4, 0.14);
    const servicesData = [
      { title: "Premium Websites", desc: "Crafted to leave a lasting impression.", x: -4.0, y: 1.9 },
      { title: "Web Applications", desc: "Powerful systems. Beautifully experienced.", x: 4.0, y: 1.9 },
      { title: "Mobile Applications", desc: "Designed for every touch.", x: -4.0, y: -1.9 },
      { title: "AI Solutions", desc: "Intelligence, seamlessly integrated.", x: 4.0, y: -1.9 }
    ];

    const cardMeshes = servicesData.map((data, i) => {
      const frontTex = createCardTexture(data.title, data.desc);
      const frontMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      const mats = [glassMat, glassMat, glassMat, glassMat, frontMat, glassMat];
      const mesh = new THREE.Mesh(cardGeom, mats);
      mesh.position.set(data.x, data.y, -30);
      mesh.userData = { index: i, baseX: data.x, baseY: data.y };
      cardsGroup.add(mesh);
      return mesh;
    });

    // E. 3D Glass Contact Form Backplate
    const contactPanelGeom = new THREE.BoxGeometry(11.2, 7.8, 0.18);
    const contactPanelMesh = new THREE.Mesh(contactPanelGeom, glassMat);
    contactPanelMesh.position.set(999, 999, 999); // Offscreen until Page 3
    scene.add(contactPanelMesh);

    // 9. Spline Paths for Cinematic Continuity (3 control points for 3 scenes)
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),      // Scene 1: Hero (t = 0.0)
      new THREE.Vector3(0, 2.0, 18),    // Scene 2: What I Build (t = 0.5)
      new THREE.Vector3(2.2, -0.6, 11)  // Scene 3: Contact Earth (t = 1.0)
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),       // Scene 1
      new THREE.Vector3(-2.0, 1.0, 0),  // Scene 2
      new THREE.Vector3(1.5, -0.6, 0)   // Scene 3
    ]);

    // 10. Interactive Mouse coordinates & Raycasting
    const mouse = new THREE.Vector2(0, 0);
    const targetCamera = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!isMobile) {
        targetCamera.x = mouse.x * 0.55;
        targetCamera.y = mouse.y * 0.4;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 11. Animation Loop
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
      
      // Inject camera breathing animation
      camera.position.y += Math.sin(time * 0.5) * 0.08;
      camera.position.z += Math.sin(time * 0.05) * 0.25;

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

      // 1. Milky Way shifting & slow background rotation
      bgMesh.rotation.z = time * 0.0006;

      // 2. Volumetric atmospheric glow rotations
      atmosMesh.rotation.y = -time * 0.006;
      atmosMesh.rotation.z = time * 0.003;

      // 3. Earth active profile & pulsating sunrise glow
      let earthActive = 0;
      const pulseFactor = 0.85 + Math.sin(time * 0.45) * 0.08;

      if (tVal < 0.33) {
        // Hero: active and stationary
        earthActive = 1.0;
        earthMesh.position.set(0, 0, 0);
        sunriseGlow.position.set(2.8, -1.8, -1.0);
        sunriseMat.opacity = 0.62 * pulseFactor;
      } else if (tVal < 0.66) {
        // What I Build: slide down and out
        const slide = (tVal - 0.33) / 0.33;
        earthActive = 1.0 - slide;
        earthMesh.position.set(-slide * 8, -slide * 8, 0);
        sunriseGlow.position.set(2.8 - slide * 8, -1.8 - slide * 8, -1.0);
        sunriseMat.opacity = 0.62 * (1.0 - slide) * pulseFactor;
      } else {
        // Contact: slide back in on the right
        const slide = (tVal - 0.66) / 0.34;
        earthActive = slide;
        earthMesh.position.set(1.5 + (1.0 - slide) * 3.0, -0.8, 0);
        sunriseGlow.position.set(4.3 + (1.0 - slide) * 3.0, -2.6, -1.0);
        // Sunrise becomes brighter on contact scene
        sunriseMat.opacity = 0.92 * slide * pulseFactor;
      }

      // Earth camera proximity scale zoom on scroll progress
      if (tVal >= 0.66) {
        const zoomSlide = (tVal - 0.66) / 0.34;
        const scaleVal = earthActive * (1.0 + zoomSlide * 0.18) * baseZoom;
        earthMesh.scale.set(scaleVal, scaleVal, scaleVal);
      } else {
        earthMesh.scale.set(earthActive * baseZoom, earthActive * baseZoom, earthActive * baseZoom);
      }

      // 4. Torus rings rotation
      ringsGroup.rotation.y = time * 0.015;
      ringsGroup.rotation.x = time * 0.008;

      // 5. Glass crystals rotation & floating
      crystals.forEach((c) => {
        c.mesh.rotation.x += c.rotSpeedX;
        c.mesh.rotation.y += c.rotSpeedY;
        c.mesh.position.y += Math.sin(time * 0.5 + c.floatOffset) * 0.003;
      });

      // 6. Far satellites drift
      sat1.position.x += Math.sin(time * 0.03) * 0.005;
      sat2.position.x -= Math.sin(time * 0.02) * 0.005;

      // 7. Raycast 3D display panel hover check (Desktop only)
      let hoveredCardIndex: number | null = null;
      if (!isMobile && tVal >= 0.33 && tVal <= 0.66) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cardsGroup.children);
        if (intersects.length > 0) {
          const mesh = intersects[0].object as THREE.Mesh;
          if (mesh.userData && typeof mesh.userData.index === "number") {
            hoveredCardIndex = mesh.userData.index;
          }
        }
      }

      // 8. Position, scale, and rotate Page 2 Display Panels
      let cardActiveScale = 0;
      if (tVal >= 0.33 && tVal <= 0.66) {
        cardActiveScale = Math.cos(((tVal - 0.5) / 0.165) * Math.PI * 0.5);
      }
      cardsGroup.scale.set(cardActiveScale, cardActiveScale, cardActiveScale);
      cardsGroup.position.z = (1.0 - cardActiveScale) * -15;

      cardMeshes.forEach((mesh) => {
        const isHovered = hoveredCardIndex === mesh.userData.index;
        const targetScale = isHovered ? 1.05 : 1.0;
        const targetRotX = isHovered ? mouse.y * 0.12 : 0;
        const targetRotY = isHovered ? mouse.x * 0.12 : 0;

        // Smoothly scale hovered meshes
        mesh.scale.x += (targetScale - mesh.scale.x) * 0.15;
        mesh.scale.y += (targetScale - mesh.scale.y) * 0.15;
        mesh.scale.z += (targetScale - mesh.scale.z) * 0.15;

        // Apply organic floating cycle to rotation
        const floatRotX = Math.sin(time * 0.6 + mesh.userData.index) * 0.03;
        const floatRotY = Math.cos(time * 0.4 + mesh.userData.index) * 0.03;

        mesh.rotation.x += (targetRotX + floatRotX - mesh.rotation.x) * 0.12;
        mesh.rotation.y += (targetRotY + floatRotY - mesh.rotation.y) * 0.12;
      });

      // 9. Position Page 3 Contact glass backplate relative to camera
      if (tVal >= 0.66) {
        const contactActive = (tVal - 0.66) / 0.34;
        
        // Project panel directly in front of camera
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const targetPos = camera.position.clone().add(forward.multiplyScalar(4.6));
        
        contactPanelMesh.position.copy(targetPos);
        contactPanelMesh.quaternion.copy(camera.quaternion);
        
        // Add slow float drift
        contactPanelMesh.position.y += Math.sin(time * 0.5) * 0.08;
        
        contactPanelMesh.scale.set(contactActive, contactActive, contactActive);
      } else {
        contactPanelMesh.position.set(999, 999, 999);
      }

      // ----------------------------------------------------
      // STARFIELD TWINKLE & TRAVEL SPEED ANIMATION
      // ----------------------------------------------------
      const posArr = starGeom.attributes.position.array as Float32Array;
      const isWarpSpeed = tVal >= 0.33 && tVal < 0.66;
      const warpSpeedFactor = isWarpSpeed ? 8.0 : 1.0;

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
      bgGeom.dispose();
      bgMat.dispose();
      bgTexture.dispose();
      chromeMat.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      glassMat.dispose();
      crystalGeom.dispose();
      satGeom.dispose();
      satMat.dispose();
      cardGeom.dispose();
      cardMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            mat.dispose();
            if ("map" in mat && mat.map) mat.map.dispose();
          });
        }
      });
      contactPanelGeom.dispose();
      contactPanelMesh.geometry.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
