"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import {
  Activity,
  Brain,
  Route,
  Palette,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

gsap.registerPlugin(ScrollTrigger, Draggable);

const galleryItems = [
  {
    title: "Signal Analysis",
    subtitle: "Real-time sentiment detection",
    gradient: "from-cyan-500/20 to-blue-600/20",
    accent: "#62d9ff",
    Icon: Activity,
  },
  {
    title: "Neural Mapping",
    subtitle: "Deep pattern recognition",
    gradient: "from-violet-500/20 to-purple-600/20",
    accent: "#a99cff",
    Icon: Brain,
  },
  {
    title: "Customer Journey",
    subtitle: "End-to-end experience flow",
    gradient: "from-emerald-500/20 to-teal-600/20",
    accent: "#9dfcc7",
    Icon: Route,
  },
  {
    title: "Emotion Spectrum",
    subtitle: "Multidimensional feeling map",
    gradient: "from-pink-500/20 to-rose-600/20",
    accent: "#ff8ecf",
    Icon: Palette,
  },
  {
    title: "Predictive Model",
    subtitle: "Future behavior forecasting",
    gradient: "from-amber-500/20 to-orange-600/20",
    accent: "#ffb86c",
    Icon: TrendingUp,
  },
  {
    title: "Cohort View",
    subtitle: "Behavioral group analysis",
    gradient: "from-blue-500/20 to-indigo-600/20",
    accent: "#85e8ff",
    Icon: Users,
  },
  {
    title: "Impact Timeline",
    subtitle: "Change correlation tracking",
    gradient: "from-green-500/20 to-emerald-600/20",
    accent: "#6ee7b7",
    Icon: Clock,
  },
  {
    title: "Loop Metrics",
    subtitle: "Autonomous feedback scoring",
    gradient: "from-indigo-500/20 to-violet-600/20",
    accent: "#818cf8",
    Icon: BarChart3,
  },
];

export function ScrollGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const cards = track.querySelectorAll<HTMLElement>(".gallery-card");
      const totalScroll = track.scrollWidth - track.offsetWidth;

      // Horizontal scroll via ScrollTrigger
      const scrollTween = gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax offset per card
      cards.forEach((card, i) => {
        gsap.to(card, {
          x: (i - 3) * -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1.5,
          },
        });
      });

      // Draggable
      Draggable.create(track, {
        type: "x",
        bounds: { minX: -totalScroll, maxX: 0 },
        inertia: true,
        cursor: "grab",
        activeCursor: "grabbing",
        onDrag() {
          const progress = -this.x / totalScroll;
          scrollTween.scrollTrigger?.scroll(
            scrollTween.scrollTrigger.start +
              progress * (scrollTween.scrollTrigger.end - scrollTween.scrollTrigger.start)
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section className="section-pad relative overflow-hidden">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">Gallery</span>
          </Reveal>
          <h2 className="section-title mt-3">
            <span className="text-gradient">Visual intelligence</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item) => (
              <GalleryCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="scroll-gallery-section relative overflow-hidden">
      <div className="container-shell pt-[clamp(6rem,12vw,10rem)]">
        <Reveal>
          <span className="eyebrow">Gallery</span>
        </Reveal>
        <h2 className="section-title mt-3">
          <span className="text-gradient">Visual intelligence</span>
        </h2>
      </div>

      <div className="mt-12 overflow-hidden">
        <div
          ref={trackRef}
          className="scroll-gallery-track flex gap-6 px-[max(20px,calc((100vw-1200px)/2))]"
        >
          {galleryItems.map((item) => (
            <GalleryCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  item,
}: {
  item: (typeof galleryItems)[number];
}) {
  const { title, subtitle, gradient, accent, Icon } = item;

  return (
    <div className="gallery-card w-[320px] shrink-0 select-none">
      <div
        className="group relative h-[400px] overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-500 hover:border-white/[0.18]"
        style={{
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          backdropFilter: "blur(12px)",
          boxShadow: `inset 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Abstract gradient visual */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-60`}
        />

        {/* Decorative circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-32 w-32 rounded-full opacity-20 blur-xl"
            style={{ background: accent }}
          />
        </div>

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            size={48}
            strokeWidth={1}
            style={{ color: accent }}
            className="opacity-60 transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-5 pt-16">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-[11px] text-white/50">{subtitle}</p>
        </div>

        {/* Accent line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ background: accent }}
        />
      </div>
    </div>
  );
}
