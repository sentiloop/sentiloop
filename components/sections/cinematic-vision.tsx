"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, MaskReveal } from "@/components/motion/reveal";

export function CinematicVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cinematic-vision relative overflow-hidden"
      aria-label="Vision of the future"
    >
      {/* Animated background image with Ken Burns effect */}
      <div className="cinematic-image-wrap" aria-hidden="true">
        <div
          className={`cinematic-image ${reduced ? "" : "cinematic-image-animated"}`}
          style={{ backgroundImage: "url('/images/cyberpunk-city.png')" }}
        />
      </div>

      {/* Neon glow overlay */}
      <div className="cinematic-glow" aria-hidden="true" />

      {/* Scanline effect */}
      <div className="cinematic-scanlines" aria-hidden="true" />

      {/* Vignette */}
      <div className="cinematic-vignette" aria-hidden="true" />

      {/* Noise grain */}
      <div className="cinematic-noise" aria-hidden="true" />

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-32 md:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Our vision</span>
          </Reveal>
          <MaskReveal delay={0.1} className="-mb-2 pb-2">
            <h2 className="text-[clamp(2.2rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.065em] text-white">
              Building the digital{" "}
              <span className="neon-text-cyan">future.</span>
            </h2>
          </MaskReveal>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg"
          >
            Where cybersecurity meets artificial intelligence. Where code becomes
            infrastructure. This is the world we engineer every day.
          </motion.p>

          {/* Animated stats bar */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl"
          >
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#62d9ff]">90+</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/50">Capabilities</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#9dfcc7]">6</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/50">Service Pillars</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#a99cff]">24/7</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/50">SOC Monitoring</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
