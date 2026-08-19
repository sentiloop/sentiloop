"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Autoplay,
  Pagination,
  Keyboard,
  Mousewheel,
  Navigation,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { Reveal, MaskReveal } from "@/components/motion/reveal";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    quote: "Sentiloop transformed how we understand our customers. The neural intelligence layer catches signals we never knew existed.",
    name: "Sarah Mitchell",
    role: "VP of Product, Aerium",
    rating: 5,
    color: "#62d9ff",
  },
  {
    quote: "Within 48 hours of connecting, we identified three critical experience gaps that had been invisible for months.",
    name: "David Park",
    role: "CTO, Northstar",
    rating: 5,
    color: "#9dfcc7",
  },
  {
    quote: "The autonomous loops saved our support team 18 hours per week. It's like having a team of analysts working around the clock.",
    name: "Elena Rodriguez",
    role: "Head of CX, Monolith",
    rating: 5,
    color: "#a99cff",
  },
  {
    quote: "Every team now speaks the same language about customer needs. Sentiloop gave us one truth instead of twelve dashboards.",
    name: "James Chen",
    role: "CEO, Vantage",
    rating: 5,
    color: "#85e8ff",
  },
  {
    quote: "The predictive sensing caught a churn wave two weeks before it hit. We retained 340 enterprise accounts because of that alert.",
    name: "Priya Sharma",
    role: "Revenue Lead, Arc",
    rating: 5,
    color: "#9dfcc7",
  },
];

export function TestimonialsCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-[20%] top-[30%] h-[400px] w-[500px] rounded-full bg-[#62d9ff]/[0.03] blur-[120px]" />
        <div className="absolute right-[10%] bottom-[20%] h-[350px] w-[400px] rounded-full bg-[#a99cff]/[0.025] blur-[100px]" />
      </div>

      <div className="container-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Customer stories</span>
          </Reveal>
          <MaskReveal delay={0.06} className="-mb-2 pb-2">
            <h2 className="section-title mx-auto">
              Trusted by teams who <span className="neon-text-cyan">feel the difference.</span>
            </h2>
          </MaskReveal>
        </div>

        <div className="mt-14">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Pagination, Keyboard, Mousewheel, Navigation]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop
            speed={700}
            autoplay={{ delay: 4500, disableOnInteraction: true, pauseOnMouseEnter: true }}
            keyboard={{ enabled: true, onlyInViewport: true }}
            mousewheel={{ forceToAxis: true, sensitivity: 0.4, thresholdDelta: 30 }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 2.2,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
              el: ".swiper-testimonial-pagination",
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="testimonial-swiper"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.name} className="!w-[min(85vw,420px)]">
                <div
                  className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] p-6 md:p-8 transition-all duration-500 hover:border-white/[0.15]"
                  style={{
                    background: "linear-gradient(160deg, rgba(10, 20, 38, 0.85), rgba(5, 10, 22, 0.75))",
                    backdropFilter: "blur(20px)",
                    boxShadow: `inset 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.3), 0 0 40px ${item.color}08`,
                  }}
                >
                  {/* Glow accent */}
                  <div
                    className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-[80px] opacity-30 transition-opacity duration-500 group-hover:opacity-50"
                    style={{ background: item.color }}
                  />

                  <div className="relative">
                    <Quote size={24} style={{ color: item.color }} strokeWidth={1.2} className="opacity-50" />

                    <div className="mt-4 flex gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={12} fill={item.color} stroke="none" className="opacity-80" />
                      ))}
                    </div>

                    <p className="mt-4 text-[0.85rem] leading-[1.7] text-[#b8c8d8] font-light">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <div
                        className="grid size-9 place-items-center rounded-full text-[10px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${item.color}88, ${item.color}44)` }}
                      >
                        {item.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{item.name}</p>
                        <p className="text-[10px] text-[#6a7f94]">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation + Pagination row */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#6a7f94] backdrop-blur-md transition-all hover:border-[#62d9ff]/30 hover:text-[#62d9ff]"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="swiper-testimonial-pagination flex items-center justify-center gap-1.5" />
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="grid size-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#6a7f94] backdrop-blur-md transition-all hover:border-[#62d9ff]/30 hover:text-[#62d9ff]"
              aria-label="Next testimonial"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
