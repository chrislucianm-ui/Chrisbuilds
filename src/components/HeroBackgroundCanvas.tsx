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

    // 1. Scene & Setup (Fog-free, pitch black base)
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
    renderer.toneMappingExposure = 1.2;

    // 2. Add Lighting (Volumetric direction lights for Earth horizon specularity)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // Warm sun light positioned to shine from bottom-left corner
    const sunLight = new THREE.DirectionalLight(0xfff4e0, 4.5);
    sunLight.position.set(-18, -14, 5);
    scene.add(sunLight);

    // 3. Dynamic star texture helper
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

    // 4. Multi-Layered Starfields at Varying Depths (True 3D depth parallax)
    const starGroups: { points: THREE.Points; speeds: Float32Array; count: number }[] = [];
    const layersConfig = [
      { count: isMobile ? 300 : 900, minZ: -180, maxZ: -250, size: 0.12, speedMult: 0.05 },
      { count: isMobile ? 200 : 600, minZ: -100, maxZ: -180, size: 0.15, speedMult: 0.10 },
      { count: isMobile ? 100 : 250, minZ: -30, maxZ: -100, size: 0.20, speedMult: 0.18 },
    ];

    layersConfig.forEach((config) => {
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(config.count * 3);
      const speeds = new Float32Array(config.count);

      for (let i = 0; i < config.count; i++) {
        // Star coordinates spread widely in a frustum shape
        pos[i * 3] = (Math.random() - 0.5) * 160;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
        pos[i * 3 + 2] = config.minZ + Math.random() * (config.maxZ - config.minZ);
        speeds[i] = (0.05 + Math.random() * 0.1) * config.speedMult;
      }

      geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: config.size,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.85,
      });

      const points = new THREE.Points(geom, mat);
      scene.add(points);
      starGroups.push({ points, speeds, count: config.count });
    });

    // 5. Volumetric 3D Milky Way Dust Lanes (Constructed from soft warm/silver particle clouds)
    const createDustTexture = () => {
      const size = 64;
      const dustCanvas = document.createElement("canvas");
      dustCanvas.width = size;
      dustCanvas.height = size;
      const ctx = dustCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
        grad.addColorStop(0.3, "rgba(255, 245, 235, 0.03)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(dustCanvas);
    };

    const dustTexture = createDustTexture();
    const dustLanesGroup = new THREE.Group();
    scene.add(dustLanesGroup);

    const dustCount = isMobile ? 300 : 800;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      // Scatter points along a diagonal plane (Y = X * 0.8) to map Interstellar's dust lanes
      const progress = (Math.random() - 0.5) * 160;
      const spreadX = (Math.random() - 0.5) * 22;
      const spreadY = (Math.random() - 0.5) * 22;
      const depthZ = -Math.random() * 150 - 50; // Spanned deeply from Z = -50 to -200

      dustPositions[i * 3] = progress * 1.1 + spreadX;
      dustPositions[i * 3 + 1] = progress * 0.7 + spreadY;
      dustPositions[i * 3 + 2] = depthZ;

      // Color palette: soft silver-blue and warm golden highlights
      const isWarm = Math.random() < 0.35;
      if (isWarm) {
        dustColors[i * 3] = 1.0;     // R
        dustColors[i * 3 + 1] = 0.90; // G
        dustColors[i * 3 + 2] = 0.78; // B
      } else {
        dustColors[i * 3] = 0.82;     // R
        dustColors[i * 3 + 1] = 0.88; // G
        dustColors[i * 3 + 2] = 0.95; // B
      }

      dustSizes[i] = 1.5 + Math.random() * 5.0;
    }

    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeom.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 4.5,
      map: dustTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    });
    const dustPointsMesh = new THREE.Points(dustGeom, dustMat);
    dustLanesGroup.add(dustPointsMesh);

    // 6. Foreground Particles (Drifting dust specks)
    const particleCount = isMobile ? 40 : 150;
    const particlesGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.010;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.010;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.010;
    }

    particlesGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlesMesh = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particlesMesh);

    // 7. Shooting Stars (Emissive streaks)
    const shootingStarCount = isMobile ? 1 : 2;
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
        (Math.random() - 0.3) * 40,
        12 + Math.random() * 4,
        -Math.random() * 70 - 20
      );
      star.vx = -0.42 - Math.random() * 0.42;
      star.vy = -0.28 - Math.random() * 0.28;
      star.vz = 0.10 + Math.random() * 0.10;
      star.life = 0;
      star.maxLife = 35 + Math.floor(Math.random() * 40);
      (star.mesh.material as THREE.LineBasicMaterial).opacity = 0.85;
    };

    // 8. Massive Dark Earth Horizon (Partially visible at bottom-left corner)
    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthCtx = earthCanvas.getContext("2d");
    if (earthCtx) {
      earthCtx.fillStyle = "#000000";
      earthCtx.fillRect(0, 0, 1024, 512);

      // Soft white land mass shapes to catch horizon light specularities
      earthCtx.fillStyle = "#ffffff";
      const landPoints = [
        { x: 300, y: 220, r: 120 }, { x: 380, y: 250, r: 90 },
        { x: 680, y: 190, r: 100 }, { x: 740, y: 230, r: 90 },
        { x: 200, y: 380, r: 100 }, { x: 800, y: 390, r: 85 }
      ];
      landPoints.forEach(p => {
        earthCtx.beginPath();
        earthCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        earthCtx.fill();
      });

      // Digital dotted grid lines representing city light overlays
      earthCtx.globalCompositeOperation = "destination-in";
      earthCtx.strokeStyle = "#ffffff";
      earthCtx.lineWidth = 1.0;
      for (let y = 0; y < 512; y += 4) {
        earthCtx.beginPath();
        earthCtx.moveTo(0, y);
        earthCtx.lineTo(1024, y);
        earthCtx.stroke();
      }
      for (let x = 0; x < 1024; x += 4) {
        earthCtx.beginPath();
        earthCtx.moveTo(x, 0);
        earthCtx.lineTo(x, 512);
        earthCtx.stroke();
      }
      earthCtx.globalCompositeOperation = "source-over";
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const earthGeom = new THREE.SphereGeometry(12.0, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x020204, // Deep space dark black-blue base
      roughness: 0.22,
      metalness: 0.95,
      bumpMap: earthTexture,
      bumpScale: 0.04,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    // Position Earth massive in bottom-left corner
    earthMesh.position.set(-9.5, -9.0, -2.0);
    scene.add(earthMesh);

    // Realistic Atmospheric Scattering Shell (Soft silver/blue rim glow)
    const atmosGeom = new THREE.SphereGeometry(12.24, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float intensity = pow(0.68 - dot(vNormal, viewDir), 3.5);
          // Soft silver-blue atmosphere scattering color
          vec3 color = vec3(0.68, 0.80, 0.95);
          gl_FragColor = vec4(color, 1.0) * intensity * 0.42;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    earthMesh.add(atmosMesh);

    // 9. Volumetric Light Rays peeking out from horizon (Interstellar style)
    const rayGroup = new THREE.Group();
    const rayGeom = new THREE.PlaneGeometry(16, 0.8);
    const rayMat = new THREE.MeshBasicMaterial({
      map: starTexture, // Radial gradient
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.08,
    });

    const raysCount = 10;
    const rays = Array.from({ length: raysCount }).map((_, i) => {
      const mesh = new THREE.Mesh(rayGeom, rayMat);
      mesh.rotation.z = (i / raysCount) * Math.PI * 2 + Math.random() * 0.15;
      mesh.scale.set(1.4 + Math.random() * 1.4, 1.0, 1.0);
      rayGroup.add(mesh);
      return mesh;
    });
    // Align ray emitter behind the Earth rim sunrise coordinates
    rayGroup.position.set(-2.8, -2.4, -4.0);
    scene.add(rayGroup);

    // Sunrise Glow Flare Plane
    const sunriseGeom = new THREE.PlaneGeometry(24, 18);
    const sunriseMat = new THREE.MeshBasicMaterial({
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.45,
    });
    const sunriseGlow = new THREE.Mesh(sunriseGeom, sunriseMat);
    sunriseGlow.position.set(-2.8, -2.4, -4.2);
    scene.add(sunriseGlow);

    // 10. Interactive Mouse coordinates
    const mouse = new THREE.Vector2(0, 0);
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!isMobile) {
        targetCamera.x = mouse.x * 0.40;
        targetCamera.y = mouse.y * 0.25;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 11. Resize logic
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 12. Animation Loop
    let animationFrameId: number;
    let lerpedScroll = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth scroll lerping for parallax drift
      lerpedScroll += (scrollRef.current - lerpedScroll) * 0.05;

      const tVal = Math.max(0.0, Math.min(1.0, lerpedScroll));

      // Fixed camera positioning with Y-parallax scroll drift
      camera.position.set(0, -tVal * 3.5, 10);

      // Inject camera breathing animation
      camera.position.y += Math.sin(time * 0.45) * 0.05;
      camera.position.z += Math.sin(time * 0.05) * 0.2;

      // Inject micro mouse-relative drift coordinates (desktop only)
      if (!isMobile) {
        camera.position.x += targetCamera.x;
        camera.position.y += targetCamera.y;
      }
      
      camera.lookAt(0, -tVal * 3.5, 0);

      // Milky Way dust lanes slow rotation drift
      dustLanesGroup.rotation.z = time * 0.0002;

      // Rotate light rays slowly
      rayGroup.rotation.z = time * 0.004;

      // Volumetric atmospheric shell rotation
      atmosMesh.rotation.y = -time * 0.003;
      atmosMesh.rotation.z = time * 0.001;

      // Pulsating sunrise glow flare
      const pulseFactor = 0.85 + Math.sin(time * 0.45) * 0.08;
      sunriseMat.opacity = 0.42 * pulseFactor;

      // Rotate Earth slowly
      earthMesh.rotation.y = time * 0.008;

      // ----------------------------------------------------
      // STARFIELD TWINKLE & TRAVEL SPEED ANIMATION
      // ----------------------------------------------------
      starGroups.forEach((group) => {
        const posArr = group.points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < group.count; i++) {
          posArr[i * 3 + 2] += group.speeds[i] * 0.5;
          if (posArr[i * 3 + 2] > 15) {
            posArr[i * 3 + 2] = -120;
            posArr[i * 3] = (Math.random() - 0.5) * 160;
            posArr[i * 3 + 1] = (Math.random() - 0.5) * 100;
          }
        }
        group.points.geometry.attributes.position.needsUpdate = true;
      });

      // Twinkle star fields
      starGroups.forEach((group, idx) => {
        (group.points.material as THREE.PointsMaterial).opacity = 0.70 + Math.sin(time * 0.6 + idx) * 0.25;
      });

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
      // UPDATE SHOOTING STARS (Rare occurrence factor 0.002)
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
          if (Math.random() < 0.002) {
            triggerShootingStar(star);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();

      starGroups.forEach((group) => {
        group.points.geometry.dispose();
        (group.points.material as THREE.Material).dispose();
      });
      starTexture.dispose();
      dustGeom.dispose();
      dustMat.dispose();
      dustTexture.dispose();
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
      rayGeom.dispose();
      rayMat.dispose();
      sunriseGeom.dispose();
      sunriseMat.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
