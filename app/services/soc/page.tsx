import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "SOC Services",
  description:
    "24×7 security monitoring and defense. Sentiloop's dedicated Security Operations Center watches, detects, and responds to threats before they impact your business.",
  robots: { index: true, follow: true },
};

export default function SOCPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServiceDetail
          name="SOC Services"
          tagline="24×7 security monitoring and defense"
          description="A dedicated Security Operations Center that watches, detects, and responds to threats before they impact your business."
          color="#ff8ecf"
          iconName="Radar"
          services={[
            "24×7 Security Monitoring",
            "SIEM Management",
            "Security Alert Monitoring",
            "Threat Detection",
            "Threat Hunting",
            "Incident Response",
            "Log Management",
            "Security Analytics",
            "Endpoint Monitoring",
            "Network Monitoring",
            "Cloud Security Monitoring",
            "Vulnerability Monitoring",
            "Threat Intelligence",
            "SOC Reporting",
            "Managed Detection & Response",
          ]}
          approach={[
            {
              title: "Always-On Vigilance",
              description:
                "Our analysts monitor your environment around the clock, combining automated detection with human expertise to catch threats that automated tools miss.",
            },
            {
              title: "Threat-Informed Defense",
              description:
                "We continuously integrate global threat intelligence to tune detection rules, anticipate attacker techniques, and proactively hunt for indicators of compromise.",
            },
            {
              title: "Measured Response",
              description:
                "Every alert is triaged, contextualized, and escalated with clear severity levels—ensuring your team acts on verified threats, not false positives.",
            },
          ]}
          process={[
            {
              step: "01",
              title: "Onboard",
              description:
                "Integrate your infrastructure with our SOC platform, configure log sources, establish communication channels, and define escalation procedures.",
            },
            {
              step: "02",
              title: "Baseline",
              description:
                "Establish normal behavior patterns across your environment to enable accurate anomaly detection and reduce false positive rates.",
            },
            {
              step: "03",
              title: "Monitor & Detect",
              description:
                "Continuous monitoring with advanced correlation rules, machine learning detection, and proactive threat hunting across all data sources.",
            },
            {
              step: "04",
              title: "Respond & Report",
              description:
                "Rapid incident containment, detailed forensic analysis, and regular reporting with actionable insights to continuously improve your security posture.",
            },
          ]}
          benefits={[
            {
              title: "24×7 Coverage",
              description:
                "Round-the-clock monitoring by experienced analysts means threats are detected and addressed at any hour—weekends and holidays included.",
            },
            {
              title: "Faster Detection",
              description:
                "Reduce mean time to detect from weeks to minutes with advanced correlation, behavioral analytics, and real-time threat intelligence feeds.",
            },
            {
              title: "Reduced Alert Fatigue",
              description:
                "Our analysts triage and contextualize every alert, ensuring your team only receives verified, actionable incidents—not noise.",
            },
            {
              title: "Cost Efficiency",
              description:
                "Access enterprise-grade security operations without the capital expense of building an in-house SOC, staffing three shifts, and maintaining tooling.",
            },
          ]}
          useCases={[
            "Managed Security Monitoring",
            "Ransomware Early Detection",
            "Insider Threat Detection",
            "Compliance Log Monitoring",
            "Cloud Workload Protection",
            "Executive Threat Briefings",
          ]}
          industries={[
            "Financial Services",
            "Healthcare",
            "Government",
            "Retail",
            "Critical Infrastructure",
          ]}
          faq={[
            {
              question: "How quickly can the SOC be operational for our environment?",
              answer:
                "Typical onboarding takes 2–3 weeks, including log source integration, baseline establishment, and detection rule tuning. Critical monitoring can begin within days for urgent engagements.",
            },
            {
              question: "What is your average response time for critical alerts?",
              answer:
                "Critical alerts are triaged within 15 minutes and escalated immediately with containment recommendations. Our SLA guarantees ensure consistent, measurable response times aligned with your risk tolerance.",
            },
            {
              question: "Do you integrate with our existing security tools?",
              answer:
                "Yes. We integrate with all major SIEM platforms, EDR solutions, firewalls, cloud-native security services, and ticketing systems. Our platform-agnostic approach means you keep your existing investments.",
            },
            {
              question: "How do you handle false positives?",
              answer:
                "We continuously tune detection rules based on your environment, implement allowlists for known-good behavior, and use multi-signal correlation to validate alerts before escalation—reducing noise by up to 90%.",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
