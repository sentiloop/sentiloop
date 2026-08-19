"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Eye,
  Fingerprint,
  Network,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";
import { MaskReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const features = [
  {
    icon: Brain,
    title: "Neural Processing",
    description:
      "Deep contextual understanding that maps emotion, intent, and urgency across millions of signals in real time.",
    color: "#9dfcc7",
    gradient: "from-[#9dfcc7]/20 to-[#45dc92]/5",
  },
  {
    icon: Radar,
    title: "Predictive Sensing",
    description:
      "Anticipate customer needs before they surface. Pattern recognition trained on billions of behavioral data points.",
    color: "#85e8ff",
    gradient: "from-[#85e8ff]/20 to-[#3bb8d9]/5",
  },
  {
    icon: Sparkles,
    title: "Generative Insights",
    description:
      "Transform raw data into actionable narratives. Every insight comes with confidence scores and evidence trails.",
    color: "#a99cff",
    gradient: "from-[#a99cff]/20 to-[#7b6bdb]/5",
  },
  {
    icon: Network,
    title: "Semantic Graph",
    description:
      "A living knowledge graph that connects themes, customers, and outcomes into one navigable intelligence map.",
    color: "#9dfcc7",
    gradient: "from-[#9dfcc7]/20 to-[#45dc92]/5",
  },
  {
    icon: Eye,
    title: "Anomaly Detection",
    description:
      "Spot the signal in the noise. Automated alerting when sentiment shifts breach confidence thresholds.",
    color: "#85e8ff",
    gradient: "from-[#85e8ff]/20 to-[#3bb8d9]/5",
  },
  {
    icon: ShieldCheck,
    title: "Trust Architecture",
    description:
      "Enterprise-grade privacy with on-premise deployment options. Your data never leaves your boundary.",
    color: "#a99cff",
    gradient: "from-[#a99cff]/20 to-[#7b6bdb]/5",
  },
  {
    icon: Waves,
    title: "Emotion Mapping",
    description:
      "Go beyond positive and negative. Nuanced emotional taxonomies reveal the real story behind every interaction.",
    color: "#9dfcc7",
    gradient: "from-[#9dfcc7]/20 to-[#45dc92]/5",
  },
  {
    icon: ScanSearch,
    title: "Root Cause Engine",
    description:
      "Automatically trace customer friction back to product decisions, policy changes, or operational gaps.",
    color: "#85e8ff",
    gradient: "from-[#85e8ff]/20 to-[#3bb8d9]/5",
  },
  {
    icon: Fingerprint,
    title: "Identity Resolution",
    description:
      "Unify fragmented customer signals across channels into coherent individual and cohort stories.",
    color: "#a99cff",
    gradient: "from-[#a99cff]/20 to-[#7b6bdb]/5",
  },
];

function TiltCard({
  children,
  color,
  className = "",
}: {
  children: ReactNode;
  color: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;
      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      cardRef.current.style.setProperty("--light-x", `${x * 100}%`);
      cardRef.current.style.setProperty("--light-y", `${y * 100}%`);
      cardRef.current.style.setProperty("--glow-color", color);
    },
    [reducedMotion, color],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    cardRef.current.style.setProperty("--light-x", "50%");
    cardRef.current.style.setProperty("--light-y", "50%");
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`ai-card group ${className}`}
      style={
        {
          "--glow-color": color,
          "--light-x": "50%",
          "--light-y": "50%",
        } as React.CSSProperties
      }
    >
      <div className="ai-card-border" aria-hidden="true" />
      <div className="ai-card-glow" aria-hidden="true" />
      <div className="ai-card-lighting" aria-hidden="true" />
      <div className="ai-card-content">{children}</div>
    </div>
  );
}

export function AIShowcase() {
  return (
    <section id="ai-features" className="ai-showcase section-pad relative overflow-hidden">
      {/* Animated background */}
      <div className="ai-bg-aurora" aria-hidden="true" />
      <div className="ai-bg-grid" aria-hidden="true" />
      <div className="ai-bg-orbs" aria-hidden="true">
        <span className="ai-orb ai-orb-1" />
        <span className="ai-orb ai-orb-2" />
        <span className="ai-orb ai-orb-3" />
      </div>

      <div className="container-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">AI capabilities</span>
          </Reveal>
          <MaskReveal delay={0.06} className="-mb-2 pb-2">
            <h2 className="section-title mx-auto">
              Intelligence that feels like{" "}
              <span className="ai-title-gradient">intuition.</span>
            </h2>
          </MaskReveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#929b97] md:text-lg">
              Nine core AI systems work together to transform scattered customer
              signals into clear, confident action your entire company can trust.
            </p>
          </Reveal>
        </div>

        <Stagger
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
          amount={0.08}
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title} preset="scale">
              <TiltCard color={feature.color}>
                <div
                  className={`ai-card-icon-well bg-gradient-to-br ${feature.gradient}`}
                  style={{ boxShadow: `0 0 32px ${feature.color}22` }}
                >
                  <feature.icon
                    size={20}
                    strokeWidth={1.6}
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="mt-5 text-[1.05rem] font-medium tracking-[-0.03em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[0.8rem] leading-[1.6] text-[#7f8884]">
                  {feature.description}
                </p>
                <motion.div
                  className="ai-card-hover-indicator"
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "2.5rem", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ background: feature.color }}
                />
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
