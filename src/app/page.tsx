"use client";
import React, { useEffect } from "react";
import Header from "@/components/header/Header";
import TrustedBy from "@/components/trusted-by/TrustedBy";
import Support from "@/components/support";
import AICapabilitiesForBUsiness from "@/components/ai-capabilities-for-business";
import TransformedBusiness from "@/components/transformed-business";
import AIInsightsTrends from "@/components/ai-insights-trends";
import Subscrib from "@/components/subscribe/Subscrib";
import TechStackSection from "@/components/technologies/TechStackSection";
import DevelopmentPipeline from "@/components/development-pipline";
import { Footer } from "@/components/footer/Fotter";
import ProjectPlanningSteps from "@/components/MVP-for-startup";
import Chatbot from "@/components/chatbot/Chatbot";
import CaseStudy from "@/components/case-studies-section";

declare global {
  interface Window {
    _mtm?: Array<Record<string, unknown>>;
  }
}
export default function Home() {
  useEffect(() => {
    const _mtm = window._mtm = window?._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; 
    g.src='https://cdn.matomo.cloud/universalperk.matomo.cloud/container_ajVHcFZt.js'; 
    if (s.parentNode) {
      s.parentNode.insertBefore(g, s);
    } else {
      d.appendChild(g);
    }
   }, [])
  return (
    <div className="mb-[30px]">
      <Header />
      <div className="flex justify-center">
        <TrustedBy />
        <div className="mt-35 mr-7">
          <Chatbot  />
        </div>
      </div>
      <Support />
      <ProjectPlanningSteps />
      <AICapabilitiesForBUsiness />
      <DevelopmentPipeline />
      <TransformedBusiness />
      < CaseStudy />
      <AIInsightsTrends />
      <TechStackSection />
      <Subscrib />
      <Footer />   
    </div>
  );
}
