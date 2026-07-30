import { Quote } from "lucide-react";
import { MaskReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const results = [
  ["42%", "less time finding the why"],
  ["3.4×", "faster response to emerging risk"],
  ["18pt", "average lift in customer trust"],
];

export function Results() {
  return (
    <section id="company" className="section-pad border-y border-white/[0.06] bg-[#080a0a]">
      <div className="container-shell">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Quote size={26} strokeWidth={1.2} className="mx-auto text-[#9dfcc7]" />
          <MaskReveal delay={0.08}>
            <blockquote className="mt-8 text-[clamp(1.8rem,4.5vw,3.8rem)] font-medium leading-[1.08] tracking-[-0.055em] text-[#e9eeeb]">
              “Sentiloop didn’t give us more data. It gave 300 people the same clear instinct about what customers needed next.”
            </blockquote>
          </MaskReveal>
          <div className="mt-8"><p className="text-sm font-medium">Maya Chen</p><p className="mt-1 text-xs text-[#68716d]">Chief Experience Officer, Northstar</p></div>
        </Reveal>
        <Stagger className="mt-16 grid overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.025] sm:grid-cols-3">
          {results.map(([value, label], index) => <StaggerItem preset="scale" key={value} className={`p-7 text-center md:p-9 ${index ? "border-t border-white/[0.07] sm:border-l sm:border-t-0" : ""}`}><p className="text-4xl font-medium tracking-[-0.06em] text-white md:text-5xl">{value}</p><p className="mt-3 text-xs text-[#737c78]">{label}</p></StaggerItem>)}
        </Stagger>
      </div>
    </section>
  );
}
