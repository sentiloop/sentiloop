"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Brain, Blocks, ChevronDown, Cloud, Code2, Radar, Shield } from "lucide-react";
import { Reveal, MaskReveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesCTA } from "@/components/services/services-cta";

const ICON_MAP = { Shield, Brain, Code2, Blocks, Radar, Cloud } as const;
type IconName = keyof typeof ICON_MAP;

interface ServiceDetailProps {
  name: string;
  tagline: string;
  description: string;
  color: string;
  iconName: IconName;
  services: string[];
  approach: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  benefits: { title: string; description: string }[];
  useCases: string[];
  industries: string[];
  faq: { question: string; answer: string }[];
}

export function ServiceDetail({
  name,
  tagline,
  description,
  color,
  iconName,
  services,
  approach,
  process,
  benefits,
  useCases,
  industries,
  faq,
}: ServiceDetailProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const Icon = ICON_MAP[iconName];

  const toggleFaq = (index: number) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${color}12, transparent 60%), var(--ink)`,
        }}
        aria-label={`${name} hero`}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at 50% 20%, ${color}08, transparent 55%)`,
          }}
          aria-hidden="true"
        />
        <div className="container-shell relative z-10">
          <Reveal>
            <Link
              href="/services"
              className="group mb-8 inline-flex items-center gap-2 text-sm text-[#929b97] transition-colors hover:text-white"
            >
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Services
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div
              className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl border border-white/10"
              style={{ background: `${color}12`, boxShadow: `0 0 40px ${color}18` }}
            >
              <Icon size={28} style={{ color }} />
            </div>
          </Reveal>

          <MaskReveal delay={0.1}>
            <h1 className="display-title">{name}</h1>
          </MaskReveal>

          <Reveal delay={0.18}>
            <p
              className="mt-4 text-lg font-medium md:text-xl"
              style={{ color }}
            >
              {tagline}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#929b97] md:text-lg">
              {description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services List */}
      <section className="section-pad" aria-label={`${name} capabilities`}>
        <div className="container-shell">
          <SectionHeading eyebrow="Capabilities" title="What We Deliver" />
          <Stagger className="mt-12 flex flex-wrap gap-3" stagger={0.04}>
            {services.map((service) => (
              <StaggerItem key={service}>
                <span
                  className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-[#dce2df] backdrop-blur-sm transition-colors hover:border-white/20"
                  style={{ background: `${color}08` }}
                >
                  {service}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-pad" aria-label="Our approach">
        <div className="container-shell">
          <SectionHeading eyebrow="Approach" title="How We Think" />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.1}>
            {approach.map((item, i) => (
              <StaggerItem key={item.title} preset="tilt">
                <div className="glass-panel h-full rounded-2xl p-6 md:p-8">
                  <span
                    className="mb-4 inline-flex size-9 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ background: `${color}15`, color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#929b97]">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section-pad" aria-label="Our process">
        <div className="container-shell">
          <SectionHeading eyebrow="Process" title="Our Method" />
          <div className="relative mt-12">
            {/* Timeline line */}
            <div
              className="absolute left-[19px] top-0 hidden h-full w-px md:block"
              style={{ background: `linear-gradient(180deg, ${color}40, ${color}08)` }}
              aria-hidden="true"
            />
            <Stagger className="flex flex-col gap-8" stagger={0.12}>
              {process.map((item) => (
                <StaggerItem key={item.step} preset="fade">
                  <div className="flex gap-5 md:gap-8">
                    <div
                      className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm font-bold"
                      style={{ background: `${color}15`, color }}
                    >
                      {item.step}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#929b97]">{item.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-pad" aria-label="Benefits">
        <div className="container-shell">
          <SectionHeading eyebrow="Benefits" title="Why It Matters" />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2" stagger={0.08}>
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title} preset="scale">
                <div className="glass-panel h-full rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#929b97]">{benefit.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-pad" aria-label="Use cases">
        <div className="container-shell">
          <SectionHeading eyebrow="Use Cases" title="Real-World Applications" />
          <div className="mt-12 overflow-x-auto pb-4">
            <Stagger className="flex gap-3" stagger={0.05}>
              {useCases.map((useCase) => (
                <StaggerItem key={useCase}>
                  <span
                    className="inline-flex shrink-0 items-center rounded-full border px-5 py-2.5 text-sm font-medium text-white"
                    style={{ borderColor: `${color}30`, background: `${color}08` }}
                  >
                    {useCase}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-pad" aria-label="Industries we serve">
        <div className="container-shell">
          <SectionHeading eyebrow="Industries" title="Sectors We Serve" />
          <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5" stagger={0.06}>
            {industries.map((industry) => (
              <StaggerItem key={industry}>
                <div className="glass-panel flex items-center justify-center rounded-xl px-4 py-4 text-center text-sm font-medium text-[#dce2df]">
                  {industry}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" aria-label="Frequently asked questions">
        <div className="container-shell">
          <SectionHeading eyebrow="FAQ" title="Common Questions" />
          <div className="mx-auto mt-12 max-w-3xl">
            <Stagger className="flex flex-col gap-3" stagger={0.06}>
              {faq.map((item, i) => {
                const isOpen = activeFaq === i;
                const panelId = `faq-panel-${i}`;
                const buttonId = `faq-button-${i}`;

                return (
                  <StaggerItem key={item.question}>
                    <div className="glass-panel overflow-hidden rounded-xl">
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleFaq(i)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-medium text-white transition-colors hover:text-[#dce2df]"
                      >
                        <span>{item.question}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="shrink-0"
                        >
                          <ChevronDown size={16} style={{ color }} />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 pb-5 text-sm leading-6 text-[#929b97]">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ServicesCTA />
    </>
  );
}
