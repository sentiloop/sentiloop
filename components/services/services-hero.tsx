"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import gsap from "gsap";

const ServicesScene = dynamic(() => import("@/components/three/services-scene"), {
  ssr: false,
  loading: () => null,
});

const ease = [0.16, 1, 0.3, 1] as const;

export function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current,
        { y: "105%", rotate: 1.5, opacity: 0 },
        { y: 0, rotate: 0, opacity: 1, duration: 1.05 },
        0.15
      );

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 24, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
        0.45
      );

      const buttons = buttonsRef.current?.children;
      if (buttons) {
        tl.fromTo(
          buttons,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          0.6
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="hero-stage relative flex min-h-[100svh] overflow-hidden pt-28 md:pt-32"
      aria-label="Services hero"
    >
      {/* WebGL scene */}
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        <ServicesScene />
      </div>

      {/* Background layers */}
      <div className="hero-aurora absolute inset-0" aria-hidden="true" />
      <div className="grid-surface absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="hero-vignette absolute inset-0" aria-hidden="true" />

      <div className="container-shell relative z-10 flex min-h-[calc(100svh-7rem)] flex-1 flex-col justify-center pb-28 md:pb-32">
        <div className="max-w-[860px]">
          {/* Eyebrow */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.05, ease }}
            className="hero-kicker inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#080b0a]/55 px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.15em] text-[#b9c1bd] backdrop-blur-xl"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#9dfcc7] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#9dfcc7] shadow-[0_0_10px_#9dfcc7]" />
            </span>
            Technology services
          </motion.div>

          {/* Headline with mask reveal */}
          <div className="mt-6 overflow-hidden pb-[0.08em]">
            <h1
              ref={headlineRef}
              className="display-title hero-title-gradient"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              ENGINEERING A MORE INTELLIGENT DIGITAL FUTURE.
            </h1>
          </div>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="mt-5 max-w-2xl text-base leading-7 text-[#9ba5a0] md:text-lg md:leading-8"
            style={reducedMotion ? undefined : { opacity: 0 }}
          >
            Cybersecurity, AI, software, blockchain, SOC and cloud solutions engineered
            for organizations ready to move forward.
          </p>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.button
              type="button"
              onClick={scrollToServices}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="primary-button group min-w-40"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              Explore Our Services
              <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              <Link href="/login" className="secondary-button">
                Talk to an Expert
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        onClick={scrollToServices}
        aria-label="Scroll to services"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.05 }}
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[8px] uppercase tracking-[0.19em] text-[#59615d] md:bottom-7"
      >
        <span>Explore</span>
        <span className="hero-scroll-track relative h-9 w-px overflow-hidden bg-white/10">
          <span className="hero-scroll-line absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#9dfcc7] to-transparent" />
        </span>
      </motion.button>
    </section>
  );
}
