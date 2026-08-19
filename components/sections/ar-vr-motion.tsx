"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Glasses, Layers3, Orbit, Scan, Sparkles, Waypoints } from "lucide-react";
import { LazyCanvas } from "@/components/three/lazy-canvas";

gsap.registerPlugin(ScrollTrigger);

const ARVRScene = dynamic(() => import("@/components/three/ar-vr-scene"), {
  ssr: false,
  loading: () => <div className="ar-vr-scene-fallback absolute inset-0" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

const capabilities = [
  {
    icon: Glasses,
    title: "Immersive VR Experiences",
    description: "Full 360-degree virtual environments for training, simulation, and collaboration.",
    color: "#9dfcc7",
  },
  {
    icon: Scan,
    title: "AR Overlay Systems",
    description: "Real-time augmented reality interfaces for field operations and remote guidance.",
    color: "#85e8ff",
  },
  {
    icon: Layers3,
    title: "3D Motion Capture",
    description: "High-fidelity motion tracking for digital twins, animation, and spatial computing.",
    color: "#9f91ff",
  },
  {
    icon: Orbit,
    title: "Spatial Analytics",
    description: "Volumetric data visualization with gesture-based interaction paradigms.",
    color: "#9dfcc7",
  },
  {
    icon: Waypoints,
    title: "Mixed Reality Workflows",
    description: "Seamless blending of physical and digital processes for enterprise teams.",
    color: "#85e8ff",
  },
  {
    icon: Sparkles,
    title: "Generative 3D Content",
    description: "AI-powered creation of immersive environments, assets, and interactive scenes.",
    color: "#9f91ff",
  },
];

const stats = [
  { value: "120", suffix: "fps", label: "Render Performance" },
  { value: "6", suffix: "DoF", label: "Tracking Freedom" },
  { value: "<12", suffix: "ms", label: "Motion Latency" },
  { value: "8K", suffix: "×2", label: "Visual Fidelity" },
];

export function ARVRMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      /* ─── Scene parallax on scroll ─── */
      if (sceneWrapperRef.current) {
        gsap.fromTo(
          sceneWrapperRef.current,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 0.8,
            },
          }
        );
      }

      /* ─── Heading reveal ─── */
      if (headingRef.current) {
        const headingElements = headingRef.current.querySelectorAll(".ar-vr-heading-line");
        gsap.fromTo(
          headingElements,
          { y: 80, opacity: 0, rotateX: -15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* ─── Capability cards stagger ─── */
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".ar-vr-card");
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          }
        );

        /* Hover glow pulse on cards */
        cards.forEach((card) => {
          const glowEl = card.querySelector(".ar-vr-card-glow");
          if (!glowEl) return;

          card.addEventListener("mouseenter", () => {
            gsap.to(glowEl, { opacity: 1, scale: 1.15, duration: 0.5, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(glowEl, { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.inOut" });
          });
        });
      }

      /* ─── Stats counter animation ─── */
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".ar-vr-stat");
        gsap.fromTo(
          statItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        /* Number count-up effect */
        const valueEls = statsRef.current.querySelectorAll(".ar-vr-stat-value");
        valueEls.forEach((el) => {
          const target = el.getAttribute("data-value") || "0";
          const numericPart = parseInt(target.replace(/\D/g, ""), 10);
          const prefix = target.replace(/\d/g, "");

          if (!isNaN(numericPart)) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: numericPart,
              duration: 2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
              onUpdate: () => {
                (el as HTMLElement).textContent = prefix + Math.round(obj.val).toString();
              },
            });
          }
        });
      }

      /* ─── Floating badges parallax ─── */
      const badges = document.querySelectorAll(".ar-vr-badge");
      badges.forEach((badge, i) => {
        gsap.to(badge, {
          y: -30 - i * 10,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="ar-vr"
      className="ar-vr-section relative overflow-hidden py-28 md:py-40"
    >
      {/* Background gradient layers */}
      <div className="ar-vr-bg-gradient absolute inset-0" aria-hidden="true" />
      <div className="ar-vr-grid-overlay absolute inset-0 opacity-30" aria-hidden="true" />

      {/* 3D Scene */}
      <LazyCanvas
        className="absolute inset-0 z-[1]"
        fallbackClass="ar-vr-scene-fallback"
      >
        <div ref={sceneWrapperRef} className="absolute inset-0" aria-hidden="true">
          <ARVRScene />
        </div>
      </LazyCanvas>

      {/* Content Layer */}
      <div className="container-shell relative z-10">
        {/* Header */}
        <div ref={headingRef} className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#080b0a]/60 px-3.5 py-2 text-[0.66rem] font-medium uppercase tracking-[0.15em] text-[#b9c1bd] backdrop-blur-xl"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#85e8ff] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#85e8ff] shadow-[0_0_10px_#85e8ff]" />
            </span>
            AR / VR Motion Graphics
          </motion.div>

          <div className="mt-6 overflow-hidden">
            <h2 className="ar-vr-heading-line text-[clamp(2.4rem,5.8vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
              Step inside the
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="ar-vr-heading-line ar-vr-title-gradient text-[clamp(2.4rem,5.8vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              dimension of data.
            </h2>
          </div>

          <div className="overflow-hidden">
            <p className="ar-vr-heading-line mt-6 max-w-xl text-base leading-7 text-[#9ba5a0] md:text-lg md:leading-8">
              Spatial computing meets enterprise intelligence. We build immersive AR/VR experiences
              powered by real-time 3D rendering, motion capture, and AI-driven interaction systems.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          ref={statsRef}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mt-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="ar-vr-stat ar-vr-stat-card rounded-2xl border border-white/[0.06] bg-[#080b0a]/50 p-5 backdrop-blur-lg"
            >
              <div className="flex items-baseline gap-1">
                <span
                  className="ar-vr-stat-value text-2xl font-semibold tracking-tight text-white md:text-3xl"
                  data-value={stat.value}
                >
                  0
                </span>
                <span className="text-sm font-medium text-[#9dfcc7]">{stat.suffix}</span>
              </div>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#5e6763]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Capability Cards Grid */}
        <div
          ref={cardsRef}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-24"
        >
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <div
                key={index}
                className="ar-vr-card group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080b0a]/50 p-6 backdrop-blur-lg transition-colors duration-300 hover:border-white/[0.12]"
              >
                {/* Hover glow */}
                <div
                  className="ar-vr-card-glow pointer-events-none absolute -inset-px rounded-2xl opacity-0"
                  style={{
                    background: `radial-gradient(400px circle at 50% 50%, ${cap.color}12, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />

                <div
                  className="relative grid size-10 place-items-center rounded-xl border border-white/[0.06]"
                  style={{ background: `${cap.color}0a` }}
                >
                  <Icon size={18} style={{ color: cap.color }} />
                </div>

                <h3 className="relative mt-4 text-sm font-medium tracking-[-0.01em] text-white">
                  {cap.title}
                </h3>
                <p className="relative mt-2 text-[13px] leading-relaxed text-[#7a8380]">
                  {cap.description}
                </p>

                {/* Corner accent */}
                <div
                  className="absolute right-0 top-0 size-16 opacity-20"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${cap.color}, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* Floating Tech Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 md:mt-24">
          {["Three.js", "WebXR", "GSAP", "WebGL 2.0", "Motion Capture", "Spatial Audio", "6DoF Tracking", "Neural Rendering"].map(
            (tech) => (
              <span
                key={tech}
                className="ar-vr-badge rounded-full border border-white/[0.06] bg-[#080b0a]/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#68716d] backdrop-blur-md transition-colors duration-300 hover:border-[#9dfcc7]/20 hover:text-[#9dfcc7]"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050608] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
