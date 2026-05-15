"use client";

import Image from "next/image";
import Link from "next/link";
import Navebar from "@/components/header/Navebar";
import { Footer } from "@/components/footer/Fotter";

// ─── Hero Visual ──────────────────────────────────────────────────────────────
function CrevaHeroVisual() {
  const bars = [3, 6, 9, 12, 8, 14, 10, 6, 11, 8, 13, 7, 10, 5, 8, 12, 9, 6, 10, 7];
  return (
    <div className="relative w-full max-w-lg">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-3xl blur-2xl opacity-25"
        style={{ background: "linear-gradient(135deg, #7c3aed, #2563EB, #34E5FF)" }}
      />
      {/* Card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0d1117]/80 backdrop-blur-sm overflow-hidden shadow-2xl">
        {/* Window chrome */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-[12px] text-gray-400 font-mono">creva.ai · Interview Engine</span>
        </div>

        <div className="p-6 space-y-4">
          {/* Candidate row */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563EB)" }}
            >
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white">Jane Doe</div>
              <div className="text-[12px] text-gray-400">Senior Engineer · Applied 2h ago</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="text-[22px] font-extrabold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #34E5FF)" }}
              >
                94%
              </div>
              <div className="text-[11px] text-gray-400">Match Score</div>
            </div>
          </div>

          {/* Voice waveform */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[12px] text-gray-300 font-medium">
                AI Voice Interview · In Progress
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 h-10">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full opacity-80"
                  style={{
                    height: `${h * 2}px`,
                    background: `linear-gradient(to top, #7c3aed, #34E5FF)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* AI tools row */}
          <div className="flex flex-wrap gap-2">
            {["OpenAI GPT-4o", "ElevenLabs Voice", "Deepgram STT", "LangChain"].map((tool) => (
              <span
                key={tool}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Pipeline stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Screened", count: "247", color: "#2563EB" },
              { label: "Interviewed", count: "31", color: "#7c3aed" },
              { label: "Shortlisted", count: "8", color: "#34E5FF" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div
                  className="text-[20px] font-extrabold bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to bottom, ${item.color}, ${item.color}aa)` }}
                >
                  {item.count}
                </div>
                <div className="text-[11px] text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PAIN_POINTS = [
  {
    title: "Screening Bottleneck",
    description:
      "Recruiters were spending 60–70% of their time manually reviewing resumes that didn't match role requirements — time that should have gone to interviewing and closing top candidates.",
  },
  {
    title: "Scheduling Overhead",
    description:
      "Coordinating first-round interviews across time zones required back-and-forth emails that delayed the pipeline by days, causing candidates to drop out before ever speaking to the team.",
  },
  {
    title: "Inconsistent Evaluation",
    description:
      "Without a standardized screening process, candidate quality varied by reviewer. Different interviewers asked different questions, making cross-candidate comparisons unreliable.",
  },
  {
    title: "Fragmented ATS Data",
    description:
      "Candidate data lived in multiple disconnected systems — job boards, spreadsheets, and an ATS that didn't talk to the rest of the stack. Nothing gave a single view of pipeline health.",
  },
];

const REQUIREMENTS = [
  {
    title: "AI Resume Screening",
    description:
      "An AI engine that evaluates applications based on actual job criteria — not keyword matching — and surfaces the most qualified candidates automatically.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "AI Voice Interviews",
    description:
      "A conversational AI system that conducts structured first-round interviews 24/7, asks consistent questions, and scores candidates on the spot — no scheduler needed.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "Candidate Scoring & Ranking",
    description:
      "A quantified fit score for every candidate, based on resume analysis, interview performance, and role requirements — giving recruiters a ranked shortlist in seconds.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "ATS Integration",
    description:
      "Native connectors to Greenhouse, HubSpot, and custom ATS platforms via webhook API — so candidate data flows automatically without manual entry or duplicate records.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// ─── AI Tech Stack ────────────────────────────────────────────────────────────
const AI_STACK = [
  {
    name: "OpenAI",
    description: "GPT-4o for resume parsing, question generation & semantic scoring",
    color: "#10a37f",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  {
    name: "ElevenLabs",
    description: "Hyper-realistic AI voice synthesis for interview delivery",
    color: "#f97316",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800/40",
    text: "text-orange-700 dark:text-orange-300",
  },
  {
    name: "Deepgram",
    description: "Real-time speech-to-text transcription of candidate responses",
    color: "#06b6d4",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800/40",
    text: "text-cyan-700 dark:text-cyan-300",
  },
  {
    name: "AWS Bedrock Nova",
    description: "Foundation model layer for cost-efficient inference at scale",
    color: "#f59e0b",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  {
    name: "LangChain",
    description: "LLM orchestration, prompt chaining & retrieval-augmented generation",
    color: "#4f46e5",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800/40",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  {
    name: "LangGraph",
    description: "Stateful multi-agent workflows for the full screening pipeline",
    color: "#7c3aed",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800/40",
    text: "text-violet-700 dark:text-violet-300",
  },
  {
    name: "LangSmith",
    description: "LLM observability, tracing & performance monitoring in production",
    color: "#db2777",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800/40",
    text: "text-pink-700 dark:text-pink-300",
  },
];

const INFRA_STACK = [
  { name: "React", path: "/icons/tech/react.svg" },
  { name: "Node.js", path: "/icons/tech/node.svg" },
  { name: "JavaScript", path: "/icons/tech/js.svg" },
  { name: "AWS", path: "/icons/tech/aws.svg" },
];

const ACCOMPLISHMENTS = [
  {
    title: "70% Reduction in Screening Time",
    description:
      "AI resume evaluation cut manual review from hours to minutes, freeing recruiters to focus on high-intent candidates instead of filtering inboxes.",
  },
  {
    title: "2× Faster Time-to-Hire",
    description:
      "Automated voice interviews eliminated scheduling delays entirely. Candidates complete first-round screening within 24 hours of applying, at any time.",
  },
  {
    title: "78% Candidate Satisfaction Rate",
    description:
      "78% of candidates preferred the AI-led early screening over traditional phone screens — citing speed, flexibility, and lack of scheduling friction.",
  },
  {
    title: "Consistent Evaluation Across Every Role",
    description:
      "Every candidate is assessed against the same structured criteria, removing reviewer bias and making shortlists genuinely comparable.",
  },
  {
    title: "Live ATS Integrations",
    description:
      "Greenhouse and HubSpot connected out of the box. Candidate data syncs in real time — no manual exports, no spreadsheet updates.",
  },
  {
    title: "Pipeline Analytics Dashboard",
    description:
      "Time-to-hire, cost-per-hire, and funnel conversion tracked live across every open role — giving leadership data they could actually act on.",
  },
];

export default function CrevaCaseStudy() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <Navebar />

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-violet-50/70 dark:bg-transparent">
        <div
          className="hidden dark:block absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg, #0c0518 0%, #1a0a3a 50%, #060a14 100%)" }}
        />
        <div
          className="hidden dark:block absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="hidden dark:block absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, #34E5FF 70%, transparent 100%)" }}
        />
        <div
          className="hidden dark:block absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] -z-10 opacity-15"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 100%)" }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/15 border border-violet-200 dark:border-violet-500/25 text-violet-700 dark:text-violet-300 text-[12px] font-semibold">
                  AI Platform · SaaS
                </span>
                <span className="text-gray-500 dark:text-gray-500 text-[12px]">Recruitment · HR Technology</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-950 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Building the AI That{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #2563EB, #34E5FF)" }}
                >
                  Rewrites the Hiring Process
                </span>
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
                Universal Perk designed and built Creva AI&apos;s full-stack
                recruitment platform from the ground up — AI resume screening,
                automated voice interviews powered by ElevenLabs and Deepgram,
                LangChain-orchestrated scoring pipelines, and ATS integrations
                that cut time-to-hire in half.
              </p>

              <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-white/10 border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/[0.04] backdrop-blur-sm max-w-md shadow-sm shadow-violet-100/80 dark:shadow-none">
                {[
                  { value: "70%", label: "Screening time saved" },
                  { value: "2×", label: "Faster time-to-hire" },
                  { value: "78%", label: "Candidate satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="py-4 px-4 text-center">
                    <div
                      className="text-2xl font-extrabold bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #34E5FF)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <CrevaHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Who Is the Client ─────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3">
              The Client
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Who Is Creva AI
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Creva AI is a recruitment automation platform built on the belief
              that the hiring process is fundamentally broken — too slow, too
              manual, and too inconsistent to serve either employers or
              candidates well. Their vision: automate every repetitive step in
              the early hiring funnel so recruiters can spend 100% of their
              time on what actually requires human judgment — relationships,
              negotiation, and final decisions. Universal Perk was brought in
              to build that vision from scratch.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Implementation Approach ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3">
              Our Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              How We Built It
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
              We started with deep discovery to understand the recruiter
              workflow end to end before writing a single line of code. The
              result was a focused, phased build that shipped an AI-capable
              MVP in four weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Recruiter Workflow Audit",
                description:
                  "We shadowed recruiters across multiple roles to map every manual step in the screening and interview pipeline — identifying where AI could add the most leverage.",
              },
              {
                step: "02",
                title: "AI Architecture Design",
                description:
                  "Selected the right models for each job: OpenAI for reasoning, ElevenLabs for voice synthesis, Deepgram for transcription, LangGraph for pipeline orchestration.",
              },
              {
                step: "03",
                title: "ATS Integration Mapping",
                description:
                  "Audited target ATS platforms (Greenhouse, HubSpot) and designed a webhook-based integration layer that syncs candidate data without manual exports.",
              },
              {
                step: "04",
                title: "Build, Train & Evaluate",
                description:
                  "Built the full-stack platform and scoring system with LangSmith tracing live from day one — giving us complete observability over every model decision.",
              },
              {
                step: "05",
                title: "Deploy & Optimize",
                description:
                  "Launched to production with live monitoring, A/B testing on interview question sets, and weekly model performance reviews for the first 60 days.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-violet-200 dark:hover:border-violet-700/40 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold mb-4"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #2563EB)" }}
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
        style={{ background: "linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-300 mb-3">
              Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Pain Points We Uncovered
            </h2>
            <p className="text-violet-200 max-w-xl mx-auto">
              Before we could build the right system, we had to understand
              exactly where the recruiting process was breaking down.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PAIN_POINTS.map((point, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-all"
              >
                <h3 className="text-[18px] font-bold text-white mb-3">{point.title}</h3>
                <p className="text-violet-100 text-[14.5px] leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Requirements ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3">
              Platform Scope
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              What We Built
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Four core capabilities that automate every manual step in
              early-stage recruiting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REQUIREMENTS.map((req) => (
              <div
                key={req.title}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-violet-200 dark:hover:border-violet-700/40 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #2563EB)" }}
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

      {/* ─── AI Tech Stack ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3">
              Built With
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              The AI Stack We Used
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Best-in-class models for every layer of the pipeline — voice,
              language, orchestration, and observability.
            </p>
          </div>

          {/* AI tools — detailed cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {AI_STACK.map((tool) => (
              <div
                key={tool.name}
                className={`p-5 rounded-2xl border ${tool.bg} ${tool.border} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: tool.color }}
                  />
                  <span className={`text-[14px] font-bold ${tool.text}`}>{tool.name}</span>
                </div>
                <p className="text-[12.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>

          {/* Infrastructure stack */}
          <div>
            <p className="text-center text-[12px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
              Infrastructure & Frontend
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              {INFRA_STACK.map((tech) => (
                <div key={tech.name} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/50 flex items-center justify-center shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800/40 transition-all">
                    <Image
                      src={tech.path}
                      alt={tech.name}
                      width={28}
                      height={28}
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
        </div>
      </section>

      {/* ─── Accomplishments ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-3">
              Results
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              What Creva AI Shipped
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Measurable outcomes from day one in production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACCOMPLISHMENTS.map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800/50 hover:border-violet-200 dark:hover:border-violet-700/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #34E5FF)" }}
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/60 dark:bg-gray-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-4">
            Let&apos;s Talk
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Ready to build your AI platform?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Whether you&apos;re building from scratch or adding AI to an
            existing product — we&apos;ll get your first system live within
            four weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="px-8 py-4 text-white font-semibold rounded-xl text-[15px] hover:opacity-95 transition-all inline-block"
              style={{ background: "linear-gradient(to right, #7c3aed, #2563EB, #34E5FF)" }}
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
