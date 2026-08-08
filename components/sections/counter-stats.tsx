"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: 90, suffix: "+", label: "Technology capabilities", color: "#62d9ff" },
  { value: 6, suffix: "", label: "Service ecosystems", color: "#9dfcc7" },
  { value: 24, suffix: "/7", label: "Security monitoring", color: "#a99cff" },
  { value: 99, suffix: ".9%", label: "Uptime guaranteed", color: "#85e8ff" },
];

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function StatCounter({ stat, trigger }: { stat: Stat; trigger: boolean }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const animate = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplay(stat.value);
      return;
    }

    const duration = 2000;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setDisplay(Math.round(eased * stat.value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
  }, [stat.value, prefersReducedMotion]);

  useEffect(() => {
    if (trigger) {
      if (prefersReducedMotion) {
        setDisplay(stat.value);
      } else {
        animate();
      }
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [trigger, animate, stat.value, prefersReducedMotion]);

  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <p
        className="text-5xl font-semibold tracking-tight md:text-6xl"
        style={{ color: stat.color }}
        aria-label={`${stat.value}${stat.suffix}`}
      >
        {display}
        <span className="text-3xl md:text-4xl">{stat.suffix}</span>
      </p>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#929b97]">
        {stat.label}
      </p>
    </div>
  );
}

export function CounterStats() {
  const [triggered, setTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-pad" aria-label="Key metrics">
      <div className="container-shell">
        <SectionHeading
          eyebrow="By the numbers"
          title="Engineered for scale"
          centered
        />

        <Reveal delay={0.1}>
          <div
            ref={sectionRef}
            className="glass-panel mt-16 grid grid-cols-1 rounded-3xl md:grid-cols-2 lg:grid-cols-4"
            role="list"
            aria-label="Statistics"
          >
            {stats.map((stat) => (
              <div key={stat.label} role="listitem">
                <StatCounter stat={stat} trigger={triggered} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
