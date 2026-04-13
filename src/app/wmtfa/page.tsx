"use client";

import Image from "next/image";
import Link from "next/link";
import Navebar from "@/components/header/Navebar";
import { Footer } from "@/components/footer/Fotter";

const TECH = [
  { name: "React", path: "/icons/tech/react.svg" },
  { name: "Node.js", path: "/icons/tech/node.svg" },
  { name: "JavaScript", path: "/icons/tech/js.svg" },
  { name: "Angular", path: "/icons/tech/angular.svg" },
  { name: "Vue.js", path: "/icons/tech/vue.svg" },
  { name: "Flutter", path: "/icons/tech/flutter.svg" },
  { name: "AWS", path: "/icons/tech/aws.svg" },
];

const PAIN_POINTS = [
  {
    title: "Fragmented Data",
    description:
      "Stakeholder information was spread across multiple platforms, leading to inefficiencies and data silos that slowed down every decision.",
  },
  {
    title: "Inefficient Communication",
    description:
      "Without a centralized tool, communications with donors, volunteers, and partners were time-consuming and prone to costly mistakes.",
  },
  {
    title: "Lack of KPIs",
    description:
      "The team had no system for tracking Performance Indicators. We helped them establish measurable KPIs with short, medium, and long-term objectives.",
  },
  {
    title: "Limited Reporting",
    description:
      "The organization lacked the ability to gain actionable insights into donor and volunteer activities, making data-driven decisions nearly impossible.",
  },
];

const REQUIREMENTS = [
  {
    title: "User-Friendly Interface",
    description:
      "An intuitive platform that non-technical staff could use without training overhead.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Payment Integration",
    description:
      "Secure payment processing for donations and event registrations, fully integrated into the donor management workflow.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: "Chat Functionality",
    description:
      "Real-time messaging between staff, volunteers, and stakeholders to eliminate email delays and improve coordination.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Admin Dashboard",
    description:
      "A centralized control panel giving leadership full visibility into stakeholder data, KPIs, events, and reporting in one place.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

const AI_FEATURES = [
  {
    tag: "Conversational AI",
    title: "AI Chatbot",
    description:
      "We built a conversational AI layer directly into the CRM that lets donors, volunteers, and staff get instant answers, submit requests, and navigate the platform using plain natural language — no training required.",
    bullets: [
      "24/7 availability for stakeholder queries",
      "Handles routine requests without staff intervention",
      "Escalates complex issues to the right team member",
      "Learns from each interaction to improve over time",
    ],
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    gradient: "from-blue-600 to-cyan-400",
  },
  {
    tag: "Natural Language Processing",
    title: "NLP Reporting",
    description:
      "We integrated an NLP engine that transforms raw CRM data into human-readable insights on demand. Staff can ask questions in plain English — \"How many new donors joined last quarter?\" — and get an answer in seconds, not a spreadsheet.",
    bullets: [
      "Query data without SQL or technical knowledge",
      "Auto-generated narrative summaries of key metrics",
      "Scheduled natural-language digests for leadership",
      "Trend detection with plain-language explanations",
    ],
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    gradient: "from-indigo-600 to-blue-400",
  },
  {
    tag: "Predictive AI",
    title: "Engagement Scoring",
    description:
      "An AI model continuously analyzes donor and volunteer behavior to predict engagement likelihood, surface at-risk relationships before they go cold, and identify high-potential stakeholders ready for deeper involvement.",
    bullets: [
      "Predictive churn detection for donors and volunteers",
      "Automated high-priority outreach recommendations",
      "Behavioral pattern analysis across all touchpoints",
      "Score updates in real time as new activity comes in",
    ],
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: "from-violet-600 to-blue-400",
  },
];

const ACCOMPLISHMENTS = [
  {
    title: "Centralized Data Management",
    description:
      "All donor, volunteer, and stakeholder data unified in a single, searchable system — eliminating silos across teams.",
  },
  {
    title: "Automated Workflows",
    description:
      "Routine tasks like follow-ups, reminders, and status updates are handled automatically, freeing staff for higher-value work.",
  },
  {
    title: "Enhanced Event Management",
    description:
      "End-to-end event tooling: registration, attendee management, communication, and post-event reporting in one workflow.",
  },
  {
    title: "Tracked Victories",
    description:
      "Milestone and outcome tracking that lets leadership demonstrate impact to donors and stakeholders with real data.",
  },
  {
    title: "Advanced Reporting & Analytics",
    description:
      "NLP-powered dashboards that surface actionable insights on donor retention, volunteer activity, and campaign performance.",
  },
  {
    title: "AI-Driven Features",
    description:
      "Chatbot AI, NLP reporting, and predictive engagement scoring built directly into the core CRM workflow.",
  },
  {
    title: "Data Security & Compliance",
    description:
      "Enterprise-grade security, role-based access controls, and audit logs to protect sensitive stakeholder information.",
  },
];

export default function WMTFACaseStudy() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <Navebar />

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg, #060a14 0%, #0c1a3a 50%, #060a14 100%)" }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 opacity-20"
          style={{ background: "radial-gradient(circle, #2563EB 0%, #34E5FF 60%, transparent 100%)" }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[12px] font-semibold">
                  Enterprise CRM · AI-Powered
                </span>
                <span className="text-gray-500 text-[12px]">Nonprofit · Stakeholder Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                Enhancing Organizational{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(to right, #2563EB, #2FBAF8, #34E5FF)" }}
                >
                  Efficiency With A CRM Solution
                </span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-10">
                Universal Perk helped WMTFA (We Make The Future) improve
                organizational efficiency by centralizing stakeholder data,
                automating workflows, and embedding AI — chatbot, NLP
                reporting, and predictive engagement scoring — directly into
                the platform.
              </p>

              <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10 rounded-2xl bg-white/[0.04] backdrop-blur-sm max-w-md">
                {[
                  { value: "7", label: "Systems unified" },
                  { value: "80%+", label: "Manual work reduced" },
                  { value: "3", label: "AI features shipped" },
                ].map((stat) => (
                  <div key={stat.label} className="py-4 px-4 text-center">
                    <div
                      className="text-2xl font-extrabold bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(to right, #2563EB, #34E5FF)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/case-studies/Macbook_Laptop.svg"
                  alt="WMTFA CRM Dashboard"
                  width={600}
                  height={400}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Who Was the Client ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
              The Client
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Who Was The Client
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              WMTFA — We Make The Future — was founded to promote multilateral
              democracy and credentials reporting across a distributed network
              of stakeholders. Like many nonprofits operating at this scale,
              they faced significant challenges managing data, communications,
              and stakeholder relationships. Before adopting a CRM solution,
              critical information was scattered across spreadsheets and
              inboxes — making it impossible to operate with the speed and
              clarity their mission required.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Implementation Approach ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
              Our Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Our Implementation Approach
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
              To create a simplified platform for WMTFA&apos;s remote and
              distributed team, we focused on two core capabilities: a simple
              referral process and an efficient system for reporting on
              organizational activities. Here&apos;s how the solution was
              implemented.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Group & Stakeholder Interviews",
                description:
                  "Deep-dive interviews across staff, volunteers, and key stakeholders to map every friction point in the existing workflow.",
              },
              {
                step: "02",
                title: "Data Gathering",
                description:
                  "Comprehensive audit of all existing data sources — spreadsheets, email chains, and third-party tools — to understand the full data landscape.",
              },
              {
                step: "03",
                title: "Defining KPIs & Objectives",
                description:
                  "We established measurable KPIs with short, medium, and long-term objectives as part of a comprehensive monitoring and evaluation strategy.",
              },
              {
                step: "04",
                title: "User Experience Research",
                description:
                  "Usability testing and journey mapping ensured the platform would work for non-technical users across all roles in the organization.",
              },
              {
                step: "05",
                title: "Prototyping & Testing",
                description:
                  "Interactive prototypes validated with real users before any production code was written — reducing rework and ensuring adoption from day one.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold mb-4"
                  style={{ background: "linear-gradient(135deg, #2563EB, #34E5FF)" }}
                >
                  {item.step}
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pain Points ───────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3">
              Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Pain Points Discovered
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto">
              Before we could build the right solution, we had to understand
              exactly what was breaking down.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PAIN_POINTS.map((point, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-all"
              >
                <h3 className="text-[18px] font-bold text-white mb-3">{point.title}</h3>
                <p className="text-blue-100 text-[14.5px] leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Requirements ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
              Scope
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Requirements For Success
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              To meet WMTFA&apos;s vision, several key capabilities had to be
              designed and delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REQUIREMENTS.map((req) => (
              <div
                key={req.title}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #2563EB, #34E5FF)" }}
                >
                  {req.icon}
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2">
                  {req.title}
                </h3>
                <p className="text-[13.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {req.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI-Powered Features ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[12px] font-semibold mb-4">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-Powered CRM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              The AI Layer We Built In
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Beyond core CRM functionality, we embedded three AI capabilities
              that turn the platform from a record-keeping tool into an
              intelligent operations engine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {AI_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 overflow-hidden hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700/40 transition-all duration-300"
              >
                {/* Top accent */}
                <div className={`h-1 w-full bg-gradient-to-r ${feature.gradient}`} />

                <div className="p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${feature.gradient}`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                        {feature.tag}
                      </span>
                      <h3 className="text-[20px] font-extrabold text-gray-900 dark:text-white leading-tight">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                    {feature.description}
                  </p>

                  <ul className="space-y-2.5">
                    {feature.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[13px] text-gray-500 dark:text-gray-400">
                        <svg
                          className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            Built With
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            The Key Technologies We Used
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-12">
            A proven stack chosen for reliability, team familiarity, and
            long-term maintainability.
          </p>

          <div className="flex flex-wrap justify-center gap-5 max-w-xl mx-auto">
            {TECH.map((tech) => (
              <div key={tech.name} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/50 flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/40 transition-all">
                  <Image src={tech.path} alt={tech.name} width={32} height={32} className="object-contain" />
                </div>
                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Accomplishments ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
              Outcomes
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Some Of The Many Accomplishments
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              What WMTFA gained isn&apos;t just a software system — it&apos;s
              organizational clarity, at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACCOMPLISHMENTS.map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-700/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #2563EB, #34E5FF)" }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">{item.title}</h3>
                </div>
                <p className="text-[13.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
            Let&apos;s Talk
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Have a similar challenge?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Whether you&apos;re a nonprofit, enterprise, or startup — if your
            team is fighting data silos and manual overhead, let&apos;s talk
            about what an AI-powered CRM could do for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="px-8 py-4 text-white font-semibold rounded-xl text-[15px] hover:opacity-95 transition-all inline-block"
              style={{ background: "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)" }}
            >
              → Book a Discovery Call
            </Link>
            <Link
              href="/#case-studies"
              className="px-8 py-4 font-semibold rounded-xl text-[15px] border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all inline-block"
            >
              View all case studies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
