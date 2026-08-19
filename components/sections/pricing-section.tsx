"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  color: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$3,000+",
    description: "For landing pages and MVPs",
    features: [
      "Custom design",
      "Responsive development",
      "SEO optimization",
      "2 revision rounds",
      "Launch support",
    ],
    cta: "Get started",
    color: "#62d9ff",
  },
  {
    name: "Growth",
    price: "$10,000+",
    description: "For platforms and web applications",
    features: [
      "Everything in Starter",
      "Full-stack development",
      "API integrations",
      "Authentication & auth",
      "Admin dashboard",
      "90-day support",
    ],
    cta: "Talk to us",
    color: "#9dfcc7",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$30,000+",
    description: "For complex systems and mobile",
    features: [
      "Everything in Growth",
      "Mobile applications",
      "AI/ML integration",
      "Blockchain/Web3",
      "24/7 SOC monitoring",
      "Dedicated team",
      "SLA guarantee",
    ],
    cta: "Schedule a call",
    color: "#a99cff",
  },
];

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-[1.5rem] ${tier.popular ? "-translate-y-2 scale-[1.02]" : ""}`}
    >
      {/* Animated conic border */}
      <div
        className="ai-card-border pointer-events-none !opacity-0 group-hover:!opacity-100"
        style={{ "--glow-color": tier.color } as React.CSSProperties}
        aria-hidden="true"
      />

      {/* Popular badge */}
      {tier.popular && (
        <div
          className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]"
          style={{
            borderColor: `${tier.color}44`,
            color: tier.color,
            background: `${tier.color}18`,
            boxShadow: `0 0 20px ${tier.color}22`,
          }}
        >
          Most Popular
        </div>
      )}

      {/* Card content */}
      <div
        className="relative z-[3] flex h-full flex-col rounded-[1.5rem] border p-7 transition-colors duration-300"
        style={{
          borderColor: tier.popular ? `${tier.color}30` : "rgba(255,255,255,0.08)",
          background: "linear-gradient(165deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
          boxShadow: tier.popular
            ? `inset 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.3), 0 0 40px ${tier.color}0a`
            : "inset 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.22)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        {/* Name */}
        <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{tier.name}</h3>

        {/* Price */}
        <p className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {tier.price}
        </p>

        {/* Description */}
        <p className="mt-2 text-sm text-[#929b97]">{tier.description}</p>

        {/* Divider */}
        <div className="hairline my-6" />

        {/* Features */}
        <ul className="flex flex-1 flex-col gap-3" role="list" aria-label={`${tier.name} features`}>
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-[#c8cfcc]">
              <Check
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: tier.color }}
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/login"
          className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 hover:translate-y-[-1px]"
          style={{
            background: `${tier.color}18`,
            color: tier.color,
            border: `1px solid ${tier.color}30`,
            boxShadow: `0 0 16px ${tier.color}0a`,
          }}
        >
          {tier.cta}
        </Link>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  return (
    <section className="section-pad" aria-label="Pricing plans">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Pricing"
          title="Transparent investment"
          description="Engagement models designed for organizations of every scale."
          centered
        />

        <Stagger
          className="mt-16 grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
          stagger={0.12}
        >
          {tiers.map((tier) => (
            <StaggerItem key={tier.name} preset="tilt">
              <PricingCard tier={tier} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
