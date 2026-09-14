import type { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Legacy Systems, Vendor Sprawl & AI Delivery",
  description:
    "Universal Perk fixes slow releases, vendor sprawl, and AI stuck in pilot mode — one team for web, mobile, cloud, and AI, with case studies from PayPal, Bayer, TikTok, and Cognizant alumni.",
  alternates: { canonical: "/landing" },
};

export default function Page() {
  return <LandingClient />;
}
