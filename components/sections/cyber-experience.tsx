"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Globe, Cpu, Shield, Wifi, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CyberAtmosphere = dynamic(() => import("@/components/three/cyber-atmosphere"), {
  ssr: false,
  loading: () => <div className="cyber-scene-fallback absolute inset-0" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    icon: Eye,
    title: "Immersive Neon Worlds",
    description: "Full 3D cyberpunk environments with real-time bloom, volumetric fog, and neon reflections.",
    color: "#9dfcc7",
  },
  {
    icon: Globe,
    title: "Multiplayer Spaces",
    description: "Real-time shared virtual worlds where visitors explore and interact together.",
    color: "#85e8ff",
  },
  {
    icon: Cpu,
    title: "Custom Shader Pipeline",
    description: "Bespoke post-processing with bloom, chromatic aberration, and glitch effects.",
    color: "#9f91ff",
  },
  {
    icon: Zap,
    title: "60fps Everywhere",
    description: "Adaptive performance optimization across mobile to high-end desktop GPUs.",
    color: "#ff6b9d",
  },
  {
    icon: Shield,
    title: "WebGPU Ready",
    description: "Next-gen rendering with automatic fallback to WebGL for universal compatibility.",
    color: "#9dfcc7",
  },
  {
    icon: Wifi,
    title: "Real-time Sync",
    description: "WebSocket-powered state management for seamless multiplayer interactions.",
    color: "#85e8ff",
  },
];

const techStack = [
  "Three.js",
  "WebGL 2.0",
  "WebGPU",
  "GLSL Shaders",
  "Post-Processing",
  "Bloom Pipeline",
  "PartyKit",
  "WebSockets",
  "Vue/React",
  "GSAP",
];

export function CyberExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      /* ─── Scene reveal with parallax ─── */
      if (sceneRef.current) {
        gsap.fromTo(
          sceneRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "top 25%",
              scrub: 1,
            },
          }
        );
      }

      /* ─── Heading text reveal with neon flicker ─── */
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".cyber-heading-line");
        gsap.fromTo(
          lines,
          { y: 100, opacity: 0, skewY: 3 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1.3,
            stagger: 0.18,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* ─── Feature cards cascade ─── */
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".cyber-card");
        gsap.fromTo(
          cards,
          { y: 70, opacity: 0, scale: 0.9, rotateX: -8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        /* Neon border glow on hover */
        cards.forEach((card) => {
          const glow = card.querySelector(".cyber-card-neon");
          if (!glow) return;
          card.addEventListener("mouseenter", () => {
            gsap.to(glow, { opacity: 1, duration: 0.4, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(glow, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
          });
        });
      }

      /* ─── Tech stack badges stagger ─── */
      if (techRef.current) {
        const badges = techRef.current.querySelectorAll(".cyber-tech-badge");
        gsap.fromTo(
          badges,
          { y: 30, opacity: 0, scale: 0.85 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: techRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* ─── Parallax depth on cards ─── */
      if (cardsRef.current) {
        gsap.to(cardsRef.current, {
          y: -20,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="cyber-experience"
      className="cyber-section relative overflow-hidden py-28 md:py-44"
    >
      {/* Background layers */}
      <div className="cyber-bg absolute inset-0" aria-hidden="true" />
      <div className="cyber-grid-overlay absolute inset-0" aria-hidden="true" />
      <div className="cyber-noise absolute inset-0 opacity-[0.015]" aria-hidden="true" />

      {/* 3D Scene */}
      <div ref={sceneRef} className="absolute inset-0 z-[1]" aria-hidden="true">
        <CyberAtmosphere />
      </div>

      {/* Content */}
      <div className="container-shell relative z-10">
        {/* Section header */}
        <div ref={headingRef} className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#ff6b9d]/20 bg-[#080b0a]/60 px-3.5 py-2 text-[0.66rem] font-medium uppercase tracking-[0.15em] text-[#ff6b9d] backdrop-blur-xl"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff6b9d] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#ff6b9d] shadow-[0_0_10px_#ff6b9d]" />
            </span>
            Cyberpunk WebGL Experience
          </motion.div>

          <div className="mt-6 overflow-hidden">
            <h2 className="cyber-heading-line text-[clamp(2.4rem,5.8vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
              Neon-soaked
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="cyber-heading-line cyber-title-gradient text-[clamp(2.4rem,5.8vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              digital worlds.
            </h2>
          </div>

          <div className="overflow-hidden">
            <p className="cyber-heading-line mt-6 max-w-xl text-base leading-7 text-[#9ba5a0] md:text-lg md:leading-8">
              Immersive 3D environments inspired by cyberpunk aesthetics. Custom post-processing
              pipelines deliver neon bloom, volumetric fog, wet street reflections, and holographic
              displays that draw you into another dimension.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-24"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="cyber-card group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050608]/70 p-6 backdrop-blur-xl"
              >
                {/* Neon border glow on hover */}
                <div
                  className="cyber-card-neon pointer-events-none absolute inset-0 rounded-2xl opacity-0"
                  style={{
                    boxShadow: `inset 0 0 30px ${feature.color}15, 0 0 20px ${feature.color}08`,
                    border: `1px solid ${feature.color}30`,
                    borderRadius: "inherit",
                  }}
                  aria-hidden="true"
                />

                <div
                  className="relative grid size-10 place-items-center rounded-xl border border-white/[0.06]"
                  style={{ background: `${feature.color}08` }}
                >
                  <Icon size={18} style={{ color: feature.color }} />
                </div>

                <h3 className="relative mt-4 text-sm font-medium tracking-[-0.01em] text-white">
                  {feature.title}
                </h3>
                <p className="relative mt-2 text-[13px] leading-relaxed text-[#7a8380]">
                  {feature.description}
                </p>

                {/* Corner accent glow */}
                <div
                  className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full opacity-20 blur-2xl"
                  style={{ background: feature.color }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* Tech stack */}
        <div ref={techRef} className="mt-16 md:mt-24">
          <p className="mb-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#5e6763]">
            Powered by
          </p>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="cyber-tech-badge rounded-full border border-white/[0.06] bg-[#050608]/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#68716d] backdrop-blur-md transition-all duration-300 hover:border-[#ff6b9d]/25 hover:text-[#ff6b9d] hover:shadow-[0_0_15px_rgba(255,107,157,0.05)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050608] to-transparent"
        aria-hidden="true"
      />
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050608] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
