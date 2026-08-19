"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  maxLife: number;
}

const MAX_PARTICLES = 60;
const FADE_FRAMES = 40;

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const shouldHide = () => reducedMotion.matches || coarsePointer.matches;
    setHidden(shouldHide());

    const handler = () => setHidden(shouldHide());
    reducedMotion.addEventListener("change", handler);
    coarsePointer.addEventListener("change", handler);
    return () => {
      reducedMotion.removeEventListener("change", handler);
      coarsePointer.removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hidden) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;

    const particles: Particle[] = [];
    let head = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * 0.5);
      canvas!.height = Math.floor(height * 0.5);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
    }

    function spawnParticle() {
      const vxInherit = (mouseX - prevMouseX) * 0.15;
      const vyInherit = (mouseY - prevMouseY) * 0.15;

      const p: Particle = {
        x: mouseX * 0.5,
        y: mouseY * 0.5,
        vx: vxInherit + (Math.random() - 0.5) * 0.8,
        vy: vyInherit + (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 2,
        hue: Math.floor(Math.random() * 80) + 190,
        life: FADE_FRAMES,
        maxLife: FADE_FRAMES,
      };

      if (particles.length < MAX_PARTICLES) {
        particles.push(p);
      } else {
        particles[head] = p;
      }
      head = (head + 1) % MAX_PARTICLES;
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        if (p.life <= 0) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life--;

        const alpha = p.life / p.maxLife;
        const radius = p.size * alpha;

        ctx!.beginPath();
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.5);
        grad.addColorStop(0, `hsla(${p.hue}, 85%, 70%, ${alpha * 0.6})`);
        grad.addColorStop(1, `hsla(${p.hue}, 85%, 70%, 0)`);
        ctx!.fillStyle = grad;
        ctx!.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.fillStyle = `hsla(${p.hue}, 90%, 80%, ${alpha})`;
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      spawnParticle();
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
