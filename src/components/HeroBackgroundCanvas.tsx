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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(10, 5, 10);
    scene.add(mainLight);

    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.8);
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

    // 4. Starfield setup (1800 points)
    const starCount = isMobile ? 800 : 1800;
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
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // 5. Ambient Nebula Planes (Keeps background active and volumetric)
    const createNebulaTexture = (color: string) => {
      const size = 256;
      const nCanvas = document.createElement("canvas");
      nCanvas.width = size;
      nCanvas.height = size;
      const ctx = nCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, "rgba(255, 255, 255, 0.005)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(nCanvas);
    };

    const nebulaTexture1 = createNebulaTexture("rgba(255, 255, 255, 0.02)");
    const nebulaTexture2 = createNebulaTexture("rgba(200, 200, 200, 0.012)");

    const nebulaGeom = new THREE.PlaneGeometry(100, 100);
    const nebulaMat1 = new THREE.MeshBasicMaterial({
      map: nebulaTexture1,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });
    const nebulaMat2 = new THREE.MeshBasicMaterial({
      map: nebulaTexture2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });

    const nebula1 = new THREE.Mesh(nebulaGeom, nebulaMat1);
    nebula1.position.set(-15, 10, -90);
    const nebula2 = new THREE.Mesh(nebulaGeom, nebulaMat2);
    nebula2.position.set(15, -10, -90);

    scene.add(nebula1, nebula2);

    // 6. Realistic Digital Grid Earth Sphere
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
      roughness: 0.15,
      metalness: 0.95,
      bumpMap: earthTexture,
      bumpScale: 0.08,
      alphaMap: earthTexture,
      transparent: true,
      opacity: 0.95,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
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
    scene.add(sunriseGlow);

    // 7. Scene 3 Floating Glass Geometries
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

    // 8. Scene 4 Concentric Chrome & Glass Rings
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
    ringsGroup.position.set(0, 0, -32);

    // 9. Scene 6 Orbiting Holographic Project Cards
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

    // 10. Spline Paths for Cinematic Continuity
    const cameraPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),      // Scene 1: Arrival
      new THREE.Vector3(0, 2.5, 18),    // Scene 2: Vision
      new THREE.Vector3(-3.0, 0, 28),   // Scene 3: Capabilities
      new THREE.Vector3(0, 0, 24),      // Scene 4: Ring Approach
      new THREE.Vector3(0, 0, -25),     // Scene 4: Ring Exit
      new THREE.Vector3(0, 0, -42),     // Scene 5: Philosophy Warp
      new THREE.Vector3(0, 0, -50),     // Scene 6: Featured Projects
      new THREE.Vector3(2.2, -0.6, 11)  // Scene 7: Contact Earth
    ]);

    const targetPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),       // Scene 1
      new THREE.Vector3(-3.5, 0.5, 0),  // Scene 2
      new THREE.Vector3(0, 0, -30),     // Scene 3
      new THREE.Vector3(0, 0, -32),     // Scene 4
      new THREE.Vector3(0, 0, -32),     // Scene 4
      new THREE.Vector3(0, 0, -80),     // Scene 5
      new THREE.Vector3(0, 0, -65),     // Scene 6
      new THREE.Vector3(1.5, -0.6, 0)   // Scene 7
    ]);

    // 11. Interactive Mouse Parallax coordinates
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCamera.x = mouse.x * 0.55;
      targetCamera.y = mouse.y * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 12. Animation Loop
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
      
      // Inject micro mouse-relative drift coordinates
      camera.position.x += targetCamera.x;
      camera.position.y += targetCamera.y;
      
      camera.lookAt(lookTarget);

      const baseZoom = 1.0 + Math.sin(time * 0.08) * 0.008;

      // ----------------------------------------------------
      // WEBGL MESH ACTIVATION BELL CURVES
      // ----------------------------------------------------

      // 1. Earth mesh active profile
      let earthActive = 0;
      if (tVal < 0.30) {
        earthActive = Math.cos((tVal / 0.30) * Math.PI * 0.5);
        const slideT = tVal / 0.30;
        earthMesh.position.set(-slideT * 3.5, 0, 0);
        sunriseGlow.position.set(2.8 - slideT * 3.5, -1.8, -1.0);
      } else if (tVal > 0.85) {
        earthActive = Math.sin(((tVal - 0.85) / 0.15) * Math.PI * 0.5);
        const slideT = (tVal - 0.85) / 0.15;
        earthMesh.position.set(1.5 + (1.0 - slideT) * 2.0, -0.8, 0);
        sunriseGlow.position.set(4.3 + (1.0 - slideT) * 2.0, -2.6, -1.0);
      } else {
        // Safe offscreen coordinates while inactive
        earthMesh.position.set(999, 999, 999);
      }
      earthMesh.scale.set(earthActive * baseZoom, earthActive * baseZoom, earthActive * baseZoom);

      // 2. Services shapes active profile (peaks at 0.36)
      const shapeCenter = 0.36;
      const shapeRadius = 0.10;
      const distToShape = Math.abs(tVal - shapeCenter);
      let shapeScale = 0;
      if (distToShape < shapeRadius) {
        shapeScale = Math.cos((distToShape / shapeRadius) * Math.PI * 0.5);
      }
      glassGroup.scale.set(shapeScale, shapeScale, shapeScale);
      serviceShapes.forEach((shape, i) => {
        shape.rotation.x = time * 0.12 + i;
        shape.rotation.y = time * 0.18 + i;
      });

      // 3. Chrome/Glass rings active profile (peaks at 0.54)
      const ringCenter = 0.54;
      const ringRadius = 0.12;
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

      // 4. Projects cards active profile (peaks at 0.82)
      const projCenter = 0.82;
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

      // Twinkle glow
      starMat.opacity = 0.5 + Math.sin(time * 0.5) * 0.25;

      // Rotate nebulas slowly
      nebula1.rotation.z = time * 0.005;
      nebula2.rotation.z = -time * 0.003;

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
      nebulaGeom.dispose();
      nebulaMat1.dispose();
      nebulaMat2.dispose();
      nebulaTexture1.dispose();
      nebulaTexture2.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
