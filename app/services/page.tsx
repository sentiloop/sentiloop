import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServicesHero } from "@/components/services/services-hero";
import { ServiceCards } from "@/components/services/service-cards";
import { TechnologyEcosystem } from "@/components/services/technology-ecosystem";
import { IndustriesSection } from "@/components/services/industries-section";
import { ProcessSection } from "@/components/services/process-section";
import { TrustSection } from "@/components/services/trust-section";
import { ServicesCTA } from "@/components/services/services-cta";

export const metadata: Metadata = {
  title: "Technology Services",
  description:
    "Sentiloop delivers enterprise-grade technology services across six core areas: Cybersecurity, AI, Web & Software Development, Blockchain, SOC, and Cloud Solutions.",
  robots: { index: true, follow: true },
};

export default function ServicesPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServicesHero />
        <ServiceCards />
        <TechnologyEcosystem />
        <IndustriesSection />
        <ProcessSection />
        <TrustSection />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}
