"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

interface TechCategory {
  id: string;
  label: string;
  color: string;
  technologies: string[];
}

const categories: TechCategory[] = [
  {
    id: "ai",
    label: "AI",
    color: "#a99cff",
    technologies: ["TensorFlow", "PyTorch", "LangChain", "OpenAI", "Hugging Face", "scikit-learn", "RAG", "Vector DB"],
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    color: "#62d9ff",
    technologies: ["SIEM", "Zero Trust", "WAF", "IDS/IPS", "EDR", "SOAR", "Threat Intel", "Compliance"],
  },
  {
    id: "cloud",
    label: "Cloud",
    color: "#85e8ff",
    technologies: ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "Serverless", "CDN"],
  },
  {
    id: "web",
    label: "Web",
    color: "#9dfcc7",
    technologies: ["Next.js", "React", "Node.js", "TypeScript", "Python", "Go", "PostgreSQL", "Redis"],
  },
  {
    id: "blockchain",
    label: "Blockchain",
    color: "#ffb86c",
    technologies: ["Ethereum", "Solidity", "Web3.js", "Hardhat", "IPFS", "Smart Contracts", "Tokenization", "DeFi"],
  },
  {
    id: "devops",
    label: "DevOps",
    color: "#ff8ecf",
    technologies: ["CI/CD", "GitHub Actions", "Jenkins", "ArgoCD", "Prometheus", "Grafana", "Ansible", "Helm"],
  },
];

export function TechnologyEcosystem() {
  const [active, setActive] = useState("ai");
  const activeCategory = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section className="section-pad" aria-label="Technology ecosystem">
      <div className="container-shell">
        <SectionHeading eyebrow="Our stack" title="Technology ecosystem" centered />

        {/* Tabs */}
        <div className="mt-14 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Technology categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active === cat.id}
              aria-controls={`panel-${cat.id}`}
              onClick={() => setActive(cat.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                active === cat.id ? "text-white" : "text-[#929b97] hover:text-white"
              }`}
              style={
                active === cat.id
                  ? { background: `${cat.color}12`, border: `1px solid ${cat.color}30` }
                  : { background: "transparent", border: "1px solid transparent" }
              }
            >
              {cat.label}
              {active === cat.id && (
                <motion.span
                  layoutId="tech-tab-underline"
                  className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
                  style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }}
                  transition={{ type: "spring", stiffness: 440, damping: 34 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Technology badges grid */}
        <div className="mt-10 min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              id={`panel-${activeCategory.id}`}
              role="tabpanel"
              aria-label={`${activeCategory.label} technologies`}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3"
            >
              {activeCategory.technologies.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="glass-panel rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    color: activeCategory.color,
                    borderColor: `${activeCategory.color}20`,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
