"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navebar from "@/components/header/Navebar";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer/Fotter";
import Chatbot from "@/components/chatbot/Chatbot";
import GetAQuote from "@/components/get-a-quote/GetAQuote";
import Overlay from "@/components/common/Overlay";
import CalendlyEmbed from "@/components/header/CalendlyEmbed";
import { Subscribe } from "@/components/subscribe/Subscrib";

declare global {
  interface Window {
    _mtm?: Array<Record<string, unknown>>;
  }
}

// ─── Trusted By ───────────────────────────────────────────────────────────────
function TrustedBySection() {
  const logos = [
    { src: "/icons/payPal.svg", alt: "PayPal", w: 90 },
    { src: "/icons/bayer.svg", alt: "Bayer", w: 70 },
    { src: "/icons/tik-tok.svg", alt: "TikTok", w: 80 },
    { src: "/icons/cognizant.svg", alt: "Cognizant", w: 110 },
    { src: "/icons/turing.svg", alt: "Turing", w: 80 },
  ];

  return (
    <section className="py-14 border-y border-gray-100 dark:border-gray-800/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="relative opacity-50 dark:opacity-30 hover:opacity-80 dark:hover:opacity-60 transition-opacity"
              style={{ width: logo.w, height: 36 }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem Statement ────────────────────────────────────────────────────────
function ProblemStatementSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
          The Problem
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
          Legacy systems don&apos;t fix themselves.
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Most enterprise teams are stuck maintaining software that was built
          for a different era. It&apos;s slow to change, expensive to run, and
          impossible to connect to modern AI tools. The answer isn&apos;t a new
          vendor for every problem — it&apos;s one team that understands the
          whole stack.
        </p>
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
        "We build custom AI agents that handle sales, support, and recruiting — integrated directly into your CRM and existing workflows. Available 24/7. No new headcount required.",
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
              <p className="text-[12px] font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
                {card.tag}
              </p>
              <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                {card.description}
              </p>
              <p className="text-[13px] font-medium text-blue-600 dark:text-blue-400 border-t border-gray-100 dark:border-gray-800/40 pt-4 mt-4">
                {card.proof}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onBookCall}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl text-[15px] hover:opacity-90 transition-opacity cursor-pointer"
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

// ─── Client Proof ─────────────────────────────────────────────────────────────
function ClientProofSection() {
  const proofs = [
    {
      client: "PayPal & Bayer",
      logos: ["/icons/payPal.svg", "/icons/bayer.svg"],
      what: "Migrated REST APIs to GraphQL across legacy enterprise systems.",
      result: "300% improvement in system performance.",
      resultColor: "text-green-600 dark:text-green-400",
    },
    {
      client: "DASGUZO",
      logos: [],
      what: "Built a peer-to-peer car rental platform from zero to launch — full mobile and web product.",
      result: "End-to-end product delivered on schedule.",
      resultColor: "text-green-600 dark:text-green-400",
    },
    {
      client: "Enterprise CRM Client",
      logos: [],
      what: "Redesigned organizational workflows with a custom CRM solution.",
      result: "Measurable reduction in operational overhead.",
      resultColor: "text-blue-600 dark:text-blue-400",
      badge: "Full case study coming soon",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            Client Proof
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Results our clients actually measure.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            No demos. No mockups. Shipped code, real outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proofs.map((proof) => (
            <div
              key={proof.client}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
            >
              {/* Logos or client name */}
              {proof.logos.length > 0 ? (
                <div className="flex items-center gap-4 mb-5">
                  {proof.logos.map((logo) => (
                    <div
                      key={logo}
                      className="relative h-8"
                      style={{ width: logo.includes("payPal") ? 72 : 56 }}
                    >
                      <Image
                        src={logo}
                        alt={proof.client}
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-5">
                  <span className="inline-block text-[13px] font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                    {proof.client}
                  </span>
                </div>
              )}

              <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                {proof.what}
              </p>

              <div className="border-t border-gray-100 dark:border-gray-800/40 pt-4 mt-auto">
                <p className={`text-[15px] font-bold ${proof.resultColor} mb-1`}>
                  ↑ {proof.result}
                </p>
                {proof.badge && (
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {proof.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/case-studies"
            className="text-[14px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all case studies →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 90-Day MVP ───────────────────────────────────────────────────────────────
function MVPSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            For Startups & Product Teams
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            From idea to live product in 90 days.
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Built for teams that need to validate fast. We take you from
            discovery through launch with a fixed timeline, defined milestones,
            and a team that owns the outcome — not just the deliverable.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl cursor-pointer text-[15px] shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all"
            style={{
              background:
                "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
            }}
          >
            → Start Your 90-Day Build
          </button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-16">
          {[
            { n: "01", title: "Discovery", desc: "Goals, constraints, and a shared roadmap." },
            { n: "02", title: "Architecture", desc: "System design and tech selection." },
            { n: "03", title: "Build & QA", desc: "Agile sprints with continuous delivery." },
            { n: "04", title: "Launch", desc: "Deploy, monitor, and scale." },
          ].map((step, i) => (
            <div key={step.n} className="relative p-6 lg:p-8">
              {i < 3 && (
                <div
                  className="hidden lg:block absolute top-[52px] left-[calc(50%+24px)] right-0 h-px"
                  style={{
                    background: "linear-gradient(to right, #2563EB40, transparent)",
                  }}
                />
              )}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[15px] font-bold mb-4 relative z-10"
                style={{ background: "linear-gradient(135deg, #2563EB, #34E5FF)" }}
              >
                {step.n}
              </div>
              <h4 className="text-[16px] font-bold text-gray-900 dark:text-white mb-1">
                {step.title}
              </h4>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[13px] font-semibold mb-6">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
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
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl text-[15px] hover:opacity-90 transition-opacity"
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
    { name: "Node.js", path: "/icons/tech/node.svg" },
    { name: "Angular", path: "/icons/tech/angular.svg" },
    { name: "Vue.js", path: "/icons/tech/vue.svg" },
    { name: "Flutter", path: "/icons/tech/flutter.svg" },
    { name: "Java", path: "/icons/tech/java.svg" },
    { name: "React", path: "/icons/tech/react.svg" },
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
        <div className="flex flex-wrap justify-center gap-5 max-w-2xl mx-auto">
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
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
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
      a: "Typically 1–2 weeks from signed agreement to first sprint. For the 90-Day MVP, we've started in as little as 5 days after kickoff.",
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
                <span className="text-[16px] font-semibold text-gray-900 dark:text-white pr-4">
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
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
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
          className="px-9 py-4 text-white font-semibold rounded-xl cursor-pointer text-[15px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:opacity-95 transition-all"
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
export default function Home() {
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

  const openCalendly = () => setShowCalendly(true);
  const openForm = () => setShowForm(true);

  return (
    <div className="min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <Navebar />

      {/* Hero */}
      <Header />

      {/* Social proof bar */}
      <TrustedBySection />

      {/* Problem statement */}
      <ProblemStatementSection />

      {/* How it works — Modernize / Automate / Scale */}
      <HowItWorksSection onBookCall={openCalendly} />

      {/* Client proof with real outcomes */}
      <ClientProofSection />

      {/* 90-Day MVP */}
      <MVPSection onGetStarted={openForm} />

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
          <GetAQuote handleQuoteClose={() => setShowForm(false)} />
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
                onClick={() => setShowCalendly(false)}
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
