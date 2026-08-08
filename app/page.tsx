import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { ScrollChoreography } from "@/components/motion/scroll-choreography";
import { AIShowcase } from "@/components/sections/ai-showcase";
import { CounterStats } from "@/components/sections/counter-stats";
import { CTA } from "@/components/sections/cta";
import { FeatureSlider } from "@/components/sections/feature-slider";
import { Hero } from "@/components/sections/hero";
import { HolographicCards } from "@/components/sections/holographic-cards";
import { Intelligence } from "@/components/sections/intelligence";
import { LiveDemo } from "@/components/sections/live-demo";
import { Platform } from "@/components/sections/platform";
import { PricingSection } from "@/components/sections/pricing-section";
import { Results } from "@/components/sections/results";
import { ServicesOverview } from "@/components/sections/services-overview";
import { SignalStrip } from "@/components/sections/signal-strip";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { Workflow } from "@/components/sections/workflow";
import { MouseTrail } from "@/components/effects/mouse-trail";
import { MorphingBlobs } from "@/components/effects/morphing-blobs";
import { TextScramble } from "@/components/effects/text-scramble";
import { ScrollGallery } from "@/components/sections/scroll-gallery";

export default function Home() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <MouseTrail />
      <ScrollChoreography />
      <Navigation />
      <main>
        <Hero />
        <SignalStrip />
        <ServicesOverview />
        <CounterStats />
        <FeatureSlider />
        <Platform />
        <Workflow />
        <Intelligence />
        <AIShowcase />
        <HolographicCards />
        <TestimonialsCarousel />
        <PricingSection />
        <div className="container-shell">
          <TextScramble
            text="Explore the data visually"
            tag="p"
            className="eyebrow mb-4 text-xs tracking-widest uppercase text-[#b8c0bd]"
          />
        </div>
        <ScrollGallery />
        <Results />
        <LiveDemo />
        <section className="relative">
          <MorphingBlobs />
          <CTA />
        </section>
      </main>
      <Footer />
    </>
  );
}
