import { ArrowDown, DatabaseZap, ScanSearch, WandSparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { number: "01", icon: DatabaseZap, title: "Connect the noise", description: "Bring conversations, tickets, calls, reviews, and product behavior into one secure stream." },
  { number: "02", icon: ScanSearch, title: "Understand the why", description: "Sentiloop maps emotion, intent, urgency, and context—not just keywords or positive versus negative." },
  { number: "03", icon: WandSparkles, title: "Close the loop", description: "Route insights, trigger workflows, and track whether every action actually changed the customer experience." },
];

export function Workflow() {
  return (
    <section id="workflow" className="section-pad border-y border-white/[0.06] bg-[#080a0a]">
      <div className="container-shell">
        <SectionHeading eyebrow="How it works" title="From raw signal to real movement." description="A continuous loop that gets clearer with every customer interaction and smarter with every decision your team makes." centered />
        <Stagger className="relative mt-16 grid gap-4 lg:grid-cols-3">
          <div data-gsap-line className="absolute left-[16.6%] right-[16.6%] top-10 hidden h-px bg-gradient-to-r from-transparent via-[#9dfcc7]/25 to-transparent lg:block" />
          {steps.map((step, index) => (
            <StaggerItem key={step.number} preset="scale" className="glass-panel group relative rounded-[26px] p-6 md:p-8">
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.16em] text-[#69716e]">{step.number}</span><span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-[#0d100f] transition-transform duration-500 group-hover:-translate-y-1"><step.icon size={19} strokeWidth={1.5} className="text-[#aeeec6]" /></span></div>
              <h3 className="mt-16 text-xl font-medium tracking-[-0.04em]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#7f8884]">{step.description}</p>
              {index < steps.length - 1 ? <ArrowDown size={15} className="absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2 text-[#9dfcc7] lg:hidden" /> : null}
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.2} className="mt-10 text-center">
          <a href="#contact" className="secondary-button">See how your loop works <span aria-hidden="true">→</span></a>
        </Reveal>
      </div>
    </section>
  );
}
