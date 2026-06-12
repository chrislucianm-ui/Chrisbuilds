"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Deeper atmospheric fog to create depth between segments
    scene.fog = new THREE.FogExp2(0xe5d1fa, 0.022);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 120);
    camera.position.set(0, 10, 22);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2));

    // 2. Lighting (Warm ambient daylight + volumetric sun rays)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.5);
    fillLight.position.set(-20, 10, -10);
    scene.add(fillLight);

    // 3. Volumetric Sunlight Shafts (Hero section)
    const rayGroup = new THREE.Group();
    rayGroup.position.set(8, 16, -6);
    const rayGeom = new THREE.CylinderGeometry(0.2, 6, 38, 8, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xfff3d6,
      transparent: true,
      opacity: isMobile ? 0.05 : 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const numRays = isMobile ? 2 : 4;
    for (let i = 0; i < numRays; i++) {
      const ray = new THREE.Mesh(rayGeom, rayMat);
      ray.position.x = i * 4.5;
      ray.position.y = -i * 2;
      ray.rotation.z = -Math.PI / 4.2;
      rayGroup.add(ray);
    }
    scene.add(rayGroup);

    // 4. Volumetric Clouds (300% Density: Distributed Foreground, Midground, Background)
    const createCloudTexture = () => {
      const canvasTexture = document.createElement("canvas");
      canvasTexture.width = 128;
      canvasTexture.height = 128;
      const ctx = canvasTexture.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.88)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.55)");
        gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.18)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(canvasTexture);
    };

    const cloudTexture = createCloudTexture();
    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const cloudGeom = new THREE.PlaneGeometry(18, 18);
    const clouds: THREE.Mesh[] = [];
    const numClouds = isMobile ? 30 : 82;

    for (let i = 0; i < numClouds; i++) {
      const cloud = new THREE.Mesh(cloudGeom, cloudMaterial);
      
      const y = 25 - Math.random() * 260;
      const x = (Math.random() - 0.5) * 48;
      
      let z = 0;
      const randZ = Math.random();
      if (randZ < 0.25) {
        z = 10 + Math.random() * 6; // Foreground
      } else if (randZ < 0.7) {
        z = (Math.random() - 0.5) * 10; // Midground
      } else {
        z = -12 - Math.random() * 10; // Background
      }
      
      cloud.position.set(x, y, z);

      const scale = 1.0 + Math.random() * 2.5;
      cloud.scale.set(scale, scale, 1);
      cloud.rotation.z = Math.random() * Math.PI * 2;

      scene.add(cloud);
      clouds.push(cloud);
    }

    // 5. Continuous Mountain Backdrop (Distributed ranges)
    const createMountainRange = (color: number, yPos: number, zPos: number) => {
      const geom = new THREE.PlaneGeometry(140, 48, 20, 20);
      const pos = geom.attributes.position;

      // Soft low-poly noise displacement
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x * 0.07) * Math.cos(y * 0.07) * 4.8 +
                  Math.sin(x * 0.03) * 7.5 +
                  Math.cos(y * 0.04) * 2.2;
        pos.setZ(i, z);
      }
      geom.computeVertexNormals();

      const mat = new THREE.MeshLambertMaterial({
        color: color,
        flatShading: true,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0, yPos, zPos);
      mesh.rotation.x = -Math.PI / 2.3;
      scene.add(mesh);
      return mesh;
    };

    const mountainRanges: THREE.Mesh[] = [];
    const mountainYLevels = [0, -55, -110, -165, -220];
    mountainYLevels.forEach((yVal, idx) => {
      const color = idx % 2 === 0 ? 0xe5d1fa : 0xdbeafe;
      const mnt = createMountainRange(color, yVal, -36);
      mountainRanges.push(mnt);
    });

    // Helper: Create general floating island
    const createFloatingIsland = (radius: number, height: number, x: number, y: number, z: number, grassColor = 0x93c5fd) => {
      const islandGroup = new THREE.Group();
      islandGroup.position.set(x, y, z);

      const topGeom = new THREE.CylinderGeometry(radius, radius * 0.9, 0.8, 6, 1);
      const topMat = new THREE.MeshLambertMaterial({
        color: grassColor,
        flatShading: true
      });
      const topMesh = new THREE.Mesh(topGeom, topMat);
      topMesh.position.y = 0.4;
      islandGroup.add(topMesh);

      const bottomGeom = new THREE.ConeGeometry(radius, height, 6);
      const bottomMat = new THREE.MeshLambertMaterial({
        color: 0xc084fc,
        flatShading: true
      });
      const bottomMesh = new THREE.Mesh(bottomGeom, bottomMat);
      bottomMesh.rotation.x = Math.PI;
      bottomMesh.position.y = -height / 2;
      islandGroup.add(bottomMesh);

      scene.add(islandGroup);
      return islandGroup;
    };

    // Helper: Create animated trees on islands
    const createTree = (islandGroup: THREE.Group, x: number, y: number, z: number) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, y, z);
      
      const trunkGeom = new THREE.CylinderGeometry(0.1, 0.15, 1.2, 5);
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x854d0e, flatShading: true });
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.y = 0.6;
      treeGroup.add(trunk);
      
      const foliageGeom = new THREE.ConeGeometry(0.7, 1.8, 5);
      const foliageMat = new THREE.MeshLambertMaterial({ color: 0xa7f3d0, flatShading: true });
      const foliage = new THREE.Mesh(foliageGeom, foliageMat);
      foliage.position.y = 1.7;
      treeGroup.add(foliage);
      
      islandGroup.add(treeGroup);
      return treeGroup;
    };

    // 6. Hero elements: Flocking Birds
    const createBirdTexture = () => {
      const canvasTexture = document.createElement("canvas");
      canvasTexture.width = 64;
      canvasTexture.height = 64;
      const ctx = canvasTexture.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(108, 0, 217, 0.65)";
        ctx.beginPath();
        ctx.moveTo(32, 44);
        ctx.quadraticCurveTo(20, 24, 6, 28);
        ctx.quadraticCurveTo(20, 36, 32, 46);
        ctx.quadraticCurveTo(44, 36, 58, 28);
        ctx.quadraticCurveTo(44, 24, 32, 44);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvasTexture);
    };

    const birdTexture = createBirdTexture();
    const birdMaterial = new THREE.MeshBasicMaterial({
      map: birdTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const birdGeom = new THREE.PlaneGeometry(0.85, 0.85);
    const birds: THREE.Mesh[] = [];
    const numBirds = isMobile ? 3 : 7;
    for (let i = 0; i < numBirds; i++) {
      const bird = new THREE.Mesh(birdGeom, birdMaterial);
      bird.position.set(
        -12 + Math.random() * 20,
        4 + Math.random() * 8,
        Math.random() * 8
      );
      scene.add(bird);
      birds.push(bird);
    }

    const heroIsland = createFloatingIsland(4.0, 3.0, -6, 1, -3, 0xa7f3d0);
    createTree(heroIsland, 1.5, 0.8, -1.5);

    // 7. Project elements: Floating screenshot islands with animated waterfalls
    const textureLoader = new THREE.TextureLoader();
    const loadProjectPlane = (imgUrl: string, width: number, height: number, x: number, y: number, z: number) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const texture = textureLoader.load(imgUrl);
      texture.colorSpace = THREE.SRGBColorSpace;

      const planeGeom = new THREE.PlaneGeometry(width, height);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      group.add(planeMesh);

      const borderGeom = new THREE.PlaneGeometry(width + 0.6, height + 0.6);
      const borderMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const borderMesh = new THREE.Mesh(borderGeom, borderMat);
      borderMesh.position.z = -0.04;
      group.add(borderMesh);

      scene.add(group);
      return group;
    };

    const projectIsland1 = createFloatingIsland(5.0, 4.0, -8, -18, -2);
    const projectIsland2 = createFloatingIsland(4.5, 3.5, 8, -43, -4);
    const projectIsland3 = createFloatingIsland(5.0, 4.5, -8, -68, -2);

    const projectTrees = [
      createTree(projectIsland1, 2.0, 0.8, -1.0),
      createTree(projectIsland2, -1.8, 0.8, 1.5),
      createTree(projectIsland3, 1.5, 0.8, -2.0)
    ];

    const project1 = loadProjectPlane("/images/gym_site_mockup.png", 7.2, 4.5, -7, -14, 1);
    const project2 = loadProjectPlane("/images/ecommerce_site_mockup.png", 7.2, 4.5, 7, -39, -1);
    const project3 = loadProjectPlane("/images/realestate_site_mockup.png", 7.2, 4.5, -7, -64, 1);

    const createWaterfallTexture = () => {
      const canvasTexture = document.createElement("canvas");
      canvasTexture.width = 32;
      canvasTexture.height = 128;
      const ctx = canvasTexture.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 128);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
        grad.addColorStop(0.5, "rgba(219, 234, 254, 0.65)");
        grad.addColorStop(1, "rgba(147, 197, 253, 0.2)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 128);

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        for (let i = 0; i < 6; i++) {
          ctx.fillRect(Math.random() * 22, Math.random() * 100, 2.5, 22);
        }
      }
      const texture = new THREE.CanvasTexture(canvasTexture);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const waterfallTex1 = createWaterfallTexture();
    const waterfallTex2 = createWaterfallTexture();
    const waterfallMat = new THREE.MeshBasicMaterial({
      map: waterfallTex1,
      transparent: true,
      side: THREE.DoubleSide
    });
    const waterfallGeom = new THREE.PlaneGeometry(1.4, 6.2);

    const waterfall1 = new THREE.Mesh(waterfallGeom, waterfallMat);
    waterfall1.position.set(-8.8, -21.0, -2.1);
    scene.add(waterfall1);

    const waterfall2 = new THREE.Mesh(waterfallGeom, new THREE.MeshBasicMaterial({
      map: waterfallTex2,
      transparent: true,
      side: THREE.DoubleSide
    }));
    waterfall2.position.set(-8.8, -71.1, -2.1);
    scene.add(waterfall2);

    // 8. Apps & Demos: Phone chassis emerging from clouds + light trails
    const demoIsland = createFloatingIsland(4.5, 3.5, 0, -103, -2, 0xfed7aa);
    createTree(demoIsland, 1.8, 0.8, -1.0);

    const createPhoneMesh = (imgUrl: string) => {
      const phoneGroup = new THREE.Group();

      const chassisGeom = new THREE.BoxGeometry(2.4, 4.4, 0.18);
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0.15,
        transmission: 0.75,
        thickness: 0.35,
        transparent: true
      });
      const chassis = new THREE.Mesh(chassisGeom, chassisMat);
      phoneGroup.add(chassis);

      const screenTex = textureLoader.load(imgUrl);
      const screenGeom = new THREE.PlaneGeometry(2.28, 4.28);
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
      const screen = new THREE.Mesh(screenGeom, screenMat);
      screen.position.z = 0.1;
      phoneGroup.add(screen);

      scene.add(phoneGroup);
      return phoneGroup;
    };

    const phone1 = createPhoneMesh("/images/gym_site_mockup.png");
    phone1.position.set(-3.8, -99.5, 1);
    const phone2 = createPhoneMesh("/images/ecommerce_site_mockup.png");
    phone2.position.set(3.8, -99.5, 0);

    const trailPoints = [
      new THREE.Vector3(-8, -95, -2),
      new THREE.Vector3(-4, -101, 1),
      new THREE.Vector3(4, -98, 0),
      new THREE.Vector3(8, -102, -1)
    ];
    const trailCurve = new THREE.CatmullRomCurve3(trailPoints);
    const trailGeom = new THREE.BufferGeometry().setFromPoints(trailCurve.getPoints(45));
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x00a0c2,
      transparent: true,
      opacity: 0.3
    });
    const trailLine = new THREE.Line(trailGeom, trailMat);
    scene.add(trailLine);

    const lightNodeGeom = new THREE.SphereGeometry(0.16, 6, 6);
    const lightNodeMat = new THREE.MeshBasicMaterial({ color: 0x00a0c2 });
    const lightNode = new THREE.Mesh(lightNodeGeom, lightNodeMat);
    scene.add(lightNode);

    // 9. Services: Two neighboring islands connected by wooden-arch bridge
    const servicesIslandL = createFloatingIsland(4.0, 3.2, -6, -132, -3);
    const servicesIslandR = createFloatingIsland(4.0, 3.2, 6, -134, -3);
    createTree(servicesIslandL, -1.2, 0.8, -1.2);
    createTree(servicesIslandR, 1.2, 0.8, -1.2);

    const bridgeGroup = new THREE.Group();
    const bridgePoints = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const x = -4.2 + t * 8.4;
      const y = -128.6 * (1 - t) + -130.6 * t + Math.sin(t * Math.PI) * 1.6;
      const z = -2.8;
      bridgePoints.push(new THREE.Vector3(x, y, z));
    }
    const bridgeCurve = new THREE.CatmullRomCurve3(bridgePoints);
    const bridgeGeom = new THREE.TubeGeometry(bridgeCurve, 18, 0.18, 8, false);
    const bridgeMat = new THREE.MeshLambertMaterial({ color: 0xdbeafe, flatShading: true });
    const bridgeMesh = new THREE.Mesh(bridgeGeom, bridgeMat);
    bridgeGroup.add(bridgeMesh);
    scene.add(bridgeGroup);

    const stoneGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 5);
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0, flatShading: true });
    const stoneGroup = new THREE.Group();
    const stoneCoords = [
      [-5.5, -127.5, -2],
      [-5.0, -127.6, -1.5],
      [-4.5, -127.7, -1],
      [4.5, -129.5, -1],
      [5.0, -129.6, -1.5],
      [5.5, -129.7, -2]
    ];
    stoneCoords.forEach(([x, y, z]) => {
      const stone = new THREE.Mesh(stoneGeom, stoneMat);
      stone.position.set(x, y, z);
      stoneGroup.add(stone);
    });
    scene.add(stoneGroup);

    // 10. Philosophy: Sky lanterns + Fireflies drifting
    const skyLanternGeom = new THREE.CylinderGeometry(0.38, 0.32, 0.95, 6);
    const skyLanternMat = new THREE.MeshBasicMaterial({ color: 0xffb74d });
    const lanterns: THREE.Mesh[] = [];
    const numLanterns = isMobile ? 3 : 6;
    for (let i = 0; i < numLanterns; i++) {
      const lantern = new THREE.Mesh(skyLanternGeom, skyLanternMat);
      lantern.position.set(
        -10 + Math.random() * 20,
        -180 - Math.random() * 18,
        -4 + Math.random() * 8
      );
      scene.add(lantern);
      lanterns.push(lantern);
    }

    const fireflyGeom = new THREE.SphereGeometry(0.08, 5, 5);
    const fireflyMat = new THREE.MeshBasicMaterial({ color: 0xa7f3d0 });
    const fireflies: THREE.Mesh[] = [];
    const numFireflies = isMobile ? 6 : 16;
    for (let i = 0; i < numFireflies; i++) {
      const ff = new THREE.Mesh(fireflyGeom, fireflyMat);
      ff.position.set(
        -12 + Math.random() * 24,
        -175 + (Math.random() - 0.5) * 16,
        -4 + Math.random() * 8
      );
      scene.add(ff);
      fireflies.push(ff);
    }

    // 11. Contact: Giant glowing mountain summit + scrolling Aurora Borealis + ChrisBuilds logo
    const summitGeom = new THREE.ConeGeometry(9.5, 22, 5);
    const summitMat = new THREE.MeshLambertMaterial({
      color: 0xe0f2fe,
      emissive: 0x6c00d9,
      emissiveIntensity: 0.35,
      flatShading: true
    });
    const summit = new THREE.Mesh(summitGeom, summitMat);
    summit.position.set(0, -225, -5);
    scene.add(summit);

    const auroraGeom = new THREE.PlaneGeometry(62, 28, 12, 12);
    const auroraMat = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: isMobile ? 0.08 : 0.16,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const aurora = new THREE.Mesh(auroraGeom, auroraMat);
    aurora.position.set(0, -218, -16);
    aurora.rotation.x = -Math.PI / 6.5;
    scene.add(aurora);

    const logoGeom = new THREE.PlaneGeometry(10.5, 3.2);
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 512;
    logoCanvas.height = 128;
    const logoCtx = logoCanvas.getContext("2d");
    if (logoCtx) {
      logoCtx.fillStyle = "rgba(255,255,255,0)";
      logoCtx.fillRect(0, 0, 512, 128);
      logoCtx.fillStyle = "#1e293b";
      logoCtx.font = "bold 44px sans-serif";
      logoCtx.textAlign = "center";
      logoCtx.textBaseline = "middle";
      logoCtx.fillText("CHRISBUILDS.COM", 256, 64);
    }
    const logoTex = new THREE.CanvasTexture(logoCanvas);
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    const logoMesh = new THREE.Mesh(logoGeom, logoMat);
    logoMesh.position.set(0, -210, 5.5);
    scene.add(logoMesh);

    // 12. Spline camera journey path
    const cameraSplinePoints = [
      new THREE.Vector3(0, 10, 22),       // Hero (Home)
      new THREE.Vector3(2.5, -14, 18),    // Project 1
      new THREE.Vector3(-2.2, -39, 18),   // Project 2
      new THREE.Vector3(2.5, -64, 18),    // Project 3
      new THREE.Vector3(-3.0, -99.5, 19), // Demos (Apps)
      new THREE.Vector3(3.2, -130, 18),   // Services
      new THREE.Vector3(-2.0, -158, 19),  // Stack (Tech)
      new THREE.Vector3(2.2, -182, 18),   // Philosophy
      new THREE.Vector3(0, -210, 20)      // Contact / Footer
    ];
    const cameraCurve = new THREE.CatmullRomCurve3(cameraSplinePoints);

    // 13. Event listeners & Parallax mouse triggers
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 15. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Cloud horizontal and vertical drift cycles
      clouds.forEach((cloud, idx) => {
        cloud.position.x += Math.sin(elapsedTime * 0.08 + idx) * 0.005;
        cloud.position.y += 0.003;
        if (cloud.position.y > 25) {
          cloud.position.y = -235;
        }
      });

      // Flapping birds wing flap and flight coordinates
      birds.forEach((bird, idx) => {
        bird.position.x += Math.cos(elapsedTime * 0.4 + idx) * 0.015;
        bird.position.y += Math.sin(elapsedTime * 0.2 + idx) * 0.008;
        bird.scale.y = 0.5 + Math.sin(elapsedTime * 11 + idx) * 0.35;
      });

      // Waterfall offset animation (flowing water)
      waterfallTex1.offset.y -= 0.024;
      waterfallTex2.offset.y -= 0.024;

      // Project tree swaying wind effect
      projectTrees.forEach((tree, idx) => {
        tree.rotation.z = Math.sin(elapsedTime * 1.4 + idx) * 0.04;
      });

      // Apps Phone float
      if (phone1) {
        phone1.position.y = -99.5 + Math.sin(elapsedTime * 0.9) * 0.15;
        phone1.rotation.y = Math.sin(elapsedTime * 0.6) * 0.07;
      }
      if (phone2) {
        phone2.position.y = -99.5 + Math.cos(elapsedTime * 0.8) * 0.15;
        phone2.rotation.y = Math.cos(elapsedTime * 0.5) * 0.07;
      }

      // App Light Trail Travel Node
      if (lightNode) {
        const pathProgress = (elapsedTime * 0.15) % 1;
        const posOnCurve = trailCurve.getPointAt(pathProgress);
        lightNode.position.copy(posOnCurve);
      }

      // Services Bridge float
      bridgeMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.08;

      // Floating Sky Lanterns ascent
      lanterns.forEach((lantern, idx) => {
        lantern.position.y += 0.012;
        lantern.position.x += Math.sin(elapsedTime * 0.4 + idx) * 0.004;
        lantern.rotation.y += 0.003;
        if (lantern.position.y > -162) {
          lantern.position.y = -195;
        }
      });

      // Drifting Fireflies
      fireflies.forEach((ff, idx) => {
        ff.position.x += Math.sin(elapsedTime * 0.5 + idx) * 0.008;
        ff.position.y += Math.cos(elapsedTime * 0.3 + idx) * 0.008;
      });

      // Aurora curtain warping waves
      if (!isMobile) {
        const auroraPos = auroraGeom.attributes.position;
        for (let i = 0; i < auroraPos.count; i++) {
          const x = auroraPos.getX(i);
          const y = auroraPos.getY(i);
          const z = Math.sin(x * 0.12 + elapsedTime * 0.7) * Math.cos(y * 0.12 + elapsedTime * 0.4) * 1.6;
          auroraPos.setZ(i, z);
        }
        auroraPos.needsUpdate = true;
      }

      // Camera travel position tied to page scroll percentage
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      const targetCamPos = cameraCurve.getPointAt(scrollPercent);
      const finalTarget = targetCamPos.clone();

      if (!isMobile) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        // Parallax offset
        finalTarget.x += mouse.x * 2.2;
        finalTarget.y += mouse.y * 1.5;
      }

      camera.position.lerp(finalTarget, 0.08);
      camera.lookAt(0, camera.position.y - 3, -4);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();

      rayGeom.dispose();
      rayMat.dispose();

      cloudGeom.dispose();
      cloudMaterial.dispose();
      cloudTexture.dispose();

      mountainRanges.forEach((range) => {
        range.geometry.dispose();
        (range.material as THREE.Material).dispose();
      });

      birdGeom.dispose();
      birdMaterial.dispose();
      birdTexture.dispose();

      const disposeGroupMesh = (grp: THREE.Group | THREE.Mesh) => {
        grp.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const mat = child.material;
            if (mat instanceof THREE.MeshBasicMaterial && mat.map) {
              mat.map.dispose();
            }
            if (Array.isArray(mat)) {
              mat.forEach((m) => {
                if (m.map) m.map.dispose();
                m.dispose();
              });
            } else {
              mat.dispose();
            }
          }
        });
      };

      disposeGroupMesh(heroIsland);
      disposeGroupMesh(projectIsland1);
      disposeGroupMesh(projectIsland2);
      disposeGroupMesh(projectIsland3);
      disposeGroupMesh(project1);
      disposeGroupMesh(project2);
      disposeGroupMesh(project3);
      
      waterfallGeom.dispose();
      waterfallMat.dispose();
      waterfallTex1.dispose();
      waterfallTex2.dispose();

      disposeGroupMesh(demoIsland);
      disposeGroupMesh(phone1);
      disposeGroupMesh(phone2);
      
      trailGeom.dispose();
      trailMat.dispose();
      lightNodeGeom.dispose();
      lightNodeMat.dispose();

      disposeGroupMesh(servicesIslandL);
      disposeGroupMesh(servicesIslandR);
      bridgeGeom.dispose();
      bridgeMat.dispose();
      stoneGeom.dispose();
      stoneMat.dispose();

      skyLanternGeom.dispose();
      skyLanternMat.dispose();
      fireflyGeom.dispose();
      fireflyMat.dispose();

      summitGeom.dispose();
      summitMat.dispose();
      auroraGeom.dispose();
      auroraMat.dispose();
      logoGeom.dispose();
      logoMat.dispose();
      logoTex.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
