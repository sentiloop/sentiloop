"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Global ambient floating particles with fog effect.
 * Renders a lightweight canvas across the entire viewport.
 * Respects prefers-reduced-motion.
 */
export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      pulse: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 18));

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * 0.5;
      canvas!.height = height * 0.5;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
    }

    function init() {
      resize();
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width * 0.5,
          y: Math.random() * height * 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1 - 0.05,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          hue: Math.random() > 0.6 ? 270 : 190,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width * 0.5, height * 0.5);

      // Fog gradient overlay
      const fogGrad = ctx!.createRadialGradient(
        width * 0.25, height * 0.25, 0,
        width * 0.25, height * 0.25, width * 0.35
      );
      fogGrad.addColorStop(0, "rgba(5, 6, 8, 0)");
      fogGrad.addColorStop(0.7, "rgba(5, 6, 8, 0)");
      fogGrad.addColorStop(1, "rgba(5, 6, 8, 0.4)");
      ctx!.fillStyle = fogGrad;
      ctx!.fillRect(0, 0, width * 0.5, height * 0.5);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap around
        if (p.x < -5) p.x = width * 0.5 + 5;
        if (p.x > width * 0.5 + 5) p.x = -5;
        if (p.y < -5) p.y = height * 0.5 + 5;
        if (p.y > height * 0.5 + 5) p.y = -5;

        const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        const glow = p.size * 3;

        // Glow
        ctx!.beginPath();
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${currentOpacity * 0.3})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
        ctx!.fillStyle = grad;
        ctx!.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.fillStyle = `hsla(${p.hue}, 85%, 75%, ${currentOpacity})`;
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-60"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
