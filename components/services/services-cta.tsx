"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { MorphingBlobs } from "@/components/effects/morphing-blobs";

export function ServicesCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !headlineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: "105%", rotate: 1.5, opacity: 0 },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToServices = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="section-pad relative" aria-label="Get started">
      <MorphingBlobs />

      <div className="container-shell relative z-10">
        <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-8 text-center md:p-14">
          {/* Headline with mask reveal */}
          <div className="overflow-hidden pb-[0.08em]">
            <h2
              ref={headlineRef}
              className="display-title mx-auto hero-title-gradient"
              style={reducedMotion ? undefined : { opacity: 0 }}
            >
              READY TO BUILD WHAT&apos;S NEXT?
            </h2>
          </div>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#929b97] md:text-lg"
          >
            Let&apos;s transform your technology challenges into secure, intelligent and scalable digital solutions.
          </motion.p>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/login" className="primary-button group min-w-48">
                Start a Conversation
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.button
              type="button"
              onClick={scrollToServices}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="secondary-button"
            >
              Explore Services
              <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
