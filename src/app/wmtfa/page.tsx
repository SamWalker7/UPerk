import type { Metadata } from "next";
import WMTFAClient from "./WMTFAClient";

export const metadata: Metadata = {
  title: "WMTFA Case Study: Enterprise CRM & AI Reporting",
  description:
    "How Universal Perk unified 7 fragmented systems into one CRM for a multinational nonprofit, automating workflows and adding AI-driven reporting and predictive engagement scoring.",
  alternates: { canonical: "/wmtfa" },
};

export default function Page() {
  return <WMTFAClient />;
}
