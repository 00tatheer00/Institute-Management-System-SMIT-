"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeHeroGlobeProps {
  themeColor?: string; // e.g., hex color like #06b6d4
  secondaryColor?: string;
  onNodeClick?: () => void;
}

export function ThreeHeroGlobe({
  themeColor = "#06b6d4",
  secondaryColor = "#10b981",
  onNodeClick,
}: ThreeHeroGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const innerSphereRef = useRef<THREE.LineSegments | null>(null);
  const ring1Ref = useRef<THREE.Line | null>(null);
  const ring2Ref = useRef<THREE.Line | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Center group for rotations
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    sphereGroupRef.current = mainGroup;

    // 3. Central Wireframe Icosahedron
    const geoIcosahedron = new THREE.IcosahedronGeometry(60, 2);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(themeColor),
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geoIcosahedron),
      wireframeMat
    );
    mainGroup.add(wireframe);
    innerSphereRef.current = wireframe;

    // 4. Point Cloud Particles along surface and ambient orbit
    const particleCount = 700;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(themeColor);
    const c2 = new THREE.Color(secondaryColor);

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on sphere with radius jitter
      const radius = 60 + (Math.random() - 0.5) * 35;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.sqrt(particleCount * Math.PI) * theta;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color mix
      const mixRatio = Math.random();
      const pColor = c1.clone().lerp(c2, mixRatio);
      particleColors[i * 3] = pColor.r;
      particleColors[i * 3 + 1] = pColor.g;
      particleColors[i * 3 + 2] = pColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite using procedural canvas texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);
    particlesRef.current = particles;

    // 5. Orbiting Tech Rings
    const createRing = (radius: number, tiltX: number, tiltY: number, color: string) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(120);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.45,
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createRing(85, Math.PI / 3, Math.PI / 6, themeColor);
    const ring2 = createRing(105, -Math.PI / 4, Math.PI / 4, secondaryColor);
    mainGroup.add(ring1);
    mainGroup.add(ring2);
    ring1Ref.current = ring1;
    ring2Ref.current = ring2;

    // 6. Interactive Floating Tech Nodes in Orbit
    const nodeCount = 6;
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(3, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
      wireframe: false,
    });

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
      node.position.set(Math.cos(angle) * 85, Math.sin(angle) * 85, 0);
      ring1.add(node);
      nodes.push(node);
    }

    // 7. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(themeColor, 2, 300);
    pointLight.position.set(50, 50, 80);
    scene.add(pointLight);

    // 8. Mouse / Pointer Tracking with Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        mainGroup.rotation.y += deltaX * 0.008;
        mainGroup.rotation.x += deltaY * 0.008;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousemove", handlePointerMove, { passive: true });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Constant gentle rotation
      if (!isDragging) {
        mainGroup.rotation.y += 0.004;
        mainGroup.rotation.x += 0.001;
      }

      // Parallax smooth lerp towards mouse
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      mainGroup.position.x = targetX * 18;
      mainGroup.position.y = -targetY * 18;

      // Spin orbital rings with varied speeds
      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.005;

      // Pulse particle wave
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // subtle breathing ripple
        const originalY = particlePositions[i3 + 1];
        positions[i3 + 1] = originalY + Math.sin(elapsedTime * 2 + i * 0.1) * 0.8;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);

      renderer.dispose();
      geoIcosahedron.dispose();
      particleGeo.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update colors when themeColor or secondaryColor changes
  useEffect(() => {
    if (!innerSphereRef.current || !particlesRef.current || !ring1Ref.current || !ring2Ref.current) return;

    const c1 = new THREE.Color(themeColor);
    const c2 = new THREE.Color(secondaryColor);

    (innerSphereRef.current.material as THREE.LineBasicMaterial).color = c1;
    (ring1Ref.current.material as THREE.LineBasicMaterial).color = c1;
    (ring2Ref.current.material as THREE.LineBasicMaterial).color = c2;

    const particleGeo = particlesRef.current.geometry;
    const colors = particleGeo.attributes.color.array as Float32Array;
    const count = colors.length / 3;

    for (let i = 0; i < count; i++) {
      const pColor = c1.clone().lerp(c2, Math.random());
      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }
    particleGeo.attributes.color.needsUpdate = true;
  }, [themeColor, secondaryColor]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full min-h-[380px] sm:min-h-[440px] cursor-grab active:cursor-grabbing select-none"
      onClick={onNodeClick}
      title="Click and drag to spin the 3D Tech Core!"
    />
  );
}
