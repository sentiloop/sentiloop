import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "AI Services",
  description:
    "Transform your business with intelligent AI solutions. From generative AI and custom models to predictive analytics, Sentiloop builds systems that think, decide, and act.",
  robots: { index: true, follow: true },
};

export default function AIPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServiceDetail
          name="AI Services"
          tagline="Intelligent automation for the next era"
          description="From generative AI to predictive analytics, we build intelligent systems that transform how organizations think, decide, and act."
          color="#a99cff"
          iconName="Brain"
          services={[
            "Generative AI",
            "AI Agents",
            "AI Chatbots",
            "AI Automation",
            "Machine Learning",
            "Predictive Analytics",
            "Computer Vision",
            "Natural Language Processing",
            "AI-powered Cybersecurity",
            "Document Intelligence",
            "Recommendation Systems",
            "Custom AI Models",
            "AI Integration",
            "Enterprise AI Consulting",
            "RAG / Knowledge Systems",
          ]}
          approach={[
            {
              title: "Data-First Strategy",
              description:
                "Every AI solution starts with understanding your data landscape. We assess data quality, identify high-value use cases, and design pipelines that feed reliable intelligence.",
            },
            {
              title: "Iterative Development",
              description:
                "We build AI systems incrementally—prototype, validate, refine. Each iteration is measured against real business KPIs to ensure tangible value delivery.",
            },
            {
              title: "Responsible AI",
              description:
                "Transparency, fairness, and accountability are built into every model. We implement explainability layers, bias detection, and governance frameworks from the start.",
            },
          ]}
          process={[
            {
              step: "01",
              title: "Discover",
              description:
                "Identify high-impact AI opportunities through workshops, data audits, and feasibility analysis aligned with your strategic goals.",
            },
            {
              step: "02",
              title: "Prototype",
              description:
                "Rapidly build proof-of-concept models to validate hypotheses, measure potential ROI, and de-risk the full implementation.",
            },
            {
              step: "03",
              title: "Build",
              description:
                "Engineer production-grade AI systems with robust data pipelines, model training infrastructure, and integration APIs.",
            },
            {
              step: "04",
              title: "Scale",
              description:
                "Deploy, monitor, and continuously improve models in production with MLOps best practices, A/B testing, and automated retraining.",
            },
          ]}
          benefits={[
            {
              title: "Operational Efficiency",
              description:
                "Automate repetitive tasks and complex decision-making processes, freeing your team to focus on high-value strategic work.",
            },
            {
              title: "Predictive Insights",
              description:
                "Anticipate market shifts, customer behavior, and operational risks with models trained on your unique data patterns.",
            },
            {
              title: "Competitive Advantage",
              description:
                "Deploy AI capabilities that differentiate your products and services, creating moats competitors cannot easily replicate.",
            },
            {
              title: "Revenue Growth",
              description:
                "Unlock new revenue streams through personalization, intelligent pricing, automated content generation, and smarter customer engagement.",
            },
          ]}
          useCases={[
            "Intelligent Document Processing",
            "Customer Service Automation",
            "Predictive Maintenance",
            "Fraud Detection",
            "Content Generation at Scale",
            "Supply Chain Optimization",
          ]}
          industries={[
            "Financial Services",
            "Healthcare",
            "Retail & E-commerce",
            "Manufacturing",
            "Media & Entertainment",
          ]}
          faq={[
            {
              question: "Do we need large datasets to start with AI?",
              answer:
                "Not necessarily. We can begin with transfer learning, synthetic data augmentation, or pre-trained foundation models that require minimal fine-tuning. We assess your data maturity and recommend the most pragmatic starting point.",
            },
            {
              question: "How do you ensure AI models remain accurate over time?",
              answer:
                "We implement MLOps practices including continuous monitoring, data drift detection, automated retraining pipelines, and performance benchmarking to maintain model accuracy as conditions evolve.",
            },
            {
              question: "Can AI solutions integrate with our existing systems?",
              answer:
                "Yes. We design AI systems with integration-first architecture, providing REST APIs, webhook events, and native connectors for common platforms like Salesforce, SAP, and custom applications.",
            },
            {
              question: "What about data privacy and AI governance?",
              answer:
                "We build AI solutions with privacy-by-design principles, supporting on-premise deployment, data anonymization, access controls, and full audit trails. Our governance frameworks align with emerging AI regulations.",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
