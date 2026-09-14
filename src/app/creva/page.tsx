import type { Metadata } from "next";
import CrevaClient from "./CrevaClient";

export const metadata: Metadata = {
  title: "Creva.ai Case Study: AI Recruiting Platform",
  description:
    "How Universal Perk built Creva.ai's production AI platform from scratch — resume screening, AI voice interviews, candidate scoring, and ATS integration, live in 4 weeks.",
  alternates: { canonical: "/creva" },
};

export default function Page() {
  return <CrevaClient />;
}
