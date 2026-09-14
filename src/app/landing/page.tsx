"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  Code2,
  Smartphone,
  Cloud,
  Lightbulb,
  Sparkles,
  BarChart3,
  Rocket,
  FolderKanban,
  Bot,
  Cpu,
  Shield,
  Globe,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Stethoscope,
  Scale,
  FlaskConical,
  Landmark,
  Building2,
  Store,
  ShieldCheck,
  Lock,
  FileCheck,
  KeyRound,
  ScrollText,
  ServerCog,
  Users,
  BadgeCheck,
  Receipt,
  Layers,
  UserPlus,
  LifeBuoy,
  Quote,
  RefreshCw,
  FileText,
  Compass,
} from "lucide-react";
import Navebar from "@/components/header/Navebar";
import { Footer } from "@/components/footer/Fotter";
import GetAQuote from "@/components/get-a-quote/GetAQuote";
import Overlay from "@/components/common/Overlay";
import { trackEvent } from "@/lib/analytics";
import {
  clearGetStartedHash,
  hasGetStartedHash,
  setGetStartedHash,
} from "@/lib/getStartedTracking";

// The first entry is rendered larger (bento-style) in the services grid —
// see the `bento` flag used below.
const SERVICES = [
  {
    icon: Code2,
    title: "Web & Software Development",
    desc: "We design and build websites and web tools that are fast, reliable, and easy for your customers to use.",
    bento: true,
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "We build iPhone and Android apps that feel simple and work well, from the first idea to the app store.",
  },
  {
    icon: Cloud,
    title: "Cloud Migration & Infrastructure",
    desc: "We move your systems to the cloud and set them up to run smoothly, safely, and without surprise costs.",
  },
  {
    icon: Lightbulb,
    title: "Tech Consulting",
    desc: "Not sure what to build or how? We help you plan it out first, so you don't waste time or money later.",
  },
  {
    icon: Sparkles,
    title: "AI Solutions & Embedded Engineers",
    desc: "We build AI tools that do real work for your business, and we can place our engineers inside your team to get it done fast.",
  },
  {
    icon: BarChart3,
    title: "Data Science & Machine Learning",
    desc: "We turn the data you already have into clear answers, predictions, and tools that help you make better decisions.",
  },
];

// Honest, non-fabricated numbers — no invented percentages or client counts.
const STATS = [
  { value: "6", label: "Core services" },
  { value: "1", label: "Team, start to finish" },
  { value: "4", label: "Disciplines under one roof" },
  { value: "0", label: "Vendors you have to coordinate" },
];

// `impact` follows the same shape as the homepage's problem cards: name the
// problem, explain it, then state what it actually costs the business.
// `proof` is only set where it maps to a stat already published elsewhere
// on the site (the homepage's "How It Works" section) — not invented per
// card. Cards without a matching real number leave it unset rather than
// making one up.
const USE_CASES = [
  {
    icon: Bot,
    title: "Your team has an AI idea, but no one to build it",
    desc: "We work alongside your team, turn the idea into a working test version, and take it all the way to full use.",
    impact: "Pilots stall at the demo stage and never reach real users.",
    tag: "AI · Embedded engineers",
    proof: "Most clients see 80%+ query automation within the first month.",
  },
  {
    icon: RefreshCw,
    title: "Your old system is slowing everyone down",
    desc: "We rebuild or move your system to the cloud, so it runs faster and stops holding your team back.",
    impact: "Every small change turns into a multi-week project.",
    tag: "Modernization · Cloud",
    proof: "Clients have seen up to 300% performance improvement post-migration.",
  },
  {
    icon: FileText,
    title: "Your team spends hours on manual paperwork",
    desc: "We build tools that read and sort documents automatically, so your team can focus on real work.",
    impact: "Trained staff spend their day on data entry instead of clients.",
    tag: "Document AI · Automation",
  },
  {
    icon: BarChart3,
    title: "You have data, but no clear way to use it",
    desc: "We build tools that turn your data into simple, useful answers you can act on right away.",
    impact: "Decisions get made on gut feel while the answers sit unused.",
    tag: "Data · Machine learning",
  },
  {
    icon: Rocket,
    title: "You need a new app or website, and need it fast",
    desc: "We plan, design, and build it as one team, so nothing gets lost between different vendors.",
    impact: "Work stalls in handoffs between separate vendors.",
    tag: "Web · Mobile",
  },
  {
    icon: Compass,
    title: "You're not sure what to build first",
    desc: "We start with a short planning session to find the highest-value project before writing a line of code.",
    impact: "Budget goes to the loudest request instead of the best return.",
    tag: "Consulting · Roadmap",
  },
];

// Industries are presented as equal-weight cards on purpose — the page sells
// to regulated, premium buyers generally, not to one vertical.
const INDUSTRIES = [
  {
    icon: Stethoscope,
    name: "Healthcare & medical practices",
    desc: "Patient portals, scheduling and intake, and systems that handle protected health data correctly.",
  },
  {
    icon: Scale,
    name: "Legal",
    desc: "Client intake, document-heavy workflows, and tools built around confidentiality.",
  },
  {
    icon: FlaskConical,
    name: "Labs & diagnostics",
    desc: "Results delivery, instrument and LIMS integrations, and reliable reporting pipelines.",
  },
  {
    icon: Landmark,
    name: "Financial services",
    desc: "Secure customer portals, audit trails, and reporting you can hand to a regulator.",
  },
  {
    icon: Building2,
    name: "Professional services",
    desc: "Client portals, internal operations tools, and automation for repetitive back-office work.",
  },
  {
    icon: Store,
    name: "Marketplaces & consumer apps",
    desc: "Two-sided platforms, payments, and products that need to stay fast as they grow.",
  },
];

// Only claims we can actually back. Deliberately no SOC 2 line — not
// certified, and "HIPAA certified" isn't a thing for vendors.
const SECURITY = [
  {
    icon: ShieldCheck,
    title: "HIPAA-compliant delivery",
    desc: "We build to HIPAA requirements and will sign a Business Associate Agreement before any work touches patient data.",
  },
  {
    icon: Lock,
    title: "Encrypted in transit and at rest",
    desc: "Sensitive data is encrypted end to end, with secrets kept out of code and rotated properly.",
  },
  {
    icon: KeyRound,
    title: "Role-based access control",
    desc: "People only see what their role allows, and access is reviewed rather than handed out by default.",
  },
  {
    icon: ScrollText,
    title: "Audit logging",
    desc: "Who did what, and when — recorded in a way you can actually produce if you're ever asked.",
  },
  {
    icon: FileCheck,
    title: "Secure development practices",
    desc: "Code review, dependency scanning, and staged environments so nothing goes straight to production untested.",
  },
  {
    icon: ServerCog,
    title: "Your cloud, your data",
    desc: "Systems run in your cloud account wherever you want them to. You own the code and the data, not us.",
  },
];

const WHY_US = [
  {
    icon: Users,
    title: "One accountable team",
    desc: "The people who design your system are the people who build and support it. No subcontractor handoffs.",
  },
  {
    icon: BadgeCheck,
    title: "Senior engineers on your project",
    desc: "You get experienced engineers doing the work, not a junior team learning on your budget.",
  },
  {
    icon: Receipt,
    title: "Fixed scope, no surprise invoices",
    desc: "We agree what's being built and what it costs before we start, and we stick to it.",
  },
  {
    icon: LifeBuoy,
    title: "A named contact after launch",
    desc: "One person you can actually reach, with an agreed response time — not a ticket queue.",
  },
];

const ENGAGEMENTS = [
  {
    icon: Layers,
    name: "Fixed-scope project",
    desc: "A defined outcome for a defined price. Best when you know what you need built.",
    fit: "Best for: a specific system, app, or migration",
  },
  {
    icon: UserPlus,
    name: "Embedded engineers",
    desc: "Our engineers work inside your team and ship alongside your people. Best when you have the direction but not the capacity.",
    fit: "Best for: teams with a roadmap and no bandwidth",
  },
  {
    icon: LifeBuoy,
    name: "Ongoing support",
    desc: "We keep what we built running, fix issues, and keep improving it after launch.",
    fit: "Best for: live systems that need to stay healthy",
  },
];

// PLACEHOLDER CONTENT — replace `quote`, `name`, and `role` with approved
// client wording before this page goes live. Nothing here is a real quote.
const TESTIMONIALS = [
  {
    quote: "[Placeholder — replace with a real, approved client quote about the outcome you delivered.]",
    name: "[Client name]",
    role: "[Title, Company]",
  },
  {
    quote: "[Placeholder — a second approved quote works well here, ideally one that mentions speed or reliability.]",
    name: "[Client name]",
    role: "[Title, Company]",
  },
  {
    quote: "[Placeholder — a third quote mentioning security, compliance, or trust would round this section out.]",
    name: "[Client name]",
    role: "[Title, Company]",
  },
];

const FAQS = [
  {
    q: "How is this different from hiring our own team?",
    a: "You get a full team of experienced engineers and designers right away, without the time and cost of hiring, training, and managing people yourself.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the size, but most projects show real, working progress within the first few weeks, not months.",
  },
  {
    q: "Do we have to replace our current systems?",
    a: "No. We work with what you already have wherever possible, and only recommend a change when it truly helps.",
  },
  {
    q: "What if we're not sure exactly what we need?",
    a: "That's normal, and it's where we start. We help you figure out the right project before any building begins.",
  },
  {
    q: "Can we start with something small?",
    a: "Yes. Many clients start with a small, focused project to see how we work before growing it into something bigger.",
  },
  {
    q: "Do you handle sensitive or private data safely?",
    a: "Yes. We follow strict data-handling and security practices, and can sign the agreements your business needs, such as a Business Associate Agreement for healthcare data.",
  },
];

const TRUST_LOGOS = [
  { src: "/icons/payPal.svg", alt: "PayPal", w: 80 },
  { src: "/icons/bayer.svg", alt: "Bayer", w: 64 },
  { src: "/icons/tik-tok.svg", alt: "TikTok", w: 72 },
  { src: "/icons/cognizant.svg", alt: "Cognizant", w: 100 },
  { src: "/icons/turing.svg", alt: "Turing", w: 72 },
];

const STEPS = [
  { n: "01", title: "Talk", desc: "We learn about your business and what you're trying to get done." },
  { n: "02", title: "Plan", desc: "We map out the right solution and what it will take to build it." },
  { n: "03", title: "Build", desc: "Our team designs and builds it, with regular updates along the way." },
  { n: "04", title: "Launch & Support", desc: "We launch it, then stay on to fix issues and help it grow." },
];

// Icons that float up through the hero background. `left` is a horizontal
// position as a CSS percentage; duration/delay are staggered per-icon so
// they drift independently instead of moving in lockstep. `edge: true`
// icons stay visible on mobile (positioned clear of the centered hero
// text); the rest only render from `sm` up, where there's room for them
// to drift behind the copy without cluttering a narrow screen.
const HERO_ICONS = [
  { Icon: Rocket, left: "4%", duration: 9, delay: 0, edge: true },
  { Icon: Smartphone, left: "24%", duration: 11, delay: 2.5, edge: false },
  { Icon: Shield, left: "42%", duration: 13, delay: 4.8, edge: false },
  { Icon: FolderKanban, left: "58%", duration: 10, delay: 1.2, edge: false },
  { Icon: Cpu, left: "76%", duration: 14, delay: 2, edge: false },
  { Icon: Globe, left: "90%", duration: 12, delay: 0.6, edge: false },
  { Icon: Bot, left: "96%", duration: 11.5, delay: 3.5, edge: true },
];

// Grouped by discipline so a non-technical reader can see we cover the whole
// stack rather than scanning one undifferentiated logo soup.
// `logos` are tools we have real brand assets for in public/icons/tech;
// `also` lists the rest as plain text chips (same tools already named on the
// homepage) rather than shipping logos we don't have licensed marks for.
// Logo assets beyond the original set (typescript, nextdotjs, tailwindcss,
// postgresql, graphql, googlecloud, kubernetes, docker, githubactions,
// apple, android, figma, sketch, framer) were pulled from Simple Icons
// (simpleicons.org, CC0 — free for commercial use) on 2026-09-13. No Azure
// mark is included: Simple Icons doesn't carry one, and Microsoft's brand
// guidelines don't permit an unlicensed substitute, so Azure stays a
// text-only chip.
const TECH_GROUPS = [
  {
    label: "Frontend",
    logos: [
      { name: "React", src: "/icons/tech/react.svg" },
      { name: "TypeScript", src: "/icons/tech/typescript.svg" },
      { name: "Next.js", src: "/icons/tech/nextdotjs.svg" },
      { name: "Tailwind CSS", src: "/icons/tech/tailwindcss.svg" },
      { name: "Vue.js", src: "/icons/tech/vue.svg" },
      { name: "Angular", src: "/icons/tech/angular.svg" },
      { name: "JavaScript", src: "/icons/tech/js.svg" },
    ],
    also: [],
  },
  {
    label: "Backend",
    logos: [
      { name: "Node.js", src: "/icons/tech/node.svg" },
      { name: "Python", src: "/icons/tech/python.svg" },
      { name: "Java", src: "/icons/tech/java.svg" },
      { name: "PostgreSQL", src: "/icons/tech/postgresql.svg" },
      { name: "GraphQL", src: "/icons/tech/graphql.svg" },
    ],
    also: ["REST"],
  },
  {
    label: "Cloud & DevOps",
    logos: [
      { name: "AWS", src: "/icons/tech/aws.svg" },
      { name: "Google Cloud", src: "/icons/tech/googlecloud.svg" },
      { name: "Kubernetes", src: "/icons/tech/kubernetes.svg" },
      { name: "Docker", src: "/icons/tech/docker.svg" },
      { name: "GitHub Actions", src: "/icons/tech/githubactions.svg" },
    ],
    also: ["Azure"],
  },
  {
    label: "Mobile",
    logos: [
      { name: "Flutter", src: "/icons/tech/flutter.svg" },
      { name: "iOS", src: "/icons/tech/apple.svg" },
      { name: "Android", src: "/icons/tech/android.svg" },
    ],
    also: ["React Native"],
  },
  {
    label: "AI & Data",
    logos: [
      { name: "OpenAI", src: "/icons/tech/openai.svg" },
      { name: "LangChain", src: "/icons/tech/langchain.svg" },
      { name: "LangGraph", src: "/icons/tech/langgraph.svg" },
      { name: "LangSmith", src: "/icons/tech/langsmith.svg" },
      { name: "ElevenLabs", src: "/icons/tech/elevenlabs.svg" },
      { name: "Deepgram", src: "/icons/tech/deepgram.svg" },
      { name: "n8n", src: "/icons/tech/n8n.svg" },
    ],
    also: ["RAG", "Vector search"],
  },
  {
    label: "Design & UX",
    logos: [
      { name: "Figma", src: "/icons/tech/figma.svg" },
      { name: "Sketch", src: "/icons/tech/sketch.svg" },
      { name: "Framer", src: "/icons/tech/framer.svg" },
    ],
    also: ["Design systems", "Accessibility"],
  },
];

// Real, shipped work — same case studies linked elsewhere on the site
// (/dasguzo, /wmtfa, /creva). Headlines and category tags are copied
// verbatim from each project's own page so this section never overstates
// what's already published there.
// `mockup` selects a purpose-built screen illustration per project (see
// CaseStudyMockup below). Each one is drawn to reflect what that product
// actually is, so no two cards share a visual — and nothing here pretends
// to be a real screenshot of a client's live product.
const CASE_STUDIES = [
  {
    href: "/dasguzo",
    category: "Marketplace · Mobility",
    title: "Revolutionizing Peer-to-Peer Car Rentals",
    gradient: "from-blue-600 to-sky-400",
    mockup: "phone" as const,
  },
  {
    href: "/wmtfa",
    category: "Enterprise CRM · AI-Powered",
    title: "Enhancing Organizational Efficiency With A CRM Solution",
    gradient: "from-sky-600 via-cyan-500 to-teal-300",
    mockup: "dashboard" as const,
  },
  {
    href: "/creva",
    category: "AI Platform · Recruitment",
    title: "Building the AI That Rewrites the Hiring Process",
    gradient: "from-blue-800 via-blue-600 to-cyan-400",
    mockup: "ai" as const,
  },
];

/**
 * A faint, fixed-size dot grid used behind several sections for a
 * consistent "blueprint / dashboard" texture. Purely decorative —
 * `pointer-events-none` and `aria-hidden` keep it out of the way of
 * interaction and screen readers.
 */
function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06] ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/**
 * Purpose-built screen mockups for the case-study cards. Each variant is
 * drawn to reflect what that product actually does — a phone with a map
 * and a trip card for the car-rental marketplace, a dashboard with charts
 * and rows for the CRM, a split AI console with a voice waveform for the
 * AI hiring platform. Abstract on purpose: these are illustrations of the
 * product type, not imitations of a client's real UI.
 */
function CaseStudyMockup({ variant }: { variant: "phone" | "dashboard" | "ai" }) {
  const bar = "rounded-full bg-white/70";
  const faint = "rounded-full bg-white/35";

  if (variant === "phone") {
    return (
      <div className="relative w-28 h-44 rounded-[1.25rem] border-2 border-white/60 bg-white/10 backdrop-blur-sm shadow-[0_16px_36px_rgba(0,0,0,0.3)] p-2 flex flex-col gap-2">
        <div className="mx-auto w-8 h-1 rounded-full bg-white/50" />
        {/* Map area with a route line */}
        <div className="relative flex-1 rounded-lg bg-white/15 overflow-hidden">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <path d="M12 82 C 34 62, 26 40, 52 30 S 80 22, 88 12" fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 6" />
            <circle cx="12" cy="82" r="5" fill="white" fillOpacity="0.95" />
            <circle cx="88" cy="12" r="5" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
        {/* Trip card */}
        <div className="rounded-lg bg-white/25 p-2 space-y-1.5">
          <div className={`${bar} h-1.5 w-3/4`} />
          <div className={`${faint} h-1.5 w-1/2`} />
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="relative w-52 h-32 rounded-lg border-2 border-white/60 bg-white/10 backdrop-blur-sm shadow-[0_16px_36px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
        <div className="flex gap-2 p-2 h-[calc(100%-1.75rem)]">
          {/* Sidebar */}
          <div className="w-10 space-y-1.5 shrink-0">
            <div className={`${bar} h-1.5 w-full`} />
            <div className={`${faint} h-1.5 w-4/5`} />
            <div className={`${faint} h-1.5 w-full`} />
            <div className={`${faint} h-1.5 w-3/5`} />
          </div>
          {/* Bar chart + rows */}
          <div className="flex-1 space-y-2">
            <div className="flex items-end gap-1 h-10">
              {[40, 65, 45, 80, 55, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-white/70" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className={`${faint} h-1.5 w-full`} />
            <div className={`${faint} h-1.5 w-4/5`} />
          </div>
        </div>
      </div>
    );
  }

  // AI console: candidate rows being scored, plus a live voice waveform
  return (
    <div className="relative w-52 h-32 rounded-lg border-2 border-white/60 bg-white/10 backdrop-blur-sm shadow-[0_16px_36px_rgba(0,0,0,0.3)] overflow-hidden flex">
      <div className="flex-1 p-2.5 space-y-2 border-r border-white/30">
        {[90, 72, 55].map((score, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-white/60 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className={`${bar} h-1 w-full`} />
              <div className="h-1 rounded-full bg-white/25 overflow-hidden">
                <div className="h-full rounded-full bg-white/90" style={{ width: `${score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Voice waveform */}
      <div className="w-16 flex items-center justify-center gap-[3px] px-2">
        {[30, 65, 100, 48, 80, 38, 70].map((h, i) => (
          <div key={i} className="w-[3px] rounded-full bg-white/80" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

// Icons orbiting the hero's centerpiece graphic, at compass positions
// around the ring. Kept small (4) so the composition stays legible instead
// of turning into another icon soup.
const ORBIT_ICONS = [
  { Icon: Code2, position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2", delay: 0 },
  { Icon: Cloud, position: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2", delay: 1 },
  { Icon: Sparkles, position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2", delay: 2 },
  { Icon: BarChart3, position: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2", delay: 3 },
];

/**
 * The hero's centerpiece graphic: a slowly rotating orbit built from the
 * existing brand glow/ring assets, a pulsing "core", four orbiting service
 * icons, and a small decorative terminal card. Everything here is
 * generative (CSS/SVG + existing design assets) rather than a stock photo
 * or a fabricated product screenshot — there's no real dashboard to show
 * yet, so a literal screenshot would be misleading.
 */
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[440px] aspect-square" aria-hidden>
      {/* Twinkling starfield surrounding the whole composition — the
          "space" motif made literal, not just an abstract glow. */}
      <div className="bg-starfield animate-twinkle absolute -inset-10 text-blue-500/70 dark:text-white/70 opacity-70 pointer-events-none" />

      {/* Ambient glow behind the whole composition */}
      <div className="animate-drift absolute inset-0 rounded-full opacity-40 dark:opacity-30 blur-[80px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_55%,_transparent_100%)]" />

      {/* Outer dashed ring, rotating opposite the inner ring for a layered
          "orbit" feel */}
      <div className="animate-spin-slow-reverse absolute inset-2 rounded-full border border-dashed border-blue-300/50 dark:border-blue-500/25" />

      {/* The existing orbit-ring brand asset (public/images/hero.svg),
          rotating slowly at the center */}
      <Image
        src="/images/hero.svg"
        alt=""
        width={256}
        height={255}
        className="animate-spin-slow absolute inset-[12%] w-[76%] h-[76%] drop-shadow-[0_0_30px_rgba(37,99,235,0.35)]"
      />

      {/* A small ringed planet at dead center — the hero's "space"
          centerpiece, built from CSS rather than a stock photo (there's no
          real product screenshot to show yet, and a literal photo of a
          planet/astronaut would read as generic stock art bolted onto a
          software site). Saturn-style tilted ring behind a glowing sphere. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16">
          <div className="absolute top-1/2 left-1/2 w-[150%] h-[38%] -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] rounded-full border-2 border-cyan-300/80 dark:border-cyan-300/50" />
          <div className="animate-core-pulse absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_32%,_#bfdbfe_0%,_#3b82f6_45%,_#1e3a8a_100%)] shadow-[0_0_36px_rgba(37,99,235,0.55)]" />
        </div>
      </div>

      {/* Four service icons orbiting the ring at compass points */}
      {ORBIT_ICONS.map(({ Icon, position, delay }, i) => (
        <div
          key={i}
          className={`animate-bob absolute ${position} w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-blue-200/60 dark:border-blue-400/20 bg-white/90 dark:bg-white/[0.06] backdrop-blur-sm shadow-[0_8px_24px_rgba(37,99,235,0.2)] flex items-center justify-center`}
          style={{ animationDelay: `${delay}s` }}
        >
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      ))}

      {/* Small decorative "shipped it" terminal card — illustrative flavor
          text about how we work, not a specific factual claim. Hidden on
          the smallest screens to keep the mobile hero compact. */}
      <div className="hidden sm:block absolute -bottom-4 -right-4 w-40 rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white/95 dark:bg-[#0a1120]/95 backdrop-blur-sm shadow-[0_12px_32px_rgba(15,23,42,0.18)] p-3 font-mono text-[10px] leading-relaxed text-left">
        <p className="text-gray-400 dark:text-gray-500">$ deploy --prod</p>
        <p className="text-emerald-500">✓ build passed</p>
        <p className="text-emerald-500">✓ tests passed</p>
        <p className="text-blue-500">✓ shipped</p>
      </div>
    </div>
  );
}

/**
 * Fades a section up into place the first time it scrolls into view.
 * Uses IntersectionObserver directly instead of a library — this is the
 * only place in the app that needs scroll-triggered animation, so a
 * dependency isn't justified. The observer disconnects after the first
 * reveal; sections don't re-hide when scrolled past.
 */
function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false);
  // Which FAQ item is expanded. Only one at a time; starts with the first
  // question open so the accordion doesn't read as empty on first paint.
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Deep-link support: if the page loads with the shared "#getstarted"
  // hash (e.g. a CTA from another page), pop the quote form open
  // automatically. Mirrors the same pattern used on the homepage and
  // AI-services page — see src/lib/getStartedTracking.ts.
  useEffect(() => {
    if (hasGetStartedHash()) {
      trackEvent("quote_form_open", {
        category: "lead_generation",
        source: "landing_hash",
      });
      setGetStartedHash();
      setShowForm(true);
    }
  }, []);

  function openForm(source: string) {
    trackEvent("quote_form_open", { category: "lead_generation", source });
    setGetStartedHash();
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <Navebar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      {/*
        `isolate` is load-bearing here, not decorative: it forces this
        section to establish its own CSS stacking context. Without it,
        `position: relative` alone does NOT create one, which means the
        `-z-10` background layer below escapes past this section entirely
        and gets painted behind the page's own background color instead of
        just behind the hero text — i.e. the floating icons render with
        the right position and opacity but are completely invisible.
        `isolate` is what keeps the negative z-index scoped to this section.
      */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 pt-28 pb-20 sm:pt-32 sm:pb-28">
        {/* Ambient background: grid texture, drifting glows, a brand glow
            image, and floating icons */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <GridBackdrop />
          {/* Pre-made brand glow asset (public/images/glow.svg) layered
              under the CSS gradients for a richer, less flat background —
              reusing an existing design asset instead of adding a new one. */}
          <Image
            src="/images/glow.svg"
            alt=""
            width={1023}
            height={1092}
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] max-w-none opacity-[0.15] dark:opacity-[0.25]"
          />
          <div className="animate-drift absolute -top-32 right-0 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-15 blur-[130px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_50%,_transparent_100%)]" />
          <div
            className="animate-drift absolute bottom-0 -left-24 w-[480px] h-[480px] rounded-full opacity-15 dark:opacity-10 blur-[110px] bg-[radial-gradient(circle,_#0ea5e9_0%,_#34e5ff_60%,_transparent_100%)]"
            style={{ animationDelay: "3s" }}
          />

          {HERO_ICONS.map(({ Icon, left, duration, delay, edge }, i) => (
            <div
              key={i}
              className={`animate-float-up absolute bottom-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-blue-200/60 dark:border-blue-400/20 bg-white/80 dark:bg-white/[0.05] backdrop-blur-sm shadow-[0_8px_24px_rgba(37,99,235,0.15)] flex items-center justify-center ${
                edge ? "" : "hidden sm:flex"
              }`}
              style={{ left, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
          ))}
        </div>

        {/* Mobile-first: single stacked column (text, then the hero
            graphic below it) until `lg`, where it becomes a real 2-column
            layout — text left, graphic right. */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[13px] font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Software, Cloud & AI — built by one team
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
              One team to build your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                website, app, and AI tools.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-9">
              Universal Perk helps growing businesses build software that
              works, move to the cloud, and put AI to real use, without
              juggling five different vendors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => openForm("landing_hero")}
                className="group w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold px-6 py-3 transition shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_36px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                data-analytics-event="quote_form_open_click"
              >
                Get a free project estimate
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#services"
                className="w-full sm:w-auto text-center rounded-lg border border-gray-200 dark:border-gray-800 text-[15px] font-semibold px-6 py-3 hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                See what we do
              </a>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── Trusted by — infinite scroll strip ───────────────────────── */}
      <section className="relative border-y border-gray-100 dark:border-gray-800/60 py-10 overflow-hidden">
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-6">
          Trusted by teams at
        </p>
        {/* The logo list is duplicated so the marquee loop is seamless:
            translating the strip by exactly -50% lines the second copy up
            with where the first one started. */}
        <div className="relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee">
            {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="relative mx-6 sm:mx-10 opacity-40 dark:opacity-25 hover:opacity-80 dark:hover:opacity-60 transition-opacity"
                style={{ width: logo.w, height: 28 }}
              >
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────────────── */}
      {/* A short, honest numbers strip — different rhythm from the card
          grids around it (big mono figures, single row) so the page
          doesn't read as one repeating layout. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-14 border-b border-gray-100 dark:border-gray-800/60">
        <GridBackdrop />
        <Reveal className="relative max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-mono text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Services — bento grid ─────────────────────────────────────── */}
      <section id="services" className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        {/* Same brand glow asset as the hero, mirrored and dialed up
            enough to actually read as a background image rather than a
            barely-visible tint. */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <GridBackdrop className="opacity-[0.06] dark:opacity-[0.1]" />
          <Image
            src="/images/glow.svg"
            alt=""
            width={1023}
            height={1092}
            className="absolute -top-24 -right-40 w-[640px] max-w-none scale-x-[-1] opacity-[0.22] dark:opacity-[0.32]"
          />
          <div className="animate-drift absolute -top-10 right-0 w-[380px] h-[380px] rounded-full opacity-[0.12] dark:opacity-[0.18] blur-[100px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              What we do
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Six services, one team. We build the whole thing, so nothing
              falls through the cracks between vendors.
            </p>
          </Reveal>
          {/* `auto-rows-fr` + the first card's `sm:col-span-2` produces a
              bento layout: one wide featured tile, five regular ones,
              instead of a uniform grid. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.title}
                style={{ animationDelay: `${i * 80}ms` }}
                className={s.bento ? "sm:col-span-2" : ""}
              >
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm p-6 transition hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.15)] ${
                    s.bento ? "sm:flex sm:items-center sm:gap-8" : ""
                  }`}
                >
                  {/* Corner bracket accent — a small nod to a technical
                      "viewfinder" motif, reinforced only on hover so it
                      doesn't compete with the resting card border. */}
                  <span className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-blue-300 dark:border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className={`w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                      s.bento ? "sm:mb-0 sm:w-16 sm:h-16" : ""
                    }`}
                  >
                    <s.icon
                      className={`text-blue-600 dark:text-blue-400 ${s.bento ? "w-7 h-7 sm:w-8 sm:h-8" : "w-5 h-5"}`}
                    />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${s.bento ? "text-[18px]" : "text-[16px]"}`}>
                      {s.title}
                    </h3>
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries we serve ─────────────────────────────────────── */}
      {/* Equal-weight cards on purpose: signals relevance to regulated,
          premium buyers (practices, labs, firms) without narrowing the
          whole page down to a single vertical. */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Same per-theme split as the sections below: blueprint in light
              mode (mix-blend-multiply was quietly making the nebula photo
              disappear against white — multiply against a bright image
              only darkens, it doesn't add visible texture), the real
              nebula photo in dark mode via mix-blend-screen. */}
          <div className="bg-blueprint absolute -bottom-40 -left-32 w-[560px] h-[560px] max-w-none rounded-full opacity-100 dark:opacity-0" />
          <Image
            src="/images/space/nebula.jpg"
            alt=""
            width={1000}
            height={1000}
            className="absolute -bottom-40 -left-32 w-[560px] max-w-none rounded-full opacity-0 dark:opacity-[0.22] blur-[2px] dark:mix-blend-screen"
          />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Who we build for
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              We work with businesses that handle sensitive information and
              can&rsquo;t afford to get software wrong.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.name} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="group h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm p-6 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] transition">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <ind.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-[16px] font-semibold mb-2">{ind.name}</h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack — grouped by discipline ──────────────────────── */}
      {/* Grouping beats a single scrolling strip here: a prospect checking
          whether we can cover their whole project can see frontend,
          backend, cloud, mobile, AI and design capability at a glance
          instead of scanning one long row of unlabelled logos. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.015] border-y border-gray-100 dark:border-gray-800/60">
        <div className="bg-circuit absolute inset-0 text-gray-400 dark:text-gray-700 opacity-[0.08] dark:opacity-[0.12]" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Built with tools that actually ship
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              The full stack, in one team — so no part of your project has
              to be handed to someone else.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TECH_GROUPS.map((group, i) => (
              <Reveal key={group.label} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="group h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.03] shadow-sm p-5 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_10px_28px_rgba(37,99,235,0.12)] transition">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    {group.logos.map((tech) => (
                      <div
                        key={tech.name}
                        title={tech.name}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/[0.05] border border-gray-200 dark:border-gray-700/50 transition-transform duration-300 group-hover:scale-105"
                      >
                        <Image src={tech.src} alt={tech.name} width={20} height={20} className="object-contain w-5 h-5" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.also.map((name) => (
                      <span
                        key={name}
                        className="rounded-md bg-gray-100 dark:bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-gray-600 dark:text-gray-400"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case studies — spotlight cards ───────────────────────────── */}
      {/* A third distinct layout: tall gradient-header cards linking out
          to real, already-published case studies, instead of another
          grid of icon+text tiles. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-circuit absolute inset-0 text-gray-400 dark:text-gray-700 opacity-[0.05] dark:opacity-[0.08]" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Real projects, real results
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              A few of the builds we&rsquo;ve shipped end to end.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs, i) => (
              <Reveal key={cs.href} style={{ animationDelay: `${i * 100}ms` }}>
                <a
                  href={cs.href}
                  className="group block h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,99,235,0.15)] transition"
                >
                  <div className={`h-52 bg-gradient-to-br ${cs.gradient} relative flex items-center justify-center overflow-hidden`}>
                    <div className="bg-circuit absolute inset-0 text-white opacity-20" />
                    {/* Soft glow behind the mockup so it doesn't sit flat
                        against the gradient */}
                    <div className="absolute w-44 h-44 rounded-full bg-white/25 blur-2xl" />
                    <div className="relative transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                      <CaseStudyMockup variant={cs.mockup} />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
                      {cs.category}
                    </p>
                    <h3 className="text-[16px] font-semibold mb-4 leading-snug">
                      {cs.title}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 dark:text-blue-400">
                      View case study
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases — vertical timeline ────────────────────────────── */}
      {/* Deliberately a different shape from the services grid above: a
          single-column, numbered list with a connecting line, so scrolling
          through the page doesn't feel like the same card grid repeated. */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-[#060a14]">
        {/* Different image per theme, not the same photo dimmed down:
            light mode gets an engineering-blueprint texture (built in CSS —
            see bg-blueprint in globals.css; stock "light futuristic" photo
            searches kept surfacing literal lab photos with people in them),
            dark mode gets the real NASA deep-field photo plus a starfield. */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="bg-blueprint animate-blueprint-pan absolute inset-0 opacity-100 dark:opacity-0" />
          <Image
            src="/images/space/deep-field.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-0 dark:opacity-[0.55]"
          />
          <div className="bg-starfield animate-twinkle absolute inset-0 text-transparent dark:text-white/60 opacity-0 dark:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/35 to-gray-50 dark:from-[#060a14] dark:via-[#060a14]/50 dark:to-[#060a14]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Where we come in
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              A few of the everyday problems that lead teams to call us.
            </p>
          </Reveal>
          <div className="relative">
            {/* Connecting line — small square pads at each card mimic a PCB
                trace rather than a plain gradient rule, echoing the
                blueprint/circuit motif used in the backgrounds. */}
            <div className="hidden sm:block absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/60 via-gray-300 dark:via-white/10 to-transparent" />
            <div className="space-y-5">
              {USE_CASES.map((u, i) => (
                <Reveal key={u.title} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="group relative flex gap-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] backdrop-blur-sm shadow-sm p-5 sm:p-6 hover:border-blue-300 dark:hover:border-blue-400/50 hover:shadow-[0_0_32px_rgba(37,99,235,0.15)] dark:hover:shadow-[0_0_32px_rgba(37,99,235,0.25)] transition">
                    {/* Glowing left accent bar — brightens on hover, the
                        "console log" cue that ties this section to the
                        terminal motif used in the hero. */}
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-cyan-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                    {/* Small PCB pad marking this card's connection point
                        on the trace line running down the left side. */}
                    <span className="hidden sm:block absolute left-6 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-blue-500 rotate-45" />
                    {/* Scan-sweep — a light band that sweeps down the card
                        on hover, defined via .scan-sweep in globals.css. */}
                    <span className="scan-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-blue-400/25 dark:from-blue-300/20 to-transparent" />
                    <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white dark:bg-[#060a14] border-2 border-blue-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <u.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="pt-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
                          №{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-md bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          {u.tag}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold mb-2 flex items-center gap-2">
                        {u.title}
                        <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </h3>
                      <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        {u.desc}
                      </p>
                      {/* The cost of leaving it alone — same "impact" framing
                          the homepage's problem cards use. */}
                      <p className="flex items-start gap-2 text-[13px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/10 pt-3">
                        <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            If nothing changes:{" "}
                          </span>
                          {u.impact}
                        </span>
                      </p>
                      {/* Real proof, only where we have it — see the
                          USE_CASES comment above. */}
                      {u.proof && (
                        <p className="mt-2 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
                          ✓ {u.proof}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Security & compliance ───────────────────────────────────── */}
      {/* For regulated buyers (practices, labs, firms) this is usually the
          section that decides whether they keep reading. Every claim here
          is one the business can actually back — deliberately no SOC 2
          line, and it says "HIPAA-compliant delivery", never "HIPAA
          certified", which isn't a real vendor certification. */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        {/* Same per-theme split as "Where we come in": blueprint texture in
            light mode, the real deep-field photo in dark mode — not one
            photo dimmed down for both. */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="bg-blueprint animate-blueprint-pan absolute inset-0 opacity-100 dark:opacity-0" />
          <Image
            src="/images/space/deep-field.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-0 dark:opacity-[0.40]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/55 to-white dark:from-[#060a14] dark:via-[#060a14]/60 dark:to-[#060a14]" />
          <div className="animate-drift absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-[0.12] dark:opacity-[0.18] blur-[110px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[13px] font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Security &amp; compliance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Built for businesses that can&rsquo;t afford a data problem
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              If you handle patient records, client files, or financial
              data, the cheap tools usually aren&rsquo;t an option. Here&rsquo;s how
              we handle yours.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECURITY.map((item, i) => (
              <Reveal key={item.title} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="group h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white/90 dark:bg-white/[0.03] backdrop-blur-sm shadow-sm p-6 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] transition">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-[16px] font-semibold mb-2">{item.title}</h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <p className="text-[14px] text-gray-500 dark:text-gray-400">
              Need this in writing for your compliance review?{" "}
              <button
                onClick={() => openForm("landing_security")}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ask us for the compliance packet
              </button>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── How we work — orbit diagram on desktop, list on mobile ──── */}
      {/* A different shape again: instead of a left-to-right stepper, the
          four stages sit at compass points around a rotating ring, echoing
          the hero's orbit graphic. That only works with room to breathe,
          so mobile/tablet get a simple numbered list (mobile-first: the
          list is the base layout, the orbit is progressive enhancement at
          `lg`) rather than a cramped mini-orbit. */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <GridBackdrop className="opacity-[0.06] dark:opacity-[0.1]" />
          <div className="animate-drift absolute bottom-0 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.14] dark:opacity-[0.2] blur-[110px] bg-[radial-gradient(circle,_#0ea5e9_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
              How we work together
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed text-center mb-12">
              Four stages, one continuous loop from first call to
              ongoing support.
            </p>
          </Reveal>

          {/* Mobile / tablet: numbered list */}
          <div className="lg:hidden space-y-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm p-5">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center font-mono text-[13px] font-bold text-white">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold mb-1">{step.title}</h3>
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Desktop: orbit diagram */}
          <Reveal className="hidden lg:block relative mx-auto" style={{ width: 560, height: 560 }}>
            <div className="animate-spin-slow-reverse absolute inset-16 rounded-full border border-dashed border-blue-300/50 dark:border-blue-500/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0a1120] border border-blue-200 dark:border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.25)] flex flex-col items-center justify-center">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Your
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Project
                </span>
              </div>
            </div>
            {STEPS.map((step, i) => {
              const compass = [
                "top-0 left-1/2 -translate-x-1/2",
                "top-1/2 right-0 translate-x-4 -translate-y-1/2",
                "bottom-0 left-1/2 -translate-x-1/2",
                "top-1/2 left-0 -translate-x-4 -translate-y-1/2",
              ];
              return (
                <div key={step.n} className={`absolute ${compass[i]} w-44 text-center`}>
                  <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center font-mono text-[12px] font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
                    {step.n}
                  </div>
                  <h3 className="text-[14px] font-semibold mb-1">{step.title}</h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ── Engagement models ───────────────────────────────────────── */}
      {/* Premium buyers want to know what "working together" actually
          means before they'll take a call. Three clear entry points with
          an explicit "best for" line removes that ambiguity. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="bg-circuit absolute inset-0 text-gray-400 dark:text-gray-700 opacity-[0.06] dark:opacity-[0.1]" />
        <div className="relative max-w-5xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Ways to work with us
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Start where it makes sense. You can always change shape later.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ENGAGEMENTS.map((e, i) => (
              <Reveal key={e.name} style={{ animationDelay: `${i * 90}ms` }}>
                <div className="group relative h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.03] shadow-sm p-6 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] transition flex flex-col">
                  {/* Gradient top rule — a light "spec sheet" cue */}
                  <span className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <e.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-[17px] font-semibold mb-2">{e.name}</h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1">
                    {e.desc}
                  </p>
                  <p className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 font-mono text-[12px] text-blue-600 dark:text-blue-400">
                    {e.fit}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why teams choose us ─────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <GridBackdrop className="opacity-[0.06] dark:opacity-[0.1]" />
          <div className="animate-drift absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.12] dark:opacity-[0.18] blur-[110px] bg-[radial-gradient(circle,_#0ea5e9_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Why teams choose us
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              The things clients tell us mattered most after working with
              other agencies.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="group h-full flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm p-6 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] transition">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <w.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold mb-2">{w.title}</h3>
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {w.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      {/* ⚠️ PLACEHOLDER CONTENT — the quotes in TESTIMONIALS are not real.
          Replace them with approved client wording (and ideally real names
          and titles) before this page goes live. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="bg-circuit absolute inset-0 text-gray-400 dark:text-gray-700 opacity-[0.06] dark:opacity-[0.1]" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              What clients say
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              In their words, not ours.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} style={{ animationDelay: `${i * 90}ms` }}>
                <figure className="h-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600/60 bg-white dark:bg-white/[0.03] shadow-sm p-6 flex flex-col">
                  <Quote className="w-7 h-7 text-blue-500/40 dark:text-blue-400/40 mb-4" />
                  <blockquote className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed flex-1 italic">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10">
                    <p className="text-[14px] font-semibold">{t.name}</p>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ — terminal console on desktop, accordion on mobile ──── */}
      {/* Most agency sites run a plain stacked accordion here. Swapping
          the desktop view for a two-pane "terminal" — a question list on
          the left, the selected answer rendered as command output on the
          right — is a much stronger visual break from that pattern, and
          it's a natural fit for the developer-tool aesthetic the rest of
          the page is going for. Mobile keeps the accordion (a side-by-side
          panel doesn't fit a narrow screen); both share `openFaq` state. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="bg-circuit absolute inset-0 text-gray-400 dark:text-gray-700 opacity-[0.06] dark:opacity-[0.1]" />
        <div className="relative max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12">
              Common questions
            </h2>
          </Reveal>

          {/* Mobile / tablet accordion */}
          <Reveal className="lg:hidden space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[15px] font-semibold">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-blue-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Animating a CSS grid row (0fr -> 1fr) gives a smooth
                      height transition without knowing the content's
                      pixel height up front. */}
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>

          {/* Desktop: two-pane console. Keeps the terminal-window framing
              (recognizable, "techy") but the list itself uses plain
              language and standard, unambiguous "this is clickable" cues —
              a selected dot, hover background, and a chevron that appears
              on hover/selection — instead of raw "$"/">" prompt characters,
              which tested as confusing for non-technical visitors. */}
          <Reveal className="hidden lg:block">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-[#0a1120] shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden">
              {/* Fake window chrome — a light "techy" flavor cue at the
                  top; the interactive content below it is plain-language. */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-white/[0.03]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 font-mono text-[11px] text-gray-400 dark:text-gray-500">
                  faq — universalperk
                </span>
              </div>
              <div className="grid grid-cols-[300px_1fr]">
                <div className="border-r border-gray-200 dark:border-gray-700/60 py-2">
                  {FAQS.map((item, i) => {
                    const isSelected = (openFaq ?? 0) === i;
                    return (
                      <button
                        key={item.q}
                        onClick={() => setOpenFaq(i)}
                        className={`group w-full flex items-center gap-3 text-left px-4 py-3.5 text-[14px] leading-snug transition-colors ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                        }`}
                      >
                        <span
                          className={`shrink-0 w-2 h-2 rounded-full transition-colors ${
                            isSelected ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400"
                          }`}
                        />
                        <span className="flex-1">{item.q}</span>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-all ${
                            isSelected
                              ? "opacity-100 translate-x-0 text-blue-500"
                              : "opacity-0 -translate-x-1 text-gray-400 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3">
                    Answer
                  </p>
                  <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    {FAQS[openFaq ?? 0].a}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────── */}
      {/* Same `isolate` requirement as the hero — see the comment there. */}
      <section className="relative isolate px-4 sm:px-6 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <Image
            src="/images/glow.svg"
            alt=""
            width={1023}
            height={1092}
            className="absolute w-[700px] max-w-none opacity-[0.12] dark:opacity-[0.2]"
          />
          <div className="w-[480px] h-[480px] rounded-full opacity-20 dark:opacity-15 blur-[120px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Let&rsquo;s talk about what you&rsquo;re building.
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Tell us what you need. We&rsquo;ll tell you honestly whether we&rsquo;re
            the right fit, and what it would take.
          </p>
          <button
            onClick={() => openForm("landing_closing_cta")}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold px-8 py-3.5 transition shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_36px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
            data-analytics-event="quote_form_open_click"
          >
            Get a free project estimate
          </button>
        </Reveal>
      </section>

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

      <Footer />
    </div>
  );
}
