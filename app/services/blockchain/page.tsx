import type { Metadata } from "next";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "Blockchain & Web3",
  description:
    "Decentralized solutions for the next internet. Sentiloop builds smart contracts, dApps, and blockchain infrastructure designed for security, transparency, and utility.",
  robots: { index: true, follow: true },
};

export default function BlockchainPage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Navigation />
      <main>
        <ServiceDetail
          name="Blockchain & Web3"
          tagline="Decentralized solutions for the next internet"
          description="Smart contracts, decentralized applications, and blockchain infrastructure designed for security, transparency, and real-world utility."
          color="#ffb86c"
          iconName="Blocks"
          services={[
            "Blockchain Development",
            "Smart Contracts",
            "Web3 Applications",
            "Tokenization",
            "Wallet Integration",
            "Blockchain APIs",
            "Decentralized Applications",
            "NFT Platforms",
            "Private Blockchain",
            "Blockchain Security",
            "Smart Contract Audits",
            "Blockchain Analytics",
          ]}
          approach={[
            {
              title: "Security-First Design",
              description:
                "Immutable code demands rigorous security. We apply formal verification, comprehensive audits, and battle-tested patterns to every smart contract we deploy.",
            },
            {
              title: "Real-World Utility",
              description:
                "We focus on blockchain solutions that solve genuine problems—reducing intermediaries, increasing transparency, and creating verifiable digital ownership.",
            },
            {
              title: "Chain-Agnostic Engineering",
              description:
                "Whether Ethereum, Solana, Polygon, or private chains, we select the optimal infrastructure based on your throughput, cost, and decentralization requirements.",
            },
          ]}
          process={[
            {
              step: "01",
              title: "Evaluate",
              description:
                "Assess whether blockchain is the right solution for your use case, compare chain options, and define the tokenomics or protocol design.",
            },
            {
              step: "02",
              title: "Architect",
              description:
                "Design smart contract architecture, define on-chain vs off-chain data strategies, and plan wallet and identity integration patterns.",
            },
            {
              step: "03",
              title: "Build & Audit",
              description:
                "Develop and rigorously test smart contracts with automated test suites, then conduct independent security audits before any mainnet deployment.",
            },
            {
              step: "04",
              title: "Deploy & Govern",
              description:
                "Mainnet deployment with monitoring, upgrade mechanisms, and governance frameworks that ensure long-term protocol health.",
            },
          ]}
          benefits={[
            {
              title: "Trustless Transactions",
              description:
                "Remove intermediaries and enable peer-to-peer value exchange with cryptographic guarantees and transparent, immutable records.",
            },
            {
              title: "Programmable Assets",
              description:
                "Tokenize real-world assets, create programmable financial instruments, and unlock liquidity in previously illiquid markets.",
            },
            {
              title: "Verifiable Transparency",
              description:
                "Every transaction is auditable on-chain, providing unprecedented visibility into supply chains, ownership, and organizational governance.",
            },
            {
              title: "Censorship Resistance",
              description:
                "Decentralized architecture ensures your application remains available and functional regardless of any single point of failure.",
            },
          ]}
          useCases={[
            "Tokenized Real Estate",
            "Supply Chain Provenance",
            "Decentralized Finance (DeFi)",
            "Digital Identity Verification",
            "NFT Marketplace",
            "Cross-Border Payments",
          ]}
          industries={[
            "Financial Services",
            "Real Estate",
            "Supply Chain",
            "Gaming",
            "Healthcare",
          ]}
          faq={[
            {
              question: "Which blockchain platforms do you support?",
              answer:
                "We develop on Ethereum, Solana, Polygon, Arbitrum, Base, Avalanche, and Hyperledger for enterprise private chains. Platform selection depends on your throughput needs, cost constraints, and decentralization requirements.",
            },
            {
              question: "How do you ensure smart contract security?",
              answer:
                "We follow a multi-layered approach: secure coding patterns, comprehensive unit and integration tests, formal verification where applicable, internal peer reviews, and independent third-party security audits before mainnet deployment.",
            },
            {
              question: "Is blockchain suitable for every use case?",
              answer:
                "No, and we will tell you honestly if a traditional database is more appropriate. Blockchain adds value when you need trustless coordination, immutable records, or decentralized ownership—not for every data storage problem.",
            },
            {
              question: "Can you upgrade smart contracts after deployment?",
              answer:
                "Yes. We implement upgradeable proxy patterns and modular contract architectures that allow logic upgrades while preserving state and user assets, governed by multisig or DAO mechanisms.",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
