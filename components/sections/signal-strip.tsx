import { MaskReveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const companies = ["AERIUM", "northstar", "MONOLITH", "PLAIN", "VANTAGE", "arc"];

export function SignalStrip() {
  return (
    <section className="border-y border-white/[0.07] py-10">
      <div className="container-shell">
        <MaskReveal>
          <p className="text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#555d5a]">
            Trusted where every customer signal matters
          </p>
        </MaskReveal>
        <Stagger className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6" stagger={0.065}>
          {companies.map((company, index) => (
            <StaggerItem key={company} preset="scale">
              <span
                className={`block text-center text-sm font-semibold text-[#606865] ${index % 2 ? "tracking-[-0.04em]" : "tracking-[0.09em]"}`}
              >
                {company}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
