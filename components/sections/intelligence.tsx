"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BellRing, CircleCheck, MessageCircleMore, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Reveal, VisualReveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const tabs = [
  { id: "pulse", label: "Live pulse" },
  { id: "themes", label: "Themes" },
  { id: "actions", label: "Actions" },
];

const bars = [46, 58, 50, 69, 62, 83, 74, 92, 86, 96, 78, 89];

function Dashboard({ active }: { active: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="grid gap-3 p-3 md:grid-cols-[1fr_0.72fr] md:p-4">
        <div className="rounded-2xl border border-white/[0.07] bg-[#080b0a] p-4 md:p-5">
          <div className="flex items-start justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#626b67]">Customer resonance</p><div className="mt-2 flex items-end gap-2"><span className="text-3xl font-medium tracking-[-0.06em]">84.6</span><span className="mb-1 rounded-full bg-[#9dfcc7]/10 px-2 py-1 text-[9px] text-[#9dfcc7]">↑ 12.4%</span></div></div><TrendingUp size={17} className="text-[#9dfcc7]" /></div>
          <div className="mt-8 flex h-36 items-end gap-1.5 md:gap-2">{bars.map((height, index) => <div key={index} className="group relative flex-1 rounded-t-sm bg-white/[0.045]" style={{ height: `${height}%` }}><div className="metric-shimmer absolute inset-x-0 bottom-0 rounded-t-sm transition-all duration-500 group-hover:brightness-125" style={{ height: `${Math.max(18, height - 24)}%`, opacity: 0.45 + index * 0.025 }} /></div>)}</div>
          <div className="mt-3 flex justify-between font-mono text-[8px] uppercase tracking-wider text-[#48504d]"><span>May 01</span><span>Live signal</span></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#080b0a] p-4"><div className="flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#626b67]">Emerging now</p><BellRing size={14} className="text-[#a99cff]" /></div><p className="mt-5 text-sm font-medium">Teams want shared workspaces</p><p className="mt-2 text-xs leading-5 text-[#737d78]">Mention velocity is 3.2× baseline across enterprise accounts.</p><div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#9f91ff] to-[#9dfcc7]" /></div></div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#080b0a] p-4"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#626b67]">Loop impact</p><div className="mt-4 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#9dfcc7]/10"><CircleCheck size={17} className="text-[#9dfcc7]" /></span><div><p className="text-lg font-medium tracking-[-0.04em]">1,284</p><p className="text-[10px] text-[#6f7874]">customers recovered</p></div></div></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Intelligence() {
  const [active, setActive] = useState("pulse");
  return (
    <section id="intelligence" className="section-pad relative overflow-hidden">
      <div data-parallax="6" className="absolute right-[-15%] top-[20%] size-[600px] rounded-full bg-[#9f91ff]/[0.05] blur-[120px]" />
      <div className="container-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Living intelligence" title="Not another dashboard. A point of view." description="Ask what changed, why it matters, and what to do. Sentiloop connects the evidence, explains its confidence, and keeps learning after you act." />
            <Reveal delay={0.16}>
              <div className="mt-8 space-y-4">
                {["Answers grounded in every source", "Proactive alerts without alert fatigue", "Impact measured back to the customer"].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-[#a0a9a5]"><CircleCheck size={16} className="text-[#9dfcc7]" />{item}</div>)}
              </div>
              <a href="#contact" className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-[#dce3df]">Explore Sentiloop intelligence <ArrowUpRight size={15} /></a>
            </Reveal>
          </div>
          <VisualReveal delay={0.1} className="relative">
            <div className="absolute inset-8 rounded-full bg-[#9dfcc7]/10 blur-[90px]" />
            <div className="glass-panel relative overflow-hidden rounded-[28px]">
              <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between md:px-5"><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-[#9dfcc7]/10"><MessageCircleMore size={13} className="text-[#9dfcc7]" /></span><span className="text-xs font-medium">Intelligence canvas</span></div><div className="flex rounded-full border border-white/[0.08] bg-black/20 p-1">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActive(tab.id)} className={`relative rounded-full px-3 py-1.5 text-[10px] transition-colors ${active === tab.id ? "text-white" : "text-[#68716d] hover:text-[#aab1ae]"}`}>{active === tab.id ? <motion.span layoutId="active-intelligence-tab" className="absolute inset-0 rounded-full bg-white/[0.09]" /> : null}<span className="relative">{tab.label}</span></button>)}</div></div>
              <Dashboard active={active} />
              <div className="border-t border-white/[0.07] p-3 md:p-4"><div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3"><span className="size-1.5 rounded-full bg-[#9dfcc7] shadow-[0_0_10px_#9dfcc7]" /><p className="flex-1 text-[11px] text-[#707975]">Ask Sentiloop what needs your attention...</p><span className="rounded-md border border-white/10 px-1.5 py-1 font-mono text-[8px] text-[#5e6763]">⌘ K</span></div></div>
            </div>
          </VisualReveal>
        </div>
      </div>
    </section>
  );
}
