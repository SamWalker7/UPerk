import type { Metadata } from "next";
import AIServicesClient from "./AIServicesClient";

export const metadata: Metadata = {
  title: "AI Automation, Voice Agents & Intelligent Workflows",
  description:
    "Cut support costs, stop losing after-hours leads, and screen candidates faster with custom AI chatbots, voice assistants, and automation — built and deployed by Universal Perk in weeks.",
  alternates: { canonical: "/ai-services" },
};

export default function Page() {
  return <AIServicesClient />;
}
