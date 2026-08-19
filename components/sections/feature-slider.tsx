"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Keyboard } from "swiper/modules";
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

import "swiper/css";
import "swiper/css/free-mode";

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
          {features.map((item) => (
            <SwiperSlide key={item.title} className="!w-[280px]">
              <div
                className="group relative overflow-hidden rounded-[20px] border border-white/[0.07] p-5 h-[180px] transition-all duration-400 hover:border-white/[0.15]"
                style={{
                  background: "linear-gradient(155deg, rgba(8, 16, 32, 0.88), rgba(4, 8, 20, 0.8))",
                }}
              >
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Secondary: Smooth auto-sliding interactive view */}
      <div className="mt-10">
        <div className="container-shell">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#5e6763]">
            Interactive view — swipe or use keyboard
          </p>
        </div>
        <Swiper
          modules={[Autoplay, FreeMode, Keyboard]}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.4 }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          grabCursor
          loop
          slidesPerView="auto"
          spaceBetween={16}
          speed={5000}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
          className="feature-interactive-swiper"
        >
          {[...features, ...features].map((item, index) => (
            <SwiperSlide key={`interactive-${item.title}-${index}`} className="!w-[300px]">
              <div
                className="group relative overflow-hidden rounded-[20px] border border-white/[0.07] p-5 h-[160px] transition-all duration-400 hover:border-white/[0.15]"
                style={{
                  background: "linear-gradient(155deg, rgba(8, 16, 32, 0.88), rgba(4, 8, 20, 0.8))",
                }}
              >
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
