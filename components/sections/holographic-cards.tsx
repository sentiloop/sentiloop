"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Brain,
  Globe,
  Layers,
  Signal,
  Zap,
} from "lucide-react";
import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";
import { MaskReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const cards = [
  {
    icon: Brain,
    label: "Neural Threads",
    value: "2.4M",
    unit: "signals/sec",
    status: "Active",
    color: "#62d9ff",
  },
  {
    icon: Activity,
    label: "Sentiment Flux",
    value: "96.8%",
    unit: "confidence",
    status: "Nominal",
    color: "#9dfcc7",
  },
  {
    icon: Signal,
    label: "Signal Depth",
    value: "128",
    unit: "layers",
    status: "Deep scan",
    color: "#a99cff",
  },
  {
    icon: Zap,
    label: "Loop Velocity",
    value: "18ms",
    unit: "response",
    status: "Optimal",
    color: "#62d9ff",
  },
  {
    icon: Globe,
    label: "Coverage",
    value: "47",
    unit: "markets",
    status: "Expanding",
    color: "#85e8ff",
  },
  {
    icon: Layers,
    label: "Stack Depth",
    value: "12",
    unit: "integrations",
    status: "Connected",
    color: "#9dfcc7",
  },
];

function HoloCard({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -14;
      const rotateY = (x - 0.5) * 14;
      cardRef.current.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
      cardRef.current.style.setProperty("--holo-x", `${x * 100}%`);
      cardRef.current.style.setProperty("--holo-y", `${y * 100}%`);
    },
    [reducedMotion],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="holo-card group"
      style={{ "--holo-accent": color } as React.CSSProperties}
    >
      {/* Holographic shimmer layer */}
      <div className="holo-shimmer" aria-hidden="true" />
      {/* Animated border */}
      <div className="holo-border" aria-hidden="true" />
      {/* Scan line */}
      <div className="holo-scanline" aria-hidden="true" />
      {/* Content */}
      <div className="holo-content">{children}</div>
    </div>
  );
}

export function HolographicCards() {
  return (
    <section className="section-pad relative overflow-hidden">
      {/* Ambient neon fog */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-[10%] top-[20%] h-[400px] w-[500px] rounded-full bg-[#62d9ff]/[0.04] blur-[120px]" />
        <div className="absolute right-[5%] bottom-[15%] h-[350px] w-[450px] rounded-full bg-[#a99cff]/[0.035] blur-[100px]" />
      </div>

      <div className="container-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Live telemetry</span>
          </Reveal>
          <MaskReveal delay={0.06} className="-mb-2 pb-2">
            <h2 className="section-title mx-auto">
              Holographic <span className="neon-text-cyan">signal matrix.</span>
            </h2>
          </MaskReveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#929b97] md:text-lg">
              Real-time neural telemetry rendered as interactive holographic data surfaces.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1} amount={0.08}>
          {cards.map((card) => (
            <StaggerItem key={card.label} preset="scale">
              <HoloCard color={card.color}>
                <div className="flex items-center justify-between">
                  <div
                    className="grid size-10 place-items-center rounded-xl border border-white/10"
                    style={{ background: `${card.color}12`, boxShadow: `0 0 20px ${card.color}22` }}
                  >
                    <card.icon size={18} style={{ color: card.color }} strokeWidth={1.6} />
                  </div>
                  <span className="holo-status" style={{ color: card.color }}>
                    <span className="holo-status-dot" style={{ background: card.color, boxShadow: `0 0 8px ${card.color}` }} />
                    {card.status}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#5e7a8e]">
                    {card.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-medium tracking-[-0.06em] text-white md:text-4xl">
                      {card.value}
                    </span>
                    <span className="text-xs text-[#5e7a8e]">{card.unit}</span>
                  </div>
                </div>
                {/* Data line visualization */}
                <div className="mt-5 h-px w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.5, ease: "linear", repeat: Infinity, repeatDelay: 3 }}
                  />
                </div>
              </HoloCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
