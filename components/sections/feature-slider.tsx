"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Autoplay, FreeMode, Keyboard, Mousewheel, Pagination } from "swiper/modules";
import {
  Brain,
  Eye,
  Fingerprint,
  Globe,
  Layers,
  Network,
  Radar,
  Shield,
  Zap,
} from "lucide-react";
import { Reveal, MaskReveal } from "@/components/motion/reveal";
import { HUDFrame } from "@/components/ui/hud-frame";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const features = [
  { icon: Brain, title: "Neural Processing", desc: "Deep contextual understanding across millions of signals", color: "#62d9ff" },
  { icon: Radar, title: "Predictive Sensing", desc: "Anticipate needs before they surface", color: "#9dfcc7" },
  { icon: Network, title: "Semantic Graph", desc: "Living knowledge connecting themes and outcomes", color: "#a99cff" },
  { icon: Eye, title: "Anomaly Detection", desc: "Spot sentiment shifts before they breach thresholds", color: "#85e8ff" },
  { icon: Zap, title: "Real-time Loops", desc: "Instant action on every meaningful signal", color: "#62d9ff" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant with on-premise options", color: "#9dfcc7" },
  { icon: Fingerprint, title: "Identity Resolution", desc: "Unify fragmented signals into coherent stories", color: "#a99cff" },
  { icon: Globe, title: "47 Markets", desc: "Multi-language intelligence across global teams", color: "#85e8ff" },
  { icon: Layers, title: "Deep Integrations", desc: "Connect 100+ tools where conversations happen", color: "#62d9ff" },
];

export function FeatureSlider() {
  const interactiveSwiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-shell">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Capabilities</span>
          </Reveal>
          <MaskReveal delay={0.06} className="-mb-2 pb-2">
            <h2 className="section-title mx-auto">
              Everything your signal stack <span className="neon-text-violet">needs.</span>
            </h2>
          </MaskReveal>
        </div>
      </div>

      {/* Primary: continuous free-mode scroll (unchanged but enhanced) */}
      <div className="mt-12">
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
          grabCursor
          slidesPerView="auto"
          spaceBetween={16}
          loop
          speed={4000}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          className="feature-slider-swiper"
        >
          {features.map((item, index) => (
            <SwiperSlide key={item.title} className="!w-[280px]">
              <HUDFrame label="Capability" index={String(index + 1).padStart(2, "0")} accent={item.color} className="group h-[180px] p-5 transition-all duration-400">
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${item.color}08, transparent 60%)` }}
                />

                <div className="relative">
                  <div
                    className="grid size-10 place-items-center rounded-xl border border-white/[0.08] transition-transform duration-500 group-hover:-translate-y-0.5"
                    style={{ background: `${item.color}0d`, boxShadow: `0 0 20px ${item.color}15` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-white tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-2 text-[11px] leading-[1.5] text-[#6a7f94]">{item.desc}</p>
                </div>

                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                />
              </HUDFrame>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Secondary: premium-style interactive signal deck */}
      <div className="mt-10">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#5e6763]">
            Signal deck — swipe, wheel or use keyboard
          </p>
          <span className="mb-4 font-mono text-[8px] uppercase tracking-[0.14em] text-[#53625e]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")} <span className="mx-1 text-[#9dfcc7]">●</span> Live
          </span>
        </div>
        <Swiper
          modules={[A11y, Autoplay, Keyboard, Mousewheel, Pagination]}
          keyboard={{ enabled: true, onlyInViewport: true }}
          mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 0.55 }}
          pagination={{ clickable: true, dynamicBullets: true }}
          grabCursor
          loop
          slidesPerView={1.12}
          spaceBetween={16}
          speed={720}
          breakpoints={{
            640: { slidesPerView: 2.1 },
            1024: { slidesPerView: 3.15 },
          }}
          autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true, waitForTransition: false }}
          watchSlidesProgress
          roundLengths
          a11y={{
            prevSlideMessage: "Previous signal module",
            nextSlideMessage: "Next signal module",
            paginationBulletMessage: "Go to signal module {{index}}",
          }}
          onSwiper={(swiper) => { interactiveSwiperRef.current = swiper; }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex % features.length)}
          className="feature-interactive-swiper"
        >
          {features.map((item, index) => (
            <SwiperSlide key={`interactive-${item.title}-${index}`}>
              <HUDFrame label="Module" index={String((index % features.length) + 1).padStart(2, "0")} accent={item.color} className="group h-[160px] p-5 transition-all duration-400">
                <div className="relative flex items-start gap-3">
                  <div
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08]"
                    style={{ background: `${item.color}0d` }}
                  >
                    <item.icon size={16} style={{ color: item.color }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white tracking-[-0.02em]">{item.title}</h3>
                    <p className="mt-1.5 text-[11px] leading-[1.5] text-[#6a7f94]">{item.desc}</p>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute -right-8 -bottom-8 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
              </HUDFrame>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="container-shell mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Previous signal module"
            onClick={() => interactiveSwiperRef.current?.slidePrev()}
            className="feature-deck-button"
          >
            ←
          </button>
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#53625e]">Route the signal</span>
          <button
            type="button"
            aria-label="Next signal module"
            onClick={() => interactiveSwiperRef.current?.slideNext()}
            className="feature-deck-button"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
