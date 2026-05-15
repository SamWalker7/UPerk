"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navebar from "@/components/header/Navebar";
import { Footer } from "@/components/footer/Fotter";
import Chatbot from "@/components/chatbot/Chatbot";
import GetAQuote from "@/components/get-a-quote/GetAQuote";
import Overlay from "@/components/common/Overlay";
import CalendlyEmbed from "@/components/header/CalendlyEmbed";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function AIHero({
  onGetStarted,
  onBookCall,
}: {
  onGetStarted: () => void;
  onBookCall: () => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden">
      {/* BG glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full opacity-20 dark:opacity-15 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, #7c3aed 0%, #2563EB 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full opacity-15 dark:opacity-10 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, #2563EB 0%, #34E5FF 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #64748b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-[13px] font-medium mb-8 select-none">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse flex-shrink-0" />
          AI Services by Universal Perk
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.08]">
          Less Busywork.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #7c3aed, #2563EB, #34E5FF)",
            }}
          >
            More Revenue. No Extra Headcount.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
          We design and build automation systems, voice agents, and intelligent workflows 
          that do the repetitive work your team shouldn't be doing -
          deployed and running in weeks, not months.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 text-white font-semibold rounded-xl cursor-pointer text-[15px] shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all"
            style={{
              background:
                "linear-gradient(to right, #7c3aed, #2563EB, #34E5FF)",
            }}
          >
            Get a Free AI Consultation
          </button>
          <button
            onClick={onBookCall}
            className="px-8 py-4 font-semibold rounded-xl cursor-pointer text-[15px] border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
          >
            Book a Discovery Call →
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-800/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl max-w-xl mx-auto bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm shadow-sm">
          {[
            { value: "80%", label: "Query Automation Rate" },
            { value: "40%+", label: "Cost Reduction" },
            { value: "24/7", label: "Always-On Operation" },
          ].map((stat) => (
            <div key={stat.label} className="py-5 px-4">
              <div
                className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #7c3aed, #34E5FF)",
                }}
              >
                {stat.value}
              </div>
              <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Services Grid ─────────────────────────────────────────────────────────
function AIServicesGrid({ onGetStarted }: { onGetStarted: () => void }) {
  const services = [
    {
      iconLight: "/icons/service/light/leade-generation-light.svg",
      iconDark: "/icons/service/leade-generation.svg",
      tag: "Revenue",
      tagColor:
        "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/40",
      title: "Lead Generation & Sales AI",
      subtitle: "AI Chatbots & Voice Assistants",
      description:
        "Turn your website into a 24/7 sales machine. Our AI engages visitors, qualifies leads, syncs with your CRM, and books meetings — all without human intervention.",
      features: [
        "Instant lead qualification via chat or voice",
        "CRM sync (HubSpot, Salesforce, Zoho)",
        "Automated meeting scheduling",
        "Multi-channel: web, WhatsApp, Instagram",
      ],
    },
    {
      iconLight: "/icons/service/light/customer-support-light.svg",
      iconDark: "/icons/service/customer-support.svg",
      tag: "Support",
      tagColor:
        "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40",
      title: "Customer Support AI",
      subtitle: "Intelligent Chat & Voice Agents",
      description:
        "Slash support costs by 40%+ while improving response times. Our AI handles 80% of common queries instantly — 24/7, across every channel, without a large support team.",
      features: [
        "Handles 80% of queries automatically",
        "Smart escalation to human agents",
        "Omnichannel: web, WhatsApp, Messenger",
        "Continuous learning from real conversations",
      ],
    },
    {
      iconLight: "/icons/service/light/Recruiting-assistant-light.svg",
      iconDark: "/icons/service/Recruiting-assistant.svg",
      tag: "HR & Recruiting",
      tagColor:
        "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/40",
      title: "AI Recruiting Assistant",
      subtitle: "Candidate Sourcing & Screening",
      description:
        "Cut time-to-hire by 60%. Our AI screens resumes, conducts initial interviews, scores candidates, and only surfaces the top-ranked applicants for your team to review.",
      features: [
        "Automated resume screening & scoring",
        "AI-led initial screening interviews",
        "Bias-reduced candidate ranking",
        "ATS integration (Greenhouse, Lever)",
      ],
    },
    {
      iconLight: "/icons/service/light/vertual-assistant-light.svg",
      iconDark: "/icons/service/vertual-assistant.svg",
      tag: "Productivity",
      tagColor:
        "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40",
      title: "AI Virtual Assistant",
      subtitle: "Scheduling, Reminders & Automation",
      description:
        "Give your team (or your customers) an AI assistant that handles appointments, answers questions, sends reminders, and eliminates the administrative overhead out of every day.",
      features: [
        "24/7 appointment scheduling",
        "Automated reminders & follow-ups",
        "Calendar & workflow integration",
        "Custom domain knowledge base",
      ],
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            What We Build
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            AI Systems Built for Business
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Every system is custom-built for your use case. No off-the-shelf
            bots. No generic solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0">
                  <Image
                    src={service.iconLight}
                    alt={service.title}
                    width={24}
                    height={24}
                    className="dark:hidden"
                  />
                  <Image
                    src={service.iconDark}
                    alt={service.title}
                    width={24}
                    height={24}
                    className="hidden dark:block"
                  />
                </div>
                <div>
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-2 ${service.tagColor}`}
                  >
                    {service.tag}
                  </span>
                  <h3 className="text-[19px] font-bold text-gray-900 dark:text-white leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-[13px] text-gray-400 dark:text-gray-500">
                    {service.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-[14.5px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2.5 mb-7">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[13.5px] text-gray-600 dark:text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="text-[13.5px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why AI Section ───────────────────────────────────────────────────────────
function WhyAISection() {
  const reasons = [
    {
      title: "Cut Support Costs by 40%+",
      description:
        "Handle 80% of incoming queries without adding a single support hire. Faster responses, lower overhead, happier customers.",
      icon: "💰",
    },
    {
      title: "Stop Losing Leads After Hours",
      description:
        "Your pipeline doesn't pause at 5pm. Leads get engaged, qualified, and booked — the moment they land, any time of day.",
      icon: "🎯",
    },
    {
      title: "Handle 10x the Volume, Not 10x the Staff",
      description:
        "As you grow, your systems grow with you. No scramble to hire, train, and manage more people just to keep up.",
      icon: "📈",
    },
    {
      title: "Your Customers Get Answers Instantly",
      description:
        "No hold times, no ticket queues, no waiting. Natural, on-brand responses that feel like your best team member — available 24/7.",
      icon: "🗣️",
    },
    {
      title: "Running in Weeks, Not Quarters",
      description:
        "Production-ready systems, live within 4 weeks. No endless discovery phases or consultant drag.",
      icon: "⚡",
    },
    {
      title: "You Own It. We Build It.",
      description:
        "No black-box SaaS. No lock-in. You get custom-built systems on open standards — yours to control, yours to scale.",
      icon: "🔓",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            The Business Case
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Why Your Business Needs AI Now
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            AI isn&apos;t a future thing. Your competitors are already using it.
            Here&apos;s what you stand to gain — or lose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="p-7 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{reason.icon}</div>
              <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Process ───────────────────────────────────────────────────────────────
function AIProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Discover & Define",
      description:
        "We identify the exact bottlenecks and revenue opportunities where AI will have the most impact in your business.",
    },
    {
      number: "02",
      title: "Design & Architect",
      description:
        "We design a custom AI system — choosing the right models, channels, integrations, and training approach for your use case.",
    },
    {
      number: "03",
      title: "Build & Train",
      description:
        "We build, fine-tune, and integrate your AI with your existing CRM, support tools, and workflows.",
    },
    {
      number: "04",
      title: "Deploy & Optimize",
      description:
        "We deploy to production, monitor performance, and continuously improve the system based on real usage data.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            How We Build AI
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            From Idea to Production in 4 Weeks
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A focused, transparent process designed to get your AI live and
            generating value fast.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="relative p-6 lg:p-8">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-[52px] left-[calc(50%+24px)] right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, #7c3aed40, transparent)",
                  }}
                />
              )}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[15px] font-bold mb-5 relative z-10"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #2563EB)",
                }}
              >
                {step.number}
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Creva.ai Case Study Spotlight ───────────────────────────────────────────
function CrevaCaseStudySpotlight() {
  const metrics = [
    { value: "70%", label: "Faster Screening" },
    { value: "2×", label: "Time-to-Hire Speed" },
    { value: "78%", label: "Candidate Satisfaction" },
  ];

  const aiStack = [
    { name: "OpenAI GPT-4o", color: "#10a37f" },
    { name: "ElevenLabs Voice", color: "#f97316" },
    { name: "Deepgram STT", color: "#06b6d4" },
    { name: "AWS Bedrock Nova", color: "#f59e0b" },
    { name: "LangChain", color: "#4f46e5" },
    { name: "LangGraph", color: "#7c3aed" },
  ];

  const deliverables = [
    "AI voice interview agent with real-time scoring",
    "Resume parser + JD match engine (GPT-4o)",
    "Automated candidate ranking dashboard",
    "ATS integration for seamless pipeline handoff",
    "Recruiter analytics: bottleneck detection & insights",
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50/80 dark:bg-transparent">
      {/* Background */}
      <div
        className="hidden dark:block absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #0f0a1e 0%, #0d1526 50%, #0a0f1e 100%)",
        }}
      />
      <div
        className="hidden dark:block absolute -top-40 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] -z-10"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, #2563EB 100%)",
        }}
      />
      <div
        className="hidden dark:block absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full opacity-8 blur-[100px] -z-10"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, #7c3aed 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-950/40 px-3 py-1 rounded-full mb-4">
            Real-World AI in Action
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-950 dark:text-white mb-3 tracking-tight leading-tight">
                See What We Built for{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #a78bfa, #34E5FF)",
                  }}
                >
                  Creva.ai
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                An AI-powered recruiting platform that screens, interviews, and
                ranks candidates autonomously — cutting the hiring cycle in half.
              </p>
            </div>
            <Link
              href="/creva"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold text-violet-700 dark:text-white bg-white dark:bg-transparent border border-violet-200 dark:border-violet-500/40 shadow-sm shadow-violet-200/60 dark:shadow-none hover:border-violet-400 hover:bg-violet-50 dark:hover:border-violet-400/70 dark:hover:bg-violet-950/40 transition-all"
            >
              Read full case study
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — metrics + deliverables */}
          <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-5 text-center shadow-sm shadow-gray-200/70 dark:shadow-none"
                >
                  <div
                    className="text-3xl font-extrabold bg-clip-text text-transparent mb-1"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #a78bfa, #34E5FF)",
                    }}
                  >
                    {m.value}
                  </div>
                  <div className="text-[12px] text-gray-600 dark:text-gray-400 font-medium leading-snug">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Deliverables */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-6 shadow-sm shadow-gray-200/70 dark:shadow-none">
              <h3 className="text-[13px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                What We Delivered
              </h3>
              <ul className="space-y-3">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[14px] text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-4 h-4 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — AI stack + fake terminal */}
          <div className="space-y-6">
            {/* AI Stack */}
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-6 shadow-sm shadow-gray-200/70 dark:shadow-none">
              <h3 className="text-[13px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
                AI Stack Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {aiStack.map((tool) => (
                  <span
                    key={tool.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold border"
                    style={{
                      color: tool.color,
                      borderColor: `${tool.color}40`,
                      backgroundColor: `${tool.color}12`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tool.color }}
                    />
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Fake activity terminal */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0612] p-6 font-mono text-[13px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="text-gray-500 text-[11px] ml-2">creva-ai-pipeline · live</span>
              </div>
              <div className="space-y-2 text-[12.5px]">
                <div><span className="text-violet-400">→</span> <span className="text-gray-300">resume_parser</span> <span className="text-green-400">matched</span> <span className="text-gray-400">94% · JD: Senior ML Engineer</span></div>
                <div><span className="text-violet-400">→</span> <span className="text-gray-300">voice_interview</span> <span className="text-cyan-400">completed</span> <span className="text-gray-400">12m 34s · score: 87/100</span></div>
                <div><span className="text-violet-400">→</span> <span className="text-gray-300">engagement_model</span> <span className="text-yellow-400">ranked</span> <span className="text-gray-400">#3 of 247 candidates</span></div>
                <div><span className="text-violet-400">→</span> <span className="text-gray-300">ats_handoff</span> <span className="text-green-400">pushed</span> <span className="text-gray-400">Greenhouse · stage: Technical</span></div>
                <div className="mt-3 border-t border-white/[0.06] pt-3">
                  <span className="text-gray-500">Pipeline processed </span>
                  <span className="text-white font-semibold">247 candidates</span>
                  <span className="text-gray-500"> in </span>
                  <span className="text-violet-400 font-semibold">4.2 hrs</span>
                  <span className="text-green-400 animate-pulse ml-2">●</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI CTA ───────────────────────────────────────────────────────────────────
function AICta({
  onGetStarted,
  onBookCall,
}: {
  onGetStarted: () => void;
  onBookCall: () => void;
}) {
  return (
    <section
      id="ai-contact"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-4">
          Start Building
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
          Your AI Is One
          <br />
          Conversation Away.
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
          Tell us your biggest operational challenge. We&apos;ll show you exactly
          where and how AI can solve it — in plain English, no jargon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="px-9 py-4 text-white font-semibold rounded-xl cursor-pointer text-[15px] shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all"
            style={{
              background:
                "linear-gradient(to right, #7c3aed, #2563EB, #34E5FF)",
            }}
          >
            Get a Free AI Consultation
          </button>
          <button
            onClick={onBookCall}
            className="px-9 py-4 font-semibold rounded-xl cursor-pointer text-[15px] border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
          >
            Book a Discovery Call →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AIServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <Navebar />
      <AIHero
        onGetStarted={() => setShowForm(true)}
        onBookCall={() => setShowCalendly(true)}
      />
      <AIServicesGrid onGetStarted={() => setShowForm(true)} />
      <WhyAISection />
      <AIProcessSection />
      <CrevaCaseStudySpotlight />
      <AICta
        onGetStarted={() => setShowForm(true)}
        onBookCall={() => setShowCalendly(true)}
      />
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
