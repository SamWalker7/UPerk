import React from "react";
import type { Metadata } from "next";
import CaseStudies from "@/components/case-studies/";

export const metadata: Metadata = {
  title: "DASGUZO Case Study: Peer-to-Peer Car Rentals",
  description:
    "How Universal Perk took a peer-to-peer car rental platform from concept to a live web and mobile product — booking, payments, and identity verification — in 90 days.",
  alternates: { canonical: "/dasguzo" },
};

const page = () => {
  return (
    <div>
      <CaseStudies />
    </div>
  );
};

export default page;
