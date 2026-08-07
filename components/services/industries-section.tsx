"use client";

import {
  Landmark,
  HeartPulse,
  Factory,
  ShoppingCart,
  Store,
  GraduationCap,
  Truck,
  Building2,
  Cpu,
  Briefcase,
} from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { LucideIcon } from "lucide-react";

interface Industry {
  icon: LucideIcon;
  name: string;
  description: string;
}

const industries: Industry[] = [
  { icon: Landmark, name: "Financial Services", description: "Secure fintech and compliance-first solutions" },
  { icon: HeartPulse, name: "Healthcare", description: "HIPAA-compliant digital health platforms" },
  { icon: Factory, name: "Manufacturing", description: "IoT-driven smart factory automation" },
  { icon: ShoppingCart, name: "Retail", description: "Omnichannel commerce and analytics" },
  { icon: Store, name: "E-commerce", description: "High-performance storefronts at scale" },
  { icon: GraduationCap, name: "Education", description: "Adaptive learning and EdTech platforms" },
  { icon: Truck, name: "Logistics", description: "Real-time supply chain intelligence" },
  { icon: Building2, name: "Government", description: "FedRAMP-ready civic technology" },
  { icon: Cpu, name: "Technology", description: "Developer tools and platform engineering" },
  { icon: Briefcase, name: "Professional Services", description: "Digital transformation for enterprises" },
];

export function IndustriesSection() {
  return (
    <section className="section-pad" aria-label="Industries we serve">
      <div className="container-shell">
        <SectionHeading eyebrow="Sectors" title="Industries we serve" centered />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" stagger={0.06}>
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <StaggerItem key={industry.name} preset="scale">
                <div className="glass-panel group flex flex-col items-center rounded-2xl p-5 text-center transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(157,252,199,0.05)]">
                  <div className="mb-3 grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-[#9dfcc7]/20 group-hover:bg-[#9dfcc7]/[0.06]">
                    <Icon size={20} className="text-[#929b97] transition-colors duration-300 group-hover:text-[#9dfcc7]" />
                  </div>
                  <h3 className="text-sm font-medium tracking-[-0.015em] text-white">{industry.name}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#7c8581]">{industry.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
