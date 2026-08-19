"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { BarChart3, Users, Activity, Shield, Monitor } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const navItems = [
  { icon: Monitor, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Activity, label: "Signals", active: false },
  { icon: Shield, label: "Security", active: false },
  { icon: Users, label: "Teams", active: false },
];

const miniStats = [
  { label: "Active Users", value: "2,847", change: "+12%" },
  { label: "Threat Score", value: "0.03", change: "-8%" },
  { label: "Uptime", value: "99.98%", change: "+0.1%" },
];

const activityItems = [
  { text: "Anomaly detected in cluster-7", time: "2m ago" },
  { text: "Model retrained — accuracy 97.2%", time: "18m ago" },
  { text: "New deployment: v3.4.1 stable", time: "1h ago" },
];

const barHeights = [45, 72, 58, 85, 63, 92, 78, 68];

export function LiveDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  }, []);

  return (
    <section className="section-pad" aria-label="Live demo preview">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Experience"
          title="See it in action"
          description="An interactive preview of the Sentiloop intelligence workspace."
          centered
        />

        <Reveal delay={0.12}>
          <div className="relative mx-auto mt-16 max-w-5xl">
            {/* Glow behind */}
            <div
              className="absolute inset-0 -z-10 rounded-3xl opacity-40 blur-[60px]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(157,252,199,0.15), rgba(133,232,255,0.08) 40%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* Dashboard container with tilt */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="glass-panel live-demo-float relative overflow-hidden rounded-3xl transition-transform duration-300 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Scanline overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0 2px, rgba(157,252,199,0.06) 2px 3px)",
                }}
                aria-hidden="true"
              />

              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#28ca42]" />
                </div>
                <div className="ml-3 flex-1 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-1">
                  <span className="font-mono text-[10px] text-[#68716d]">
                    app.sentiloop.ai/dashboard
                  </span>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="flex min-h-[340px] md:min-h-[400px]">
                {/* Sidebar */}
                <nav
                  className="hidden w-[140px] shrink-0 border-r border-white/[0.06] p-3 md:block"
                  aria-label="Mock navigation"
                >
                  <ul className="flex flex-col gap-1" role="list">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li
                          key={item.label}
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10px] ${
                            item.active
                              ? "bg-white/[0.06] text-white"
                              : "text-[#68716d]"
                          }`}
                        >
                          <Icon size={12} aria-hidden="true" />
                          {item.label}
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Main content */}
                <div className="flex-1 p-4 md:p-5">
                  {/* Mini stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {miniStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"
                      >
                        <p className="text-[9px] uppercase tracking-wider text-[#68716d]">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {stat.value}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] text-[#9dfcc7]">
                          {stat.change}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="mb-3 text-[10px] uppercase tracking-wider text-[#68716d]">
                      Signal Volume
                    </p>
                    <div
                      className="flex items-end gap-2"
                      style={{ height: "80px" }}
                      role="img"
                      aria-label="Bar chart showing signal volume"
                    >
                      {barHeights.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            background: `linear-gradient(to top, rgba(157,252,199,0.3), rgba(133,232,255,0.6))`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Activity feed */}
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-[#68716d]">
                      Recent Activity
                    </p>
                    <ul className="flex flex-col gap-2" role="list" aria-label="Activity feed">
                      {activityItems.map((item) => (
                        <li
                          key={item.text}
                          className="flex items-center gap-2 text-[11px] text-[#929b97]"
                        >
                          <span
                            className="size-1.5 shrink-0 rounded-full bg-[#9dfcc7]"
                            aria-hidden="true"
                          />
                          <span className="flex-1 truncate">{item.text}</span>
                          <span className="shrink-0 font-mono text-[9px] text-[#5a625f]">
                            {item.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/login" className="primary-button px-6">
            Enter the workspace →
          </Link>
        </div>
      </div>
    </section>
  );
}
