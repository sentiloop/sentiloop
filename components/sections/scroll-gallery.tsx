"use client";

import { useEffect, useRef, useState } from "react";
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (viewport.scrollWidth <= viewport.clientWidth) return;

      const atStart = viewport.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;

      event.preventDefault();
      viewport.scrollLeft += event.deltaY;
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
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
    <section className="scroll-gallery-section relative overflow-hidden">
      <div className="container-shell pt-[clamp(6rem,12vw,10rem)]">
        <Reveal>
          <span className="eyebrow">Gallery</span>
        </Reveal>
        <h2 className="section-title mt-3">
          <span className="text-gradient">Visual intelligence</span>
        </h2>
      </div>

      <div ref={viewportRef} className="scroll-gallery-viewport mt-12 overflow-x-auto">
        <div className="scroll-gallery-track flex gap-6 px-[max(20px,calc((100vw-1200px)/2))]">
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
          background: "linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
          backdropFilter: "blur(12px)",
          boxShadow: "inset 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-60`}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full opacity-20 blur-xl" style={{ background: accent }} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            size={48}
            strokeWidth={1}
            style={{ color: accent }}
            className="opacity-60 transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-5 pt-16">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-[11px] text-white/50">{subtitle}</p>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ background: accent }}
        />
      </div>
    </div>
  );
}
