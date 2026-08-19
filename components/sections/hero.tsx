"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MousePointer2, Play, Sparkles } from "lucide-react";
import { useRef, type PointerEvent } from "react";

const SignalOrb = dynamic(() => import("@/components/three/signal-orb"), {
  ssr: false,
  loading: () => <div className="hero-orb-fallback absolute inset-0" />,
});

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!sectionRef.current || reducedMotion) return;
    const bounds = sectionRef.current.getBoundingClientRect();
    sectionRef.current.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    sectionRef.current.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={handlePointerMove}
      className="hero-stage relative flex min-h-[100svh] overflow-hidden pt-28 md:pt-32"
    >
      <div className="hero-aurora absolute inset-0" aria-hidden="true" />
      <div className="hero-spotlight absolute inset-0" aria-hidden="true" />
      <div className="grid-surface absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="hero-vignette absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <SignalOrb />
      </div>

      <div className="container-shell relative z-10 flex min-h-[calc(100svh-7rem)] flex-1 flex-col justify-center pb-28 md:pb-32">
        <div className="max-w-[760px]">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.05, ease }}
            className="hero-kicker inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#080b0a]/55 px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.15em] text-[#b9c1bd] backdrop-blur-xl"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9dfcc7] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#9dfcc7] shadow-[0_0_10px_#9dfcc7]" />
            </span>
            Intelligent technology partner
          </motion.div>

          <h1 className="mt-6 max-w-[820px] text-[clamp(3.25rem,8.6vw,7.9rem)] font-medium leading-[0.87] tracking-[-0.079em] text-white">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "115%", rotate: 2, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.05, delay: 0.12, ease }}
              >
                Secure. Intelligent.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span
                className="hero-title-gradient block"
                initial={{ y: "115%", rotate: 2, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.05, delay: 0.22, ease }}
              >
                Engineered.
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.42, ease }}
            className="mt-4 grid max-w-2xl gap-7 md:grid-cols-[1fr_auto] md:items-end"
          >
            <p className="max-w-xl text-base leading-7 text-[#9ba5a0] md:text-lg md:leading-8">
              Sentiloop delivers enterprise-grade cybersecurity, AI, software engineering, blockchain, SOC, and cloud solutions for organizations building the digital future.
            </p>
            <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#626c67] md:flex">
              <MousePointer2 size={12} className="text-[#9dfcc7]" /> Move to explore
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.56, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/services" className="primary-button group min-w-40">
              Explore Services
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a href="#intelligence" className="secondary-button">
              <span className="grid size-6 place-items-center rounded-full bg-white/10"><Play size={9} fill="currentColor" /></span>
              Watch the loop
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.74 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#5e6763]"
          >
            <span>6 service pillars</span><span className="size-1 rounded-full bg-[#9dfcc7]/50" /><span>90+ capabilities</span><span className="size-1 rounded-full bg-[#9dfcc7]/50" /><span>Enterprise-grade</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.62, ease }}
          className="hero-glass-card glass-panel absolute right-[2%] top-[27%] hidden w-[218px] rounded-[20px] p-4 xl:block"
        >
          <div className="flex items-center justify-between"><span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#68716d]">Emerging intent</span><Sparkles size={13} className="text-[#a99cff]" /></div>
          <p className="mt-5 text-sm font-medium tracking-[-0.025em]">Enterprise expansion</p>
          <div className="mt-4 flex h-10 items-end gap-1">{[35, 48, 42, 62, 56, 74, 88, 96].map((height, index) => <span key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#9dfcc7]/25 to-[#9dfcc7]" style={{ height: `${height}%`, opacity: 0.4 + index * 0.07 }} />)}</div>
          <div className="mt-3 flex items-center justify-between text-[9px] text-[#68716d]"><span>Last 24 hours</span><span className="text-[#9dfcc7]">+18.4%</span></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.78, ease }}
          className="hero-glass-card glass-panel absolute bottom-[19%] right-[8%] hidden w-[204px] rounded-[20px] p-4 lg:block"
        >
          <div className="flex items-center gap-3"><span className="relative grid size-9 place-items-center rounded-xl border border-[#9dfcc7]/15 bg-[#9dfcc7]/[0.07]"><span className="size-2 rounded-full bg-[#9dfcc7] shadow-[0_0_16px_#9dfcc7]" /></span><div><p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#68716d]">Neural clarity</p><p className="mt-1 text-sm font-medium">96.8% aligned</p></div></div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]"><motion.div initial={{ width: 0 }} animate={{ width: "96.8%" }} transition={{ duration: 1.4, delay: 1.1, ease }} className="h-full rounded-full bg-gradient-to-r from-[#9f91ff] via-[#9dfcc7] to-[#85e8ff]" /></div>
        </motion.div>
      </div>

      <motion.a
        href="#platform"
        aria-label="Scroll to explore Sentiloop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.05 }}
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[8px] uppercase tracking-[0.19em] text-[#59615d] md:bottom-7"
      >
        <span>Scroll to sense</span>
        <span className="hero-scroll-track relative h-9 w-px overflow-hidden bg-white/10"><span className="hero-scroll-line absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#9dfcc7] to-transparent" /></span>
      </motion.a>
    </section>
  );
}
