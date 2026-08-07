import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "Cloud Services",
  description:
    "End-to-end cloud services from migration to optimization. Sentiloop architects reliable, cost-efficient, and secure cloud environments for the modern enterprise.",
  robots: { index: true, follow: true },
};

export default function CloudPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServiceDetail
          name="Cloud Services"
          tagline="Scalable infrastructure for the modern enterprise"
          description="End-to-end cloud services from migration to optimization—architecting reliable, cost-efficient, and secure cloud environments."
          color="#85e8ff"
          iconName="Cloud"
          services={[
            "Cloud Consulting",
            "Cloud Migration",
            "Cloud Architecture",
            "Cloud Security",
            "Cloud Infrastructure",
            "AWS Solutions",
            "Microsoft Azure Solutions",
            "Google Cloud Solutions",
            "Cloud Cost Optimization",
            "DevOps",
            "CI/CD",
            "Kubernetes",
            "Docker",
            "Serverless",
            "Backup & Disaster Recovery",
            "High Availability",
            "Cloud Monitoring",
          ]}
          approach={[
            {
              title: "Cloud-Native Thinking",
              description:
                "We design for the cloud, not just in the cloud. Leveraging managed services, serverless patterns, and distributed architectures that maximize platform capabilities.",
            },
            {
              title: "Cost-Conscious Engineering",
              description:
                "Every architecture decision considers cost implications. We implement FinOps practices, right-sizing, and automated scaling to optimize your cloud spend.",
            },
            {
              title: "Resilience by Design",
              description:
                "Multi-region deployments, automated failover, and chaos engineering ensure your systems remain available even when individual components fail.",
            },
          ]}
          process={[
            {
              step: "01",
              title: "Assess",
              description:
                "Evaluate your current infrastructure, workload requirements, and organizational readiness to create a detailed cloud adoption or optimization strategy.",
            },
            {
              step: "02",
              title: "Architect",
              description:
                "Design cloud architecture with security, scalability, and cost efficiency as core pillars. Define networking, identity, data, and compute strategies.",
            },
            {
              step: "03",
              title: "Migrate & Build",
              description:
                "Execute migration with minimal downtime using proven patterns—rehost, refactor, or rebuild based on each workload's strategic importance.",
            },
            {
              step: "04",
              title: "Optimize & Operate",
              description:
                "Continuous monitoring, cost optimization, performance tuning, and infrastructure-as-code management for long-term operational excellence.",
            },
          ]}
          benefits={[
            {
              title: "Elastic Scalability",
              description:
                "Scale resources up or down instantly based on demand, handling traffic spikes without over-provisioning or performance degradation.",
            },
            {
              title: "Reduced Operational Costs",
              description:
                "Eliminate data center overhead, optimize resource utilization, and leverage pay-as-you-go pricing to align infrastructure costs with business value.",
            },
            {
              title: "Global Availability",
              description:
                "Deploy applications across multiple regions to minimize latency for global users and ensure business continuity through geographic redundancy.",
            },
            {
              title: "Accelerated Innovation",
              description:
                "Leverage managed services and infrastructure automation to reduce time spent on undifferentiated heavy lifting and ship features faster.",
            },
          ]}
          useCases={[
            "Data Center Migration",
            "Kubernetes Platform Engineering",
            "Serverless Architecture",
            "Multi-Cloud Strategy",
            "Disaster Recovery Planning",
            "Cloud Cost Reduction",
          ]}
          industries={[
            "Technology & SaaS",
            "Financial Services",
            "Healthcare",
            "Media & Streaming",
            "E-commerce",
          ]}
          faq={[
            {
              question: "Which cloud providers do you work with?",
              answer:
                "We are certified across AWS, Microsoft Azure, and Google Cloud Platform. We help you choose the right provider—or multi-cloud strategy—based on your workloads, compliance needs, existing tooling, and budget.",
            },
            {
              question: "How do you minimize downtime during migration?",
              answer:
                "We use phased migration strategies with parallel running, automated testing, and traffic shifting. Critical workloads get blue-green or canary deployment approaches to ensure zero or near-zero downtime transitions.",
            },
            {
              question: "Can you help reduce our existing cloud costs?",
              answer:
                "Yes. We conduct FinOps assessments that typically identify 20–40% savings through right-sizing, reserved capacity planning, spot instance strategies, unused resource elimination, and architectural optimizations.",
            },
            {
              question: "Do you manage infrastructure after deployment?",
              answer:
                "We offer managed services including 24×7 monitoring, incident response, patching, capacity planning, and continuous optimization. All infrastructure is defined as code for reproducibility and audit trails.",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
