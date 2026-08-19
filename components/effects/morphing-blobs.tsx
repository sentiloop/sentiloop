"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface MorphingBlobsProps {
  className?: string;
  colors?: string[];
  count?: number;
}

function generateBlobPath(seed: number, radius: number): string {
  const points = 8;
  const angleStep = (Math.PI * 2) / points;
  const coords: string[] = [];

  for (let i = 0; i < points; i++) {
    const angle = angleStep * i;
    const variation = 0.6 + Math.sin(seed + i * 1.7) * 0.4;
    const r = radius * variation;
    const x = 200 + Math.cos(angle) * r;
    const y = 200 + Math.sin(angle) * r;
    coords.push(`${x},${y}`);
  }

  // Smooth closed path using cubic bezier approximation
  let d = `M ${coords[0]}`;
  for (let i = 0; i < points; i++) {
    const curr = coords[i].split(",").map(Number);
    const next = coords[(i + 1) % points].split(",").map(Number);
    const midX = (curr[0] + next[0]) / 2;
    const midY = (curr[1] + next[1]) / 2;
    d += ` Q ${curr[0]},${curr[1]} ${midX},${midY}`;
  }
  d += " Z";
  return d;
}

export function MorphingBlobs({
  className,
  colors = ["#62d9ff", "#a99cff", "#9dfcc7"],
  count = 3,
}: MorphingBlobsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const paths = containerRef.current!.querySelectorAll<SVGPathElement>(".morph-path");

      paths.forEach((path, i) => {
        const shape1 = generateBlobPath(i * 2.3, 140 + i * 20);
        const shape2 = generateBlobPath(i * 4.1 + 1, 160 + i * 15);
        const shape3 = generateBlobPath(i * 5.7 + 2, 130 + i * 25);

        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(path, {
          attr: { d: shape2 },
          duration: 6 + i * 2,
          ease: "sine.inOut",
        });
        tl.to(path, {
          attr: { d: shape3 },
          duration: 7 + i * 1.5,
          ease: "sine.inOut",
        });
        tl.to(path, {
          attr: { d: shape1 },
          duration: 5 + i * 2.5,
          ease: "sine.inOut",
        });

        // Slow drift
        gsap.to(path.closest("svg"), {
          x: `+=${20 + i * 10}`,
          y: `+=${15 - i * 8}`,
          duration: 10 + i * 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reduced, count]);

  const blobs = Array.from({ length: count }, (_, i) => {
    const size = 400 + (i * 100) % 200;
    const left = 10 + ((i * 37) % 60);
    const top = 10 + ((i * 53) % 60);
    const initialPath = generateBlobPath(i * 3, 140 + i * 20);

    return (
      <svg
        key={i}
        className="absolute"
        width={size}
        height={size}
        viewBox="0 0 400 400"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
          opacity: 0.06,
        }}
        aria-hidden="true"
      >
        <path
          className="morph-path"
          d={initialPath}
          fill={colors[i % colors.length]}
        />
      </svg>
    );
  });

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
    >
      {blobs}
    </div>
  );
}
