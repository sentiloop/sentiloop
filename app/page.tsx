import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { ScrollChoreography } from "@/components/motion/scroll-choreography";
import { AIShowcase } from "@/components/sections/ai-showcase";
import { CTA } from "@/components/sections/cta";
import { FeatureSlider } from "@/components/sections/feature-slider";
import { Hero } from "@/components/sections/hero";
import { HolographicCards } from "@/components/sections/holographic-cards";
import { Intelligence } from "@/components/sections/intelligence";
import { Platform } from "@/components/sections/platform";
import { Results } from "@/components/sections/results";
import { SignalStrip } from "@/components/sections/signal-strip";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { Workflow } from "@/components/sections/workflow";

export default function Home() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <ScrollChoreography />
      <Navigation />
      <main>
        <Hero />
        <SignalStrip />
        <FeatureSlider />
        <Platform />
        <Workflow />
        <Intelligence />
        <AIShowcase />
        <HolographicCards />
        <TestimonialsCarousel />
        <Results />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
