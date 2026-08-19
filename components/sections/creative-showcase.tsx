"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCreative,
  Parallax,
  Thumbs,
  Keyboard,
  Mousewheel,
  Autoplay,
  Pagination,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight, Layers, Cpu, Shield, Globe, Zap, Eye } from "lucide-react";
import { Reveal, MaskReveal } from "@/components/motion/reveal";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/parallax";
import "swiper/css/thumbs";
import "swiper/css/pagination";

const projects = [
  {
    id: 1,
    title: "Neural Threat Detection",
    subtitle: "AI-Powered Cybersecurity",
    description:
      "Real-time threat analysis using deep neural networks that detect zero-day attacks 47x faster than traditional SIEM systems.",
    image: "linear-gradient(135deg, #0a1628 0%, #1a0a28 50%, #0a1628 100%)",
    accent: "#9dfcc7",
    icon: Shield,
    stats: ["99.7% accuracy", "< 3ms response", "Zero false positives"],
    tag: "Cybersecurity",
  },
  {
    id: 2,
    title: "Quantum-Ready Blockchain",
    subtitle: "Post-Quantum Cryptography",
    description:
      "Enterprise blockchain infrastructure built with lattice-based cryptography, future-proofed against quantum computing threats.",
    image: "linear-gradient(135deg, #0a1220 0%, #0a2018 50%, #0a1220 100%)",
    accent: "#85e8ff",
    icon: Layers,
    stats: ["10,000 TPS", "256-bit quantum safe", "Cross-chain"],
    tag: "Blockchain",
  },
  {
    id: 3,
    title: "Autonomous SOC Platform",
    subtitle: "24/7 Intelligent Monitoring",
    description:
      "Self-learning security operations center that autonomously triages, investigates, and remediates incidents without human intervention.",
    image: "linear-gradient(135deg, #14080a 0%, #0a0814 50%, #14080a 100%)",
    accent: "#9f91ff",
    icon: Eye,
    stats: ["24/7 coverage", "85% auto-resolved", "12 integrations"],
    tag: "SOC",
  },
  {
    id: 4,
    title: "Edge AI Inference Engine",
    subtitle: "On-Device Intelligence",
    description:
      "Deploy production ML models at the edge with sub-millisecond latency. Built for IoT, autonomous systems, and real-time decisioning.",
    image: "linear-gradient(135deg, #0a1420 0%, #14100a 50%, #0a1420 100%)",
    accent: "#ff6b9d",
    icon: Cpu,
    stats: ["0.3ms latency", "ARM/x86/GPU", "Offline capable"],
    tag: "AI / ML",
  },
  {
    id: 5,
    title: "Global Cloud Mesh",
    subtitle: "Multi-Region Orchestration",
    description:
      "Intelligent workload distribution across 47 global regions with automatic failover, geo-routing, and compliance-aware data residency.",
    image: "linear-gradient(135deg, #080a14 0%, #0a1410 50%, #080a14 100%)",
    accent: "#9dfcc7",
    icon: Globe,
    stats: ["99.999% uptime", "47 regions", "Auto-scaling"],
    tag: "Cloud",
  },
  {
    id: 6,
    title: "Zero-Trust Architecture",
    subtitle: "Identity-First Security",
    description:
      "Complete zero-trust implementation with continuous verification, micro-segmentation, and context-aware adaptive access policies.",
    image: "linear-gradient(135deg, #0a0a18 0%, #18100a 50%, #0a0a18 100%)",
    accent: "#85e8ff",
    icon: Zap,
    stats: ["Passwordless", "Biometric MFA", "RBAC/ABAC"],
    tag: "Security",
  },
];

export function CreativeShowcase() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="creative-showcase-section section-pad relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-[15%] top-[20%] h-[500px] w-[600px] rounded-full bg-[#9dfcc7]/[0.02] blur-[150px]" />
        <div className="absolute right-[10%] bottom-[15%] h-[400px] w-[500px] rounded-full bg-[#9f91ff]/[0.02] blur-[120px]" />
      </div>

      <div className="container-shell relative">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Featured Work</span>
          </Reveal>
          <MaskReveal delay={0.06} className="-mb-2 pb-2">
            <h2 className="section-title mx-auto">
              Solutions that <span className="neon-text-mint">redefine</span> the standard.
            </h2>
          </MaskReveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-sm text-[#7a8a80] max-w-xl mx-auto">
              Navigate with arrow keys, scroll wheel, or swipe. Click thumbnails to jump.
            </p>
          </Reveal>
        </div>

        {/* Main Creative Effect Slider */}
        <div className="mt-14 relative">
          <Swiper
            modules={[EffectCreative, Parallax, Thumbs, Keyboard, Mousewheel, Autoplay, Pagination]}
            effect="creative"
            creativeEffect={{
              prev: {
                shadow: false,
                translate: ["-120%", 0, -500],
                rotate: [0, 0, -15],
                opacity: 0,
              },
              next: {
                shadow: false,
                translate: ["120%", 0, -500],
                rotate: [0, 0, 15],
                opacity: 0,
              },
            }}
            parallax
            speed={800}
            grabCursor
            keyboard={{ enabled: true, onlyInViewport: true }}
            mousewheel={{ forceToAxis: true, sensitivity: 0.5, thresholdDelta: 20 }}
            autoplay={{ delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, el: ".creative-pagination", type: "fraction" }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            onSwiper={(swiper) => { mainSwiperRef.current = swiper; }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="creative-main-swiper"
          >
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <SwiperSlide key={project.id}>
                  <div
                    className="creative-slide relative overflow-hidden rounded-[28px] border border-white/[0.06] p-8 md:p-12 min-h-[420px] md:min-h-[480px] flex flex-col justify-between"
                    style={{ background: project.image }}
                  >
                    {/* Parallax background layer */}
                    <div
                      className="absolute inset-0 opacity-30"
                      data-swiper-parallax="-300"
                      data-swiper-parallax-opacity="0.5"
                      aria-hidden="true"
                    >
                      <div
                        className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-[100px]"
                        style={{ background: project.accent }}
                      />
                    </div>

                    {/* Content with parallax depth layers */}
                    <div className="relative z-10">
                      {/* Tag + Icon */}
                      <div className="flex items-center justify-between">
                        <span
                          data-swiper-parallax="-100"
                          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] backdrop-blur-md"
                          style={{
                            borderColor: `${project.accent}30`,
                            color: project.accent,
                            background: `${project.accent}08`,
                          }}
                        >
                          <Icon size={12} />
                          {project.tag}
                        </span>
                      </div>

                      {/* Title — deeper parallax */}
                      <h3
                        data-swiper-parallax="-200"
                        data-swiper-parallax-opacity="0"
                        data-swiper-parallax-scale="0.9"
                        className="mt-6 text-[clamp(1.5rem,3.5vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.04em] text-white"
                      >
                        {project.title}
                      </h3>

                      {/* Subtitle */}
                      <p
                        data-swiper-parallax="-250"
                        data-swiper-parallax-opacity="0"
                        className="mt-2 text-sm font-medium"
                        style={{ color: project.accent }}
                      >
                        {project.subtitle}
                      </p>

                      {/* Description — deepest parallax */}
                      <p
                        data-swiper-parallax="-350"
                        data-swiper-parallax-opacity="0"
                        className="mt-4 max-w-md text-[13px] leading-relaxed text-[#8a9a90]"
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Stats at bottom */}
                    <div
                      data-swiper-parallax="-400"
                      data-swiper-parallax-opacity="0"
                      className="relative z-10 mt-8 flex flex-wrap gap-3"
                    >
                      {project.stats.map((stat) => (
                        <span
                          key={stat}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#b8c0bd] backdrop-blur-sm"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>

                    {/* Corner glow */}
                    <div
                      className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 opacity-20"
                      style={{ background: `radial-gradient(circle at 100% 100%, ${project.accent}, transparent 70%)` }}
                      aria-hidden="true"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation arrows */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => mainSwiperRef.current?.slidePrev()}
                className="creative-nav-btn grid size-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#8a9a90] backdrop-blur-md transition-all hover:border-[#9dfcc7]/30 hover:text-[#9dfcc7]"
                aria-label="Previous slide"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => mainSwiperRef.current?.slideNext()}
                className="creative-nav-btn grid size-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#8a9a90] backdrop-blur-md transition-all hover:border-[#9dfcc7]/30 hover:text-[#9dfcc7]"
                aria-label="Next slide"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Fraction pagination */}
            <div className="creative-pagination font-mono text-xs text-[#5e6763]" />
          </div>
        </div>

        {/* Thumbs Gallery */}
        <div className="mt-8">
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            spaceBetween={12}
            watchSlidesProgress
            className="creative-thumbs-swiper"
          >
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <SwiperSlide key={project.id} className="!w-auto">
                  <div
                    className={`creative-thumb cursor-pointer rounded-xl border px-4 py-3 transition-all duration-300 ${
                      activeIndex === index
                        ? "border-white/[0.15] bg-white/[0.05]"
                        : "border-white/[0.05] bg-white/[0.02] hover:border-white/[0.1]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={14}
                        style={{ color: activeIndex === index ? project.accent : "#5e6763" }}
                        className="transition-colors duration-300"
                      />
                      <span
                        className={`text-[11px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                          activeIndex === index ? "text-white" : "text-[#5e6763]"
                        }`}
                      >
                        {project.title}
                      </span>
                    </div>
                    {/* Active indicator bar */}
                    <div
                      className="mt-2 h-[2px] rounded-full transition-all duration-500"
                      style={{
                        background: activeIndex === index ? project.accent : "transparent",
                        width: activeIndex === index ? "100%" : "0%",
                      }}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Keyboard hint */}
        <div className="mt-6 flex items-center justify-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#4a5450]">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[8px]">←</kbd>
            <kbd className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[8px]">→</kbd>
            Navigate
          </span>
          <span className="size-0.5 rounded-full bg-[#4a5450]" />
          <span>Scroll to slide</span>
          <span className="size-0.5 rounded-full bg-[#4a5450]" />
          <span>Swipe on touch</span>
        </div>
      </div>
    </section>
  );
}
