"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  { number: "01", title: "Discover", description: "Understand your business goals and technical landscape" },
  { number: "02", title: "Assess", description: "Audit existing systems, identify gaps and opportunities" },
  { number: "03", title: "Architect", description: "Design scalable, secure, and future-ready solutions" },
  { number: "04", title: "Build", description: "Engineer with precision using modern frameworks" },
  { number: "05", title: "Secure", description: "Integrate security at every layer of the stack" },
  { number: "06", title: "Deploy", description: "Launch with zero-downtime and automated pipelines" },
  { number: "07", title: "Monitor", description: "24×7 observability, alerting, and threat detection" },
  { number: "08", title: "Optimize", description: "Continuous improvement driven by real data" },
];

export function ProcessSection() {
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
    if (reduced || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const stepElements = trackRef.current!.querySelectorAll<HTMLElement>(".process-step");

      stepElements.forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0.25, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              end: "top 55%",
              scrub: false,
              toggleActions: "play none none reverse",
            },
          }
        );

        // Light up the number
        const numberEl = step.querySelector<HTMLElement>(".process-number");
        if (numberEl) {
          gsap.fromTo(
            numberEl,
            { color: "#3a3f3d" },
            {
              color: "#9dfcc7",
              duration: 0.5,
              delay: i * 0.05,
              scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Animate the connecting line
      const line = trackRef.current!.querySelector<HTMLElement>(".process-line-fill");
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top 70%",
              end: "bottom 50%",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="section-pad overflow-hidden" aria-label="Our process">
      <div className="container-shell">
        <SectionHeading eyebrow="How we work" title="Our process" centered />

        <div ref={trackRef} className="relative mt-16">
          {/* Connecting line - desktop horizontal */}
          <div className="absolute left-0 right-0 top-[2.75rem] hidden h-px bg-white/[0.06] lg:block" aria-hidden="true">
            <div
              className="process-line-fill h-full origin-left bg-gradient-to-r from-[#9dfcc7] via-[#85e8ff] to-[#a99cff]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* Steps grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {steps.map((step) => (
              <div key={step.number} className="process-step flex flex-col items-center text-center lg:items-start lg:text-left">
                <span className="process-number font-mono text-2xl font-bold tracking-[-0.04em] text-[#3a3f3d] transition-colors duration-500">
                  {step.number}
                </span>
                <h3 className="mt-3 text-sm font-semibold tracking-[-0.015em] text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-[#7c8581]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
