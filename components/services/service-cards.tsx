"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { Shield, Brain, Code2, Blocks, Radar, Cloud } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { LucideIcon } from "lucide-react";

interface ServiceCardData {
  icon: LucideIcon;
  name: string;
  count: number;
  description: string;
  color: string;
  slug: string;
}

const services: ServiceCardData[] = [
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

function ServiceCard({ service }: { service: ServiceCardData }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty("--light-x", `${x}px`);
    card.style.setProperty("--light-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const Icon = service.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-[1.5rem] transition-transform duration-300 will-change-transform"
      style={{ "--glow-color": service.color } as React.CSSProperties}
    >
      {/* Conic border */}
      <div className="ai-card-border" />
      {/* Glow */}
      <div className="ai-card-glow" />
      {/* Lighting */}
      <div className="ai-card-lighting" />

      <Link
        href={`/services/${service.slug}`}
        className="ai-card-content relative z-[3] flex flex-col rounded-[1.5rem] p-6 md:p-7"
      >
        {/* Icon */}
        <div
          className="ai-card-icon-well mb-5"
          style={{
            background: `linear-gradient(135deg, ${service.color}15, ${service.color}08)`,
            borderColor: `${service.color}30`,
          }}
        >
          <Icon size={20} style={{ color: service.color }} />
        </div>

        {/* Service count */}
        <span
          className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]"
          style={{
            borderColor: `${service.color}25`,
            color: service.color,
            background: `${service.color}08`,
          }}
        >
          {service.count} services
        </span>

        {/* Name */}
        <h3 className="mt-2 text-lg font-medium tracking-[-0.025em] text-white md:text-xl">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mt-2 flex-1 text-sm leading-6 text-[#929b97]">
          {service.description}
        </p>

        {/* Explore link */}
        <div className="mt-5 flex items-center gap-2 text-sm font-medium transition-colors duration-300 group-hover:text-white" style={{ color: service.color }}>
          Explore
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>

        {/* Hover indicator */}
        <div
          className="ai-card-hover-indicator w-8"
          style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
        />
      </Link>
    </div>
  );
}

export function ServiceCards() {
  return (
    <section id="services" className="section-pad" aria-label="Our services">
      <div className="container-shell">
        <SectionHeading
          eyebrow="What we do"
          title="Six pillars of technology excellence"
          description="End-to-end services spanning cybersecurity, artificial intelligence, software engineering, blockchain, security operations, and cloud infrastructure."
          centered
        />

        <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {services.map((service) => (
            <StaggerItem key={service.slug} preset="scale">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
