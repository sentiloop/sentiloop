"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gem, Hand, Layers, Move3d, RotateCcw, Sparkles } from "lucide-react";
import { LazyCanvas } from "@/components/three/lazy-canvas";

gsap.registerPlugin(ScrollTrigger);

const SplineScene = dynamic(() => import("@/components/three/spline-scene"), {
  ssr: false,
  loading: () => <div className="spline-scene-fallback absolute inset-0" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

const capabilities = [
  {
    icon: Gem,
    title: "Glass Materials",
    description: "Frosted glass with real-time refraction, chromatic aberration, and transmission.",
    color: "#9dfcc7",
  },
  {
    icon: Move3d,
    title: "Interactive Objects",
    description: "Hover and drag to interact. Every shape responds to your cursor with physics-based animation.",
    color: "#85e8ff",
  },
  {
    icon: RotateCcw,
    title: "Morphing Geometry",
    description: "Vertex-level displacement creates organic, ever-changing blob shapes in real-time.",
    color: "#9f91ff",
  },
  {
    icon: Layers,
    title: "Gradient Meshes",
    description: "Multi-color gradient materials with environment reflections and metallic sheen.",
    color: "#ff6b9d",
  },
  {
    icon: Hand,
    title: "Scroll-Driven 3D",
    description: "Scene elements animate and transform as you scroll, creating spatial storytelling.",
    color: "#9dfcc7",
  },
  {
    icon: Sparkles,
    title: "Post-Processing",
    description: "Real-time bloom, depth of field, and chromatic aberration for cinematic quality.",
    color: "#85e8ff",
  },
];

export function SplineExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      /* Heading reveal */
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".spline-heading-line");
        gsap.fromTo(
          lines,
          { y: 80, opacity: 0, rotateX: -10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* Cards cascade */
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".spline-card");
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.93 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 74%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* CTA fade in */
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="spline-experience"
      className="spline-section relative overflow-hidden py-28 md:py-44"
    >
      {/* Background */}
      <div className="spline-bg absolute inset-0" aria-hidden="true" />

      {/* 3D Scene */}
      <LazyCanvas className="absolute inset-0 z-[1]" fallbackClass="spline-scene-fallback">
        <div className="absolute inset-0" aria-hidden="true">
          <SplineScene />
        </div>
      </LazyCanvas>

      {/* Content */}
      <div className="container-shell relative z-10">
        {/* Header */}
        <div ref={headingRef} className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#9f91ff]/20 bg-[#080b0a]/60 px-3.5 py-2 text-[0.66rem] font-medium uppercase tracking-[0.15em] text-[#9f91ff] backdrop-blur-xl"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9f91ff] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#9f91ff] shadow-[0_0_10px_#9f91ff]" />
            </span>
            Interactive 3D Design
          </motion.div>

          <div className="mt-6 overflow-hidden">
            <h2 className="spline-heading-line text-[clamp(2.4rem,5.8vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
              Design in three
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="spline-heading-line spline-title-gradient text-[clamp(2.4rem,5.8vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              dimensions.
            </h2>
          </div>

          <div className="overflow-hidden">
            <p className="spline-heading-line mt-6 max-w-xl text-base leading-7 text-[#9ba5a0] md:text-lg md:leading-8">
              Interactive 3D experiences with glass materials, morphing geometry, and objects
              that respond to your every movement. Hover over the shapes to interact.
            </p>
          </div>
        </div>

        {/* Capability cards */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-24"
        >
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div
                key={index}
                className="spline-card group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050608]/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12]"
              >
                {/* Hover glow */}
                <div
                  className="spline-card-glow pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(300px circle at 50% 50%, ${cap.color}10, transparent 60%)`,
                  }}
                  aria-hidden="true"
                />

                <div
                  className="relative grid size-10 place-items-center rounded-xl border border-white/[0.06]"
                  style={{ background: `${cap.color}08` }}
                >
                  <Icon size={18} style={{ color: cap.color }} />
                </div>

                <h3 className="relative mt-4 text-sm font-medium tracking-[-0.01em] text-white">
                  {cap.title}
                </h3>
                <p className="relative mt-2 text-[13px] leading-relaxed text-[#7a8380]">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive hint */}
        <div
          ref={ctaRef}
          className="mt-16 flex flex-col items-center text-center md:mt-20"
        >
          <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-[#050608]/50 px-5 py-3 backdrop-blur-xl">
            <Hand size={14} className="text-[#9f91ff]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#68716d]">
              Hover & interact with the 3D shapes above
            </span>
          </div>
        </div>
      </div>

      {/* Fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050608] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050608] to-transparent" aria-hidden="true" />
    </section>
  );
}
