"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CaseStudiesSection from "@/components/marketing/CaseStudiesSection";
import StartupSection from "@/components/marketing/StartupSection";
import Navebar from "@/components/header/Navebar";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer/Fotter";
import Chatbot from "@/components/chatbot/Chatbot";
import GetAQuote from "@/components/get-a-quote/GetAQuote";
import Overlay from "@/components/common/Overlay";
import CalendlyEmbed from "@/components/header/CalendlyEmbed";
import { Subscribe } from "@/components/subscribe/Subscrib";
import { trackEvent } from "@/lib/analytics";
import {
  clearGetStartedHash,
  hasGetStartedHash,
  setGetStartedHash,
} from "@/lib/getStartedTracking";

declare global {
  interface Window {
    _mtm?: Array<Record<string, unknown>>;
  }
}

// ─── Problem Statement ────────────────────────────────────────────────────────
function ProblemStatementSection() {
  const problems = [
    {
      title: "Slow releases",
      description:
        "Every product change turns into a multi-team project because the codebase is brittle, dependencies are outdated, and shipping feels risky.",
      impact: "Teams lose momentum and roadmap priorities keep slipping.",
    },
    {
      title: "Vendor sprawl",
      description:
        "Web, mobile, cloud, and integrations are split across too many specialists, so no one owns the system end to end.",
      impact: "Projects stall in handoffs, rework, and conflicting decisions.",
    },
    {
      title: "AI blocked by infrastructure",
      description:
        "The business wants automation, copilots, or AI workflows, but legacy systems and disconnected data make implementation messy and fragile.",
      impact: "New AI initiatives never move past demos or pilot mode.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
            What Breaks First
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Legacy systems rarely fail all at once.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            They slow delivery, create operational drag, and make modern AI
            initiatives harder to ship. High-performing teams fix the bottlenecks
            before they become revenue problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-gray-100 dark:border-gray-800/50 bg-white dark:bg-gray-900/50 p-8 shadow-sm"
            >
              <p className="text-[13.5px] font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
                {problem.title}
              </p>
              <p className="text-[16.5px] text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                {problem.description}
              </p>
              <p className="text-[14.5px] font-medium text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/60 pt-4">
                {problem.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection({ onBookCall }: { onBookCall: () => void }) {
  const cards = [
    {
      verb: "Modernize",
      tag: "Web · Mobile · Software Engineering",
      description:
        "We rebuild legacy APIs, migrate REST to GraphQL, and refactor aging codebases — without disrupting the systems your business runs on.",
      proof: "Clients have seen up to 300% performance improvement post-migration.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      verb: "Automate",
      tag: "AI Agents · Workflows · Integrations",
      description:
        "We build custom AI agents that handle sales, support, and recruiting integrated directly into your CRM and existing workflows. Available 24/7. No new headcount required.",
      proof: "Most clients see 80%+ query automation within the first month.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      verb: "Scale",
      tag: "Cloud · DevOps · Infrastructure",
      description:
        "We design and manage your cloud infrastructure, CI/CD pipelines, and DevOps processes so your team ships faster and spends less time fighting fires.",
      proof: "AWS, GCP, Azure, Kubernetes, Docker — we handle the full stack.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            One team. Every layer.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            We don&apos;t hand you off to a subcontractor. The same team that
            designs your architecture ships your code and manages your
            infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.verb}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #34E5FF)",
                }}
              >
                {card.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                {card.verb}
              </h3>
              <p className="text-[13.5px] font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
                {card.tag}
              </p>
              <p className="text-[16.5px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {card.description}
              </p>
              <p className="text-[14.5px] font-medium text-blue-600 dark:text-blue-400 border-t border-gray-100 dark:border-gray-800/40 pt-4 mt-4">
                {card.proof}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onBookCall}
            data-analytics-event="calendly_open_click"
            data-analytics-category="lead_generation"
            data-analytics-label="How It Works Discovery Call"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-full text-[16.5px] hover:opacity-90 transition-opacity cursor-pointer"
            style={{
              background: "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
            }}
          >
            → Book a Discovery Call
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Case Studies ─────────────────────────────────────────────────────────────


// ─── AI Services Banner ───────────────────────────────────────────────────────
function AIServicesBanner() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, #060a14 0%, #0c1a3a 40%, #060a14 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% -10%, rgba(37,99,235,0.45) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[14.5px] font-semibold mb-6">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Services
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              AI-First Thinking,
              <br />
              Available as a Standalone Service
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              From custom voice agents to intelligent chatbots — we build AI
              that actually works for your business, not just impresses in a
              demo.
            </p>
            <Link
              href="/ai-services"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-full text-[16.5px] hover:opacity-90 transition-opacity"
              style={{
                background:
                  "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
              }}
            >
              Explore AI Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────
function TechStackSection() {
  const techLogos = [
    { name: "OpenAI", path: "/icons/tech/openai.svg" },
    { name: "ElevenLabs", path: "/icons/tech/elevenlabs.svg" },
    { name: "Deepgram", path: "/icons/tech/deepgram.svg" },
    { name: "OpenClaw", path: "/icons/tech/openclaw.svg" },
    { name: "LangChain", path: "/icons/tech/langchain.svg" },
    { name: "LangGraph", path: "/icons/tech/langgraph.svg" },
    { name: "LangSmith", path: "/icons/tech/langsmith.svg" },
    { name: "n8n", path: "/icons/tech/n8n.svg" },
    { name: "AWS Nova", path: "/icons/tech/aws-nova.svg" },
    { name: "Python", path: "/icons/tech/python.svg" },
    { name: "React", path: "/icons/tech/react.svg" },
    { name: "Node.js", path: "/icons/tech/node.svg" },
    { name: "JavaScript", path: "/icons/tech/js.svg" },
    { name: "AWS", path: "/icons/tech/aws.svg" },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
          Our Stack
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Built with battle-tested tools.
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-14">
          No trend-chasing. We use proven technologies that your team can hire
          for, maintain, and build on.
        </p>
        <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
          {techLogos.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/50 flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/40 transition-all">
                <Image
                  src={tech.path}
                  alt={tech.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-[12.5px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "How is this different from a staffing agency?",
      a: "Staffing agencies place people. We own outcomes. You get a single accountable team — not a roster of contractors who clock out when their statement of work ends. We're on the hook for what we deliver.",
    },
    {
      q: "What if we already have existing vendors or an internal team?",
      a: "We work alongside in-house teams and existing vendors all the time. Most clients bring us in to accelerate what their team can't prioritize, modernize the parts that have calcified, or own a greenfield workstream entirely. We fit into what you already have.",
    },
    {
      q: "How does the US + offshore model actually work?",
      a: "You work with a US-based engagement lead who owns communication, deadlines, and accountability. Behind the scenes, our offshore delivery team executes the build — giving you enterprise-quality work at a blended cost that's 30–50% lower than all-US staffing.",
    },
    {
      q: "What does pricing look like?",
      a: "We don't publish standard rates because the right engagement model depends on your situation — fixed-scope project, retainer, or embedded team. The fastest way to get a number is a 20-minute discovery call where we scope it live.",
    },
    {
      q: "How fast can you actually start?",
      a: "Typically 1-2 weeks from signed agreement to first sprint. We confirm your MVP scope, team availability, and start date during discovery.",
    },
    {
      q: "Do you work with companies that already have AI tools?",
      a: "Yes. Many clients come to us with a patchwork of AI tools that don't talk to each other. We audit what you have, keep what's working, replace what isn't, and build the integrations that make it all coherent.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            Common Questions
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Straight answers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-100 dark:border-gray-800/50 rounded-2xl bg-white dark:bg-gray-900/50 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <span className="text-[18px] font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-7 pb-6">
                  <p className="text-[16.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ──────────────────────────────────────────────────────────────
function ClosingCTA({ onBookCall }: { onBookCall: () => void }) {
  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
          Let&apos;s Talk
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
          Ready to stop working around your technology?
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
          Let&apos;s talk about what modernization looks like for your team —
          no jargon, no generic roadmap. One call, clear next steps.
        </p>
        <button
          onClick={onBookCall}
          data-analytics-event="calendly_open_click"
          data-analytics-category="lead_generation"
          data-analytics-label="Closing CTA Discovery Call"
          className="px-9 py-4 text-white font-semibold rounded-full cursor-pointer text-[16.5px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:opacity-95 transition-all"
          style={{
            background: "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
          }}
        >
          → Book a Discovery Call
        </button>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingClient() {
  const [showForm, setShowForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    const _mtm = (window._mtm = window?._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    const d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src =
      "https://cdn.matomo.cloud/universalperk.matomo.cloud/container_ajVHcFZt.js";
    if (s.parentNode) {
      s.parentNode.insertBefore(g, s);
    } else {
      d.appendChild(g);
    }
  }, []);

  useEffect(() => {
    if (hasGetStartedHash()) {
      trackEvent("quote_form_open", {
        category: "lead_generation",
        source: "getstarted_hash",
      });
      setGetStartedHash();
      setShowForm(true);
    }
  }, []);

  const openCalendly = () => {
    trackEvent("calendly_open", {
      category: "lead_generation",
      source: "home_page",
    });
    setShowCalendly(true);
  };
  const openForm = () => {
    trackEvent("quote_form_open", {
      category: "lead_generation",
      source: "home_page",
    });
    setGetStartedHash();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <Navebar />

      {/* Hero */}
      <Header />

      {/* Problem statement */}
      <ProblemStatementSection />

      {/* How it works — Modernize / Automate / Scale */}
      <HowItWorksSection onBookCall={openCalendly} />

      {/* Case studies */}
      <CaseStudiesSection />

      {/* Startup MVP offer */}
      <StartupSection onGetStarted={openForm} />

      {/* AI services CTA banner */}
      <AIServicesBanner />

      {/* Tech stack */}
      <TechStackSection />

      {/* FAQ — objection handling */}
      <FAQSection />

      {/* Closing CTA */}
      <ClosingCTA onBookCall={openCalendly} />

      <Subscribe />
      <Footer />
      <Chatbot />

      {showForm && (
        <Overlay>
          <GetAQuote
            handleQuoteClose={() => {
              clearGetStartedHash();
              setShowForm(false);
            }}
          />
        </Overlay>
      )}

      {showCalendly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl mx-4 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <span className="font-semibold text-gray-900 dark:text-white">
                Book a Discovery Call
              </span>
              <button
                onClick={() => {
                  trackEvent("calendly_close", {
                    category: "lead_generation",
                    source: "home_page",
                  });
                  setShowCalendly(false);
                }}
                data-analytics-event="calendly_close_click"
                data-analytics-category="lead_generation"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CalendlyEmbed url="https://calendly.com/universal-perk" />
          </div>
        </div>
      )}
    </div>
  );
}
