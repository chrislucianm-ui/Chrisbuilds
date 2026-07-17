"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeCanvasProps {
  type: "earth" | "saturn" | "mobile" | "ai";
}

export default function ThreeCanvas({ type }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Setup Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Resize handler
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener("resize", resize);

    // 2. Setup High-End Cinematic Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(5, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x88aaff, 2.0);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // 3. Populate Scene based on type
    const group = new THREE.Group();
    scene.add(group);

    let updateAnimation: (time: number) => void = () => {};

    if (type === "earth") {
      // Procedural Earth shader with landmasses, night city lights, and atmosphere Fresnel halo
      const earthGeo = new THREE.SphereGeometry(1.8, 64, 64);
      
      const earthMat = new THREE.ShaderMaterial({
        uniforms: {
          uSunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying vec3 vWorldPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          varying vec3 vWorldPosition;
          uniform vec3 uSunDirection;

          float hash(vec3 p) {
            p = fract(p * 0.3183099 + vec3(0.1));
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
          }
          float noise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                           mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                           mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
          }
          float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            vec3 shift = vec3(100.0);
            for (int i = 0; i < 4; ++i) {
              v += a * noise(p);
              p = p * 2.0 + shift;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float dotNL = dot(normal, uSunDirection);
            
            float land = fbm(vWorldPosition * 2.2);
            vec3 oceanColor = vec3(0.01, 0.03, 0.09);
            vec3 landColor = vec3(0.08, 0.11, 0.10);
            vec3 baseColor = mix(oceanColor, landColor, step(0.48, land));
            
            vec3 dayColor = baseColor * max(dotNL, 0.0);
            
            // Night-side glowing cities
            float cityNoise = noise(vWorldPosition * 14.0);
            vec3 cityLights = vec3(0.95, 0.85, 0.60) * step(0.66, cityNoise) * 0.45;
            vec3 nightColor = cityLights * max(0.0, -dotNL);
            
            vec3 finalColor = dayColor + nightColor;
            
            // Atmospheric scattering rim
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
            vec3 atmosphereGlow = vec3(0.45, 0.60, 0.85) * fresnel * 0.75;
            
            gl_FragColor = vec4(finalColor + atmosphereGlow, 1.0);
          }
        `,
      });

      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      group.add(earthMesh);

      updateAnimation = (time) => {
        // Slow natural rotation
        earthMesh.rotation.y = time * 0.0001;
      };

    } else if (type === "saturn") {
      // Metallic Saturn sphere with chrome rings
      const planetGeo = new THREE.SphereGeometry(1.3, 64, 64);
      const planetMat = new THREE.MeshStandardMaterial({
        color: 0x18181c,
        metalness: 0.95,
        roughness: 0.18,
      });
      const planet = new THREE.Mesh(planetGeo, planetMat);
      group.add(planet);

      // Chrome rings
      const ringGeo = new THREE.RingGeometry(1.6, 2.8, 128);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xbbbbcc,
        metalness: 0.9,
        roughness: 0.08,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // Tilted planet axis
      group.rotation.z = 0.32;
      group.rotation.x = 0.15;

      updateAnimation = (time) => {
        planet.rotation.y = time * 0.00015;
        ring.rotation.z = -time * 0.00008;
      };

    } else if (type === "mobile") {
      // Futuristic dark planet with glowing connectivity paths
      const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x050508,
        metalness: 0.9,
        roughness: 0.3,
      });
      const baseSphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(baseSphere);

      // Glowing geodesic connectivity lines
      const linesGroup = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });

      for (let i = 0; i < 15; i++) {
        const points: THREE.Vector3[] = [];
        const radius = 1.52;
        const phiStart = Math.random() * Math.PI * 2;
        const thetaStart = Math.random() * Math.PI;

        for (let j = 0; j <= 24; j++) {
          const phi = phiStart + (j / 24) * 0.6;
          const theta = thetaStart + (j / 24) * 0.3;
          const x = radius * Math.sin(theta) * Math.cos(phi);
          const y = radius * Math.sin(theta) * Math.sin(phi);
          const z = radius * Math.cos(theta);
          points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
        const line = new THREE.Line(geo, lineMat);
        linesGroup.add(line);
      }
      group.add(linesGroup);

      updateAnimation = (time) => {
        group.rotation.y = time * 0.00008;
        group.rotation.x = Math.sin(time * 0.0002) * 0.05;
      };

    } else if (type === "ai") {
      // AGI Core: floating mirror black chrome core surrounded by an orbital particle disk
      const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x020202,
        metalness: 1.0,
        roughness: 0.03,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // Outer delicate neural pathway wireframe shell
      const shellGeo = new THREE.SphereGeometry(1.22, 32, 32);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);

      // Rotating floating AGI particle disk
      const pCount = 140;
      const pGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(pCount * 3);
      const pAngles = new Float32Array(pCount);
      const pRadii = new Float32Array(pCount);
      const pSpeeds = new Float32Array(pCount);

      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.6 + Math.random() * 0.7;
        pAngles[i] = angle;
        pRadii[i] = radius;
        pSpeeds[i] = 0.002 + Math.random() * 0.003;

        pPositions[i * 3] = radius * Math.cos(angle);
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4; // Orbital plane width
        pPositions[i * 3 + 2] = radius * Math.sin(angle);
      }

      pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(pGeo, pMat);
      group.add(particles);

      updateAnimation = (time) => {
        // Slow levitation drift
        group.position.y = Math.sin(time * 0.001) * 0.12;
        core.rotation.y = time * 0.00015;
        shell.rotation.y = -time * 0.00008;

        // Animate disk particles
        const pos = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < pCount; i++) {
          pAngles[i] += pSpeeds[i];
          pos[i * 3] = pRadii[i] * Math.cos(pAngles[i]);
          pos[i * 3 + 2] = pRadii[i] * Math.sin(pAngles[i]);
        }
        pGeo.attributes.position.needsUpdate = true;
      };
    }

    // 4. Render loop with IntersectionObserver optimization
    let rafId: number;
    let isVisible = false;

    const render = (time: number) => {
      if (!isVisible) return;
      updateAnimation(time);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };

    // IntersectionObserver tracks if the canvas is inside the viewport to pause loops when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      renderer.dispose();
      scene.clear();
    };
  }, [type]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />
    </div>
  );
}
