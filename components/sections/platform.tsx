import { ArrowUpRight, Bot, Braces, Layers3, Radio, Sparkles } from "lucide-react";
import { Stagger, StaggerItem, VisualReveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function PulseVisual() {
  return (
    <div className="relative mt-8 h-44 overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
      <div data-parallax="4" className="absolute inset-0 grid-surface opacity-70" />
      <svg viewBox="0 0 500 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="pulse" x1="0" x2="1"><stop stopColor="#9f91ff"/><stop offset=".5" stopColor="#9dfcc7"/><stop offset="1" stopColor="#85e8ff"/></linearGradient></defs>
        <path d="M0 120 C42 120 44 70 76 70 S118 138 151 110 S191 37 230 82 S276 146 310 103 S347 58 380 89 S421 121 500 45" fill="none" stroke="url(#pulse)" strokeWidth="2" />
        <path d="M0 120 C42 120 44 70 76 70 S118 138 151 110 S191 37 230 82 S276 146 310 103 S347 58 380 89 S421 121 500 45 L500 180 L0 180 Z" fill="url(#pulse)" opacity=".08" />
      </svg>
      <div className="glass-panel absolute left-[43%] top-[24%] rounded-lg px-2.5 py-2">
        <p className="font-mono text-[8px] uppercase tracking-wider text-[#737c78]">Emerging signal</p>
        <p className="mt-1 text-[10px] text-[#c9d1cd]">Onboarding friction <span className="text-[#9dfcc7]">+31%</span></p>
      </div>
    </div>
  );
}

function LoopVisual() {
  return (
    <div className="relative mt-8 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
      <div className="absolute size-40 rounded-full border border-dashed border-white/10" />
      <div className="absolute size-28 rounded-full border border-[#9dfcc7]/20" />
      <div className="absolute left-1/2 top-1/2 h-px w-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#9dfcc7]/40 to-transparent" />
      <div className="z-10 grid size-16 place-items-center rounded-2xl border border-[#9dfcc7]/20 bg-[#9dfcc7]/[0.08] shadow-[0_0_60px_rgba(157,252,199,.12)]">
        <Bot size={24} strokeWidth={1.4} className="text-[#bfffd7]" />
      </div>
      {[["Notion", "top-3 left-3"], ["Slack", "bottom-3 left-5"], ["Linear", "right-3 top-5"]].map(([name, position]) => (
        <span key={name} className={`glass-panel absolute ${position} rounded-lg px-2.5 py-1.5 font-mono text-[9px] text-[#9ba49f]`}>{name}</span>
      ))}
    </div>
  );
}

export function Platform() {
  return (
    <section id="platform" className="section-pad overflow-hidden">
      <div className="container-shell">
        <SectionHeading
          eyebrow="The sensing layer"
          title="Your customers never stop talking. Now you never stop understanding."
          description="One intelligence layer connects the scattered moments across your business, revealing the patterns no dashboard can see alone."
        />

        <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <StaggerItem preset="tilt" className="glass-panel group relative overflow-hidden rounded-[28px] p-6 md:p-8 lg:col-span-7">
            <div className="absolute right-0 top-0 size-52 bg-[#9dfcc7]/[0.05] blur-[70px]" />
            <div className="relative">
              <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"><Radio size={18} className="text-[#9dfcc7]" /></span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#58605d]">01 / Sense</span></div>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.045em]">Semantic pulse map</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#858e8a]">Watch needs, friction, and intent emerge across every channel before they become trends everyone else can see.</p>
              <VisualReveal delay={0.12}><PulseVisual /></VisualReveal>
            </div>
          </StaggerItem>

          <StaggerItem preset="tilt" className="glass-panel relative overflow-hidden rounded-[28px] p-6 md:p-8 lg:col-span-5">
            <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"><Sparkles size={18} className="text-[#a99cff]" /></span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#58605d]">02 / Act</span></div>
            <h3 className="mt-6 text-2xl font-medium tracking-[-0.045em]">Autonomous loops</h3>
            <p className="mt-3 text-sm leading-6 text-[#858e8a]">Turn signal into action with agents that brief, route, and resolve—always inside your guardrails.</p>
            <VisualReveal delay={0.16}><LoopVisual /></VisualReveal>
          </StaggerItem>

          <StaggerItem preset="tilt" className="glass-panel relative overflow-hidden rounded-[28px] p-6 md:p-8 lg:col-span-5">
            <div className="absolute -bottom-10 -right-10 size-48 rounded-full bg-[#85e8ff]/[0.06] blur-[60px]" />
            <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"><Layers3 size={18} className="text-[#85e8ff]" /></span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#58605d]">03 / Align</span></div>
            <h3 className="mt-6 text-2xl font-medium tracking-[-0.045em]">One truth, every team</h3>
            <p className="mt-3 text-sm leading-6 text-[#858e8a]">Product, support, and growth see the same live story—with answers shaped for the decisions they own.</p>
            <div className="mt-8 flex -space-x-2">
              {["P", "S", "G", "R"].map((letter, i) => <span key={letter} className="grid size-10 place-items-center rounded-full border-2 border-[#101311] text-xs font-medium" style={{ background: ["#293d35", "#35304b", "#253b42", "#3d3529"][i] }}>{letter}</span>)}
              <span className="grid size-10 place-items-center rounded-full border-2 border-[#101311] bg-[#161a18] text-xs text-[#89918e]">+12</span>
            </div>
          </StaggerItem>

          <StaggerItem preset="tilt" className="glass-panel relative overflow-hidden rounded-[28px] p-6 md:p-8 lg:col-span-7">
            <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"><Braces size={18} className="text-[#9dfcc7]" /></span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#58605d]">04 / Connect</span></div>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div><h3 className="mt-6 text-2xl font-medium tracking-[-0.045em]">Built for your stack, not around it</h3><p className="mt-3 max-w-lg text-sm leading-6 text-[#858e8a]">Connect the tools where conversations already happen. Sentiloop starts learning in minutes, with zero migration.</p></div>
              <a href="#contact" className="inline-flex items-center gap-2 text-xs font-medium text-[#cbd3cf] transition-colors hover:text-white">Explore 100+ connectors <ArrowUpRight size={14} /></a>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">{["Salesforce", "Intercom", "HubSpot", "Zendesk", "Snowflake"].map((item) => <span key={item} className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-[10px] text-[#89918d]">{item}</span>)}</div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
