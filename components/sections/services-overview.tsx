"use client";

import Link from "next/link";
import { Shield, Brain, Code2, Blocks, Radar, Cloud } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { LucideIcon } from "lucide-react";

interface ServicePillar {
  icon: LucideIcon;
  name: string;
  count: number;
  description: string;
  color: string;
  slug: string;
}

const pillars: ServicePillar[] = [
  {
    icon: Shield,
    name: "Cybersecurity",
    count: 16,
    description: "Enterprise-grade protection for your digital infrastructure",
    color: "#62d9ff",
    slug: "cybersecurity",
  },
  {
    icon: Brain,
    name: "AI Services",
    count: 15,
    description: "Intelligent automation and machine learning solutions",
    color: "#a99cff",
    slug: "ai",
  },
  {
    icon: Code2,
    name: "Web & Software",
    count: 15,
    description: "Modern applications built for scale and performance",
    color: "#9dfcc7",
    slug: "development",
  },
  {
    icon: Blocks,
    name: "Blockchain & Web3",
    count: 12,
    description: "Decentralized solutions for the next internet",
    color: "#ffb86c",
    slug: "blockchain",
  },
  {
    icon: Radar,
    name: "SOC Services",
    count: 15,
    description: "24×7 security monitoring and threat detection",
    color: "#ff8ecf",
    slug: "soc",
  },
  {
    icon: Cloud,
    name: "Cloud Services",
    count: 17,
    description: "Scalable infrastructure for the modern enterprise",
    color: "#85e8ff",
    slug: "cloud",
  },
];

export function ServicesOverview() {
  return (
    <section className="section-pad" aria-label="Our expertise">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Our expertise"
          title="Six pillars of technology excellence"
          centered
        />

        <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <StaggerItem key={pillar.slug} preset="tilt">
                <Link
                  href={`/services/${pillar.slug}`}
                  className="glass-panel group relative flex flex-col rounded-[1.25rem] p-6 transition-colors duration-300 hover:border-white/[0.14]"
                >
                  {/* Icon */}
                  <div
                    className="mb-4 grid size-10 place-items-center rounded-xl border"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.color}12, ${pillar.color}06)`,
                      borderColor: `${pillar.color}28`,
                    }}
                  >
                    <Icon size={18} style={{ color: pillar.color }} />
                  </div>

                  {/* Name + badge */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-medium tracking-[-0.02em] text-white">
                      {pillar.name}
                    </h3>
                    <span
                      className="inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em]"
                      style={{
                        borderColor: `${pillar.color}22`,
                        color: pillar.color,
                        background: `${pillar.color}0a`,
                      }}
                    >
                      {pillar.count} services
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-6 text-[#929b97]">
                    {pillar.description}
                  </p>

                  {/* Arrow */}
                  <span
                    className="mt-4 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: pillar.color }}
                  >
                    Learn more →
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* View all */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#9dfcc7] transition-colors duration-200 hover:text-white"
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}
