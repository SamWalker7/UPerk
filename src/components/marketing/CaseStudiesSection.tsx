"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

// Shared by the homepage and landing page so project details stay consistent.
export default function CaseStudiesSection() {
  const studies = [
    {
      category: "Enterprise CRM",
      accent: "from-blue-600 to-cyan-400",
      accentSolid: "#2563EB",
      client: "WMTFA",
      industry: "Nonprofit · Stakeholder Management",
      headline:
        "Built a custom CRM that unified operations for a multinational nonprofit, centralizing data, automating workflows, and eliminating the manual overhead holding their team back.",
      metric: "7",
      metricLabel: "core systems unified",
      deliverables: [
        "Centralized donor & stakeholder data",
        "Automated workflows with KPI tracking",
        "AI-driven reporting & event management",
        "Payment integration & admin dashboard",
      ],
      tech: ["React", "Node.js", "material design", "AWS", "rds", "lambda", "serverless"],
      href: "/wmtfa",
      cta: "Read case study",
      comingSoon: false,
    },
    {
      category: "Startup MVP",
      accent: "from-emerald-500 to-cyan-400",
      accentSolid: "#059669",
      client: "DASGUZO",
      industry: "Mobility · P2P Marketplace",
      headline:
        "Took a peer-to-peer car rental platform from concept to live product, full web and mobile app, booking engine, payments, and identity verification, in 90 days.",
      metric: "90-Day",
      metricLabel: "concept to live product",
      deliverables: [
        "Full web app + iOS & Android mobile apps",
        "Booking, payments & identity verification",
        "End-to-end delivery, on time and on budget",
        "Scalable backend architecture from day one",
      ],
      tech: ["React", "Flutter", "Node.js", "AWS", "shadcn", "tailwindcss", "d3", "stripe"],
      href: "/dasguzo",
      cta: "Read case study",
      comingSoon: false,
    },
    {
      category: "AI Platform",
      accent: "from-violet-600 to-cyan-400",
      accentSolid: "#7c3aed",
      client: "Creva.ai",
      industry: "AI · SaaS",
      headline:
        "Designed and built a production AI platform from scratch, custom model integration, API-first architecture, and a full-stack SaaS product ready to scale from launch day.",
      metric: "4-Week",
      metricLabel: "first AI in production",
      deliverables: [
        "Custom AI model integration & pipelines",
        "Full-stack SaaS product build",
        "API-first architecture built to scale",
        "Continuous optimization post-launch",
      ],
      tech: ["Python", "React", "Node.js", "AWS", "tts", "stt", "twilio", "langchain", "langsmith", "OpenAI", "anthropic", "pgvector"],
      href: "/creva",
      cta: "Read case study",
      comingSoon: false,
    },
  ];

  return (
    <section
      id="case-studies"
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            Case Studies
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-normal">
            Real work. Real results.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Three clients. Three different problems. One team that owned the outcome.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {studies.map((study) => (
            <div
              key={study.client}
              // A faint gray-100 border and no resting shadow made these
              // blend into the page at rest, with all definition arriving
              // only on hover. Matches the resting `border-gray-200
              // dark:border-gray-700/50 shadow-sm` treatment used by every
              // other card on the page (services, industries, why-us) so
              // these read as defined immediately, not just on interaction.
              className="rounded-lg bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col"
            >
              {/* Colored top accent bar */}
              <div
                className={`h-1 w-full bg-gradient-to-r ${study.accent}`}
              />

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Category tag + client */}
                <div className="mb-5">
                  <span
                    className="inline-block text-[12.5px] font-semibold px-2.5 py-0.5 rounded-full border mb-3"
                    style={{
                      color: study.accentSolid,
                      borderColor: `${study.accentSolid}33`,
                      background: `${study.accentSolid}0d`,
                    }}
                  >
                    {study.category}
                  </span>
                  <h3 className="text-[24px] font-extrabold text-gray-900 dark:text-white leading-tight">
                    {study.client}
                  </h3>
                  <p className="text-[13.5px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">
                    {study.industry}
                  </p>
                </div>

                {/* Key metric */}
                <div className="mb-5 pb-5 border-b border-gray-100 dark:border-gray-800/40">
                  <div
                    className="text-[42px] font-extrabold bg-clip-text text-transparent leading-none mb-1"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${study.accentSolid}, #34E5FF)`,
                    }}
                  >
                    {study.metric}
                  </div>
                  <p className="text-[14.5px] font-medium text-gray-500 dark:text-gray-400">
                    {study.metricLabel}
                  </p>
                </div>

                {/* Headline */}
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                  {study.headline}
                </p>

                {/* Deliverables */}
                <ul className="space-y-2 mb-6 flex-1">
                  {study.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2.5 text-[14.5px] text-gray-500 dark:text-gray-400"
                    >
                      <Check aria-hidden className="w-4 h-4 shrink-0 mt-0.5" style={{ color: study.accentSolid }} />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {study.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[12.5px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {study.comingSoon ? (
                  <span className="text-[14.5px] font-medium text-gray-400 dark:text-gray-500 italic">
                    Case study coming soon
                  </span>
                ) : (
                  <Link
                    href={study.href}
                    className="text-[15px] font-semibold transition-colors"
                    style={{ color: study.accentSolid }}
                  >
                    {study.cta} <ArrowRight aria-hidden className="inline-block ml-1 w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
