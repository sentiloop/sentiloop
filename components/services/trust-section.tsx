"use client";

import {
  ShieldCheck,
  Building,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Users,
} from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { LucideIcon } from "lucide-react";

interface TrustItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Security-first engineering",
    description: "Every solution is built with defense-in-depth principles and continuous threat modeling.",
  },
  {
    icon: Building,
    title: "Enterprise-grade architecture",
    description: "Systems designed for high availability, fault tolerance, and global scale from day one.",
  },
  {
    icon: TrendingUp,
    title: "Scalable technology",
    description: "Infrastructure that grows with your business without compromising performance or reliability.",
  },
  {
    icon: Lightbulb,
    title: "Continuous innovation",
    description: "We stay ahead of emerging technologies to deliver future-ready solutions today.",
  },
  {
    icon: BarChart3,
    title: "Data-driven decisions",
    description: "Every recommendation is backed by metrics, benchmarks, and measurable outcomes.",
  },
  {
    icon: Users,
    title: "Human-centered design",
    description: "Technology that serves people first—intuitive, accessible, and built for real workflows.",
  },
];

export function TrustSection() {
  return (
    <section className="section-pad" aria-label="Why organizations trust us">
      <div className="container-shell">
        <SectionHeading eyebrow="Trust" title="Why organizations trust us" centered />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title} preset="fade">
                <div className="glass-panel group relative rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(157,252,199,0.06)]">
                  <div className="mb-4 grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-[#9dfcc7]/20 group-hover:bg-[#9dfcc7]/[0.06] group-hover:shadow-[0_0_20px_rgba(157,252,199,0.1)]">
                    <Icon size={20} className="text-[#929b97] transition-colors duration-300 group-hover:text-[#9dfcc7]" />
                  </div>
                  <h3 className="text-base font-medium tracking-[-0.02em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#7c8581]">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
