"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeParticleMeshProps {
  color?: string;
  className?: string;
}

export function ThreeParticleMesh({
  color = "#06b6d4",
  className = "absolute inset-0 w-full h-full pointer-events-none opacity-40",
}: ThreeParticleMeshProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 45, 90);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Turn off antialias for particle grid for maximum performance
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Particle Wave Grid
    const cols = 40;
    const rows = 25;
    const numParticles = cols * rows;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    const spacing = 7;
    let index = 0;

    for (let ix = 0; ix < cols; ix++) {
      for (let iy = 0; iy < rows; iy++) {
        positions[index * 3] = (ix - cols / 2) * spacing;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = (iy - rows / 2) * spacing;
        scales[index] = 1;
        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Particle Material
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 2.5,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // Resize Observer
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

    // Render loop
    let animationFrameId: number;
    let count = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      count += 0.04;

      const posArray = geometry.attributes.position.array as Float32Array;
      let i = 0;

      for (let ix = 0; ix < cols; ix++) {
        for (let iy = 0; iy < rows; iy++) {
          const i3 = i * 3;
          // Dual sine wave ripple
          posArray[i3 + 1] =
            Math.sin(ix * 0.3 + count) * 4 +
            Math.sin(iy * 0.4 + count) * 4 +
            mouseY * 4;
          i++;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Gentle camera sway
      camera.position.x += (mouseX * 20 - camera.position.x) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handlePointerMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color]);

  return <div ref={mountRef} className={className} />;
}
