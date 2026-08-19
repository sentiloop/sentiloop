import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "Cybersecurity Services",
  description:
    "Enterprise-grade cybersecurity protection. From vulnerability assessments to incident response, Sentiloop safeguards your digital infrastructure against evolving threats.",
  robots: { index: true, follow: true },
};

export default function CybersecurityPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServiceDetail
          name="Cybersecurity"
          tagline="Enterprise-grade protection for the digital age"
          description="Comprehensive cybersecurity services that protect your organization from evolving threats while enabling secure digital transformation."
          color="#62d9ff"
          iconName="Shield"
          services={[
            "Cybersecurity Assessment",
            "Vulnerability Assessment",
            "Penetration Testing",
            "Web Application Security",
            "API Security",
            "Network Security",
            "Cloud Security",
            "Identity & Access Management",
            "Zero Trust Security",
            "Security Hardening",
            "Security Risk Assessment",
            "Security Compliance",
            "Incident Response",
            "Digital Forensics",
            "Threat Intelligence",
            "Security Awareness",
          ]}
          approach={[
            {
              title: "Proactive Defense",
              description:
                "We identify vulnerabilities before attackers do, using advanced threat modeling and continuous security assessments to stay ahead of emerging risks.",
            },
            {
              title: "Continuous Monitoring",
              description:
                "Real-time visibility into your security posture with 24×7 monitoring, behavioral analytics, and automated threat detection across your entire attack surface.",
            },
            {
              title: "Rapid Response",
              description:
                "When incidents occur, our battle-tested response teams contain, remediate, and recover with minimal business disruption and full forensic clarity.",
            },
          ]}
          process={[
            {
              step: "01",
              title: "Assess",
              description:
                "Comprehensive security assessment to map your attack surface, identify vulnerabilities, and evaluate your current security posture against industry frameworks.",
            },
            {
              step: "02",
              title: "Design",
              description:
                "Architect a layered defense strategy tailored to your risk profile, compliance requirements, and business objectives with clear priorities and roadmap.",
            },
            {
              step: "03",
              title: "Implement",
              description:
                "Deploy security controls, configure monitoring systems, and harden infrastructure with minimal disruption to ongoing operations.",
            },
            {
              step: "04",
              title: "Monitor",
              description:
                "Continuous security monitoring, regular testing, and adaptive improvements to maintain resilience against the evolving threat landscape.",
            },
          ]}
          benefits={[
            {
              title: "Reduced Risk Exposure",
              description:
                "Dramatically lower your attack surface and vulnerability count through proactive identification and systematic remediation of security gaps.",
            },
            {
              title: "Compliance Readiness",
              description:
                "Meet regulatory requirements including SOC 2, ISO 27001, GDPR, HIPAA, and PCI-DSS with audit-ready documentation and controls.",
            },
            {
              title: "Business Continuity",
              description:
                "Ensure uninterrupted operations with resilient security architecture, tested incident response plans, and rapid recovery capabilities.",
            },
            {
              title: "Stakeholder Confidence",
              description:
                "Build trust with customers, partners, and investors through demonstrated security maturity and transparent security practices.",
            },
          ]}
          useCases={[
            "Enterprise Network Protection",
            "Cloud Migration Security",
            "Regulatory Compliance Audit",
            "Post-Breach Recovery",
            "M&A Security Due Diligence",
            "Third-Party Risk Management",
          ]}
          industries={[
            "Financial Services",
            "Healthcare",
            "Government",
            "Technology",
            "Manufacturing",
          ]}
          faq={[
            {
              question: "How long does a comprehensive security assessment take?",
              answer:
                "A full security assessment typically takes 2–4 weeks depending on the scope and complexity of your infrastructure. This includes vulnerability scanning, penetration testing, configuration reviews, and a detailed findings report with prioritized remediation guidance.",
            },
            {
              question: "Do you support compliance frameworks like SOC 2 and ISO 27001?",
              answer:
                "Yes. We help organizations achieve and maintain compliance across major frameworks including SOC 2, ISO 27001, GDPR, HIPAA, PCI-DSS, and NIST CSF. Our approach integrates compliance requirements into your security architecture from day one.",
            },
            {
              question: "What happens when a security incident is detected?",
              answer:
                "Our incident response team follows a structured playbook: immediate containment, root cause analysis, evidence preservation, full remediation, and post-incident review. We provide real-time communication throughout and a comprehensive incident report upon resolution.",
            },
            {
              question: "Can you secure hybrid and multi-cloud environments?",
              answer:
                "Absolutely. We specialize in securing complex environments spanning on-premise infrastructure, AWS, Azure, GCP, and hybrid configurations. Our approach ensures consistent security policies and visibility across all environments.",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
