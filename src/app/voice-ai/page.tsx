import type { Metadata } from "next";
import VoiceAIClient from "./VoiceAIClient";

export const metadata: Metadata = {
  title: "HIPAA-Compliant AI Voice Infrastructure",
  description:
    "Managed AI voice agents that can actually touch patient and client data — built with a Business Associate Agreement available, for practices and firms answering services can't cover safely.",
  alternates: { canonical: "/voice-ai" },
};

export default function Page() {
  return <VoiceAIClient />;
}
