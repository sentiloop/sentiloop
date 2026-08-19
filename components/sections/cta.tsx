import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { MaskReveal, VisualReveal } from "@/components/motion/reveal";

export function CTA() {
  return (
    <section id="contact" className="section-pad overflow-hidden">
      <div className="container-shell">
        <VisualReveal>
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#0b0e0d] px-6 py-16 text-center shadow-[0_40px_120px_rgba(0,0,0,.45)] md:px-12 md:py-24">
            <div data-parallax="3" className="grid-surface absolute inset-0 opacity-60" />
            <div data-parallax="7" className="absolute left-1/2 top-[-55%] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#9dfcc7]/[0.1] blur-[100px]" />
            <div className="absolute bottom-[-60%] right-[-10%] size-[500px] rounded-full bg-[#9f91ff]/[0.08] blur-[110px]" />
            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="eyebrow justify-center">Your loop starts here</span>
              <MaskReveal delay={0.08} className="-mb-2 pb-2">
                <h2 className="mt-5 text-[clamp(2.7rem,7vw,6rem)] font-medium leading-[0.96] tracking-[-0.07em]">Ready to build<br /><span className="mint-gradient">what&apos;s next?</span></h2>
              </MaskReveal>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#89928e] md:text-base">Let&apos;s transform your technology challenges into secure, intelligent and scalable digital solutions.</p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/login" className="primary-button">Start a Conversation <ArrowRight size={16} /></Link><Link href="/services" className="secondary-button">View Services</Link></div>
              <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">{["15-minute setup", "No engineering lift", "Cancel anytime"].map((item) => <span key={item} className="inline-flex items-center gap-1.5 text-[10px] text-[#68716d]"><Check size={11} className="text-[#9dfcc7]" />{item}</span>)}</div>
            </div>
          </div>
        </VisualReveal>
      </div>
    </section>
  );
}
