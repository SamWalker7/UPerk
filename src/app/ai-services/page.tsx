import type { Metadata } from "next";
import AIServicesClient from "./AIServicesClient";

export const metadata: Metadata = {
  title: "AI Engineering, Evals, Fine-Tuning & Forward-Deployed Engineers",
  description:
    "Universal Perk gets AI out of the pilot and into production: opportunity audits, evaluation and benchmarking, fine-tuning and RFT, voice and document AI, agent engineering, and forward-deployed engineers — built in your cloud, HIPAA-compliant delivery with a BAA available.",
  alternates: { canonical: "/ai-services" },
};

export default function Page() {
  return <AIServicesClient />;
}
