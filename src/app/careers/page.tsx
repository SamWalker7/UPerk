import type { Metadata } from "next";
import CareersApplication from "@/components/careers/CareersApplication";

export const metadata: Metadata = {
  // Just "Careers" — the root layout's title template appends "| Universal
  // Perk" automatically, so a literal "Careers | Universal Perk" here
  // would render doubled.
  title: "Careers",
  description: "Apply for development, UX, project management, business analysis, data science, ML, and GenAI opportunities with Universal Perk. Tysons, VA or remote.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return <CareersApplication />;
}
