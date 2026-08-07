import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "Web & Software Development",
  description:
    "Full-stack engineering from concept to deployment. Sentiloop builds modern web applications, mobile platforms, APIs, and enterprise systems with cutting-edge technology.",
  robots: { index: true, follow: true },
};

export default function DevelopmentPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServiceDetail
          name="Web & Software Development"
          tagline="Modern applications built for scale"
          description="Full-stack engineering from concept to deployment—web applications, mobile platforms, APIs, and enterprise systems built with cutting-edge technology."
          color="#9dfcc7"
          iconName="Code2"
          services={[
            "Corporate Websites",
            "SaaS Platforms",
            "Enterprise Applications",
            "E-commerce",
            "Custom Web Applications",
            "Mobile Applications",
            "API Development",
            "Backend Development",
            "Cloud-native Applications",
            "UI/UX Engineering",
            "Progressive Web Apps",
            "CRM/ERP Development",
            "API Integrations",
            "Legacy Modernization",
            "DevOps & CI/CD",
          ]}
          approach={[
            {
              title: "Architecture First",
              description:
                "Every project begins with thoughtful system design. We map data flows, define boundaries, and choose technology stacks that align with your scale and team capabilities.",
            },
            {
              title: "Iterative Delivery",
              description:
                "We ship working software early and often. Two-week sprints with demos keep you in control while momentum compounds toward the full vision.",
            },
            {
              title: "Quality Engineering",
              description:
                "Automated testing, code reviews, and CI/CD pipelines ensure every release meets production standards for performance, security, and reliability.",
            },
          ]}
          process={[
            {
              step: "01",
              title: "Define",
              description:
                "Collaborative discovery to define requirements, user stories, technical architecture, and a clear product roadmap with milestones.",
            },
            {
              step: "02",
              title: "Design",
              description:
                "UI/UX design and system architecture that balances user delight with technical feasibility and long-term maintainability.",
            },
            {
              step: "03",
              title: "Develop",
              description:
                "Agile development with continuous integration, automated testing, and regular deployments to staging for ongoing validation.",
            },
            {
              step: "04",
              title: "Deploy & Evolve",
              description:
                "Production deployment with monitoring, performance optimization, and ongoing iteration based on real user feedback and analytics.",
            },
          ]}
          benefits={[
            {
              title: "Faster Time to Market",
              description:
                "Proven frameworks and component libraries accelerate development without sacrificing quality, getting your product to users sooner.",
            },
            {
              title: "Scalable Architecture",
              description:
                "Systems designed to handle growth from day one—whether that means 100 users or 10 million, your infrastructure scales with demand.",
            },
            {
              title: "Reduced Technical Debt",
              description:
                "Clean code, comprehensive documentation, and modern patterns mean your codebase remains maintainable and extensible for years.",
            },
            {
              title: "Seamless Integration",
              description:
                "APIs and services built for interoperability, connecting smoothly with your existing ecosystem and third-party platforms.",
            },
          ]}
          useCases={[
            "SaaS Platform Launch",
            "Legacy System Modernization",
            "E-commerce Marketplace",
            "Internal Tooling",
            "Mobile App Development",
            "API Gateway & Microservices",
          ]}
          industries={[
            "Technology & SaaS",
            "Retail & E-commerce",
            "Financial Services",
            "Healthcare",
            "Education",
          ]}
          faq={[
            {
              question: "What technology stacks do you work with?",
              answer:
                "We work across modern stacks including React, Next.js, Vue, Node.js, Python, Go, and Rust for backends. For mobile, we use React Native and Swift/Kotlin. We recommend stacks based on your specific requirements, team expertise, and long-term maintainability.",
            },
            {
              question: "How do you handle project scope and timeline?",
              answer:
                "We use agile methodology with fixed two-week sprints. After initial discovery, we provide a detailed roadmap with milestones. Scope changes are managed through backlog prioritization, keeping delivery predictable while remaining flexible.",
            },
            {
              question: "Do you provide ongoing maintenance after launch?",
              answer:
                "Yes. We offer flexible maintenance packages including bug fixes, security updates, performance monitoring, feature enhancements, and dedicated support SLAs tailored to your operational needs.",
            },
            {
              question: "Can you take over an existing codebase?",
              answer:
                "Absolutely. We conduct thorough code audits, document the current state, and create a modernization plan. Whether it is incremental refactoring or a phased rewrite, we bring legacy systems up to modern standards.",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
