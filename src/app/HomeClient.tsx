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
  Bot,
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
  RefreshCw,
  FileText,
  Compass,
  Check,
} from "lucide-react";
import GridBackdrop from "@/components/common/GridBackdrop";
import CaseStudiesSection from "@/components/marketing/CaseStudiesSection";
import StartupSection from "@/components/marketing/StartupSection";
import DeliveryProcess from "@/components/marketing/DeliveryProcess";
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
  { value: "9+", label: "Years of experience" },
  { value: "25+", label: "Projects delivered" },
  { value: "1", label: "Team, start to finish" },
  { value: "6", label: "Core capabilities" },
];

// Prospect problems and the outcome we can help them achieve.
const USE_CASES = [
  {
    icon: Bot,
    title: "Your team has an AI idea, but no one to build it",
    desc: "We work alongside your team, turn the idea into a working test version, and take it all the way to full use.",
    tag: "AI · Embedded engineers",
  },
  {
    icon: RefreshCw,
    title: "Your old system is slowing everyone down",
    desc: "We rebuild or move your system to the cloud, so it runs faster and stops holding your team back.",
    tag: "Modernization · Cloud",
  },
  {
    icon: FileText,
    title: "Your team spends hours on manual paperwork",
    desc: "We build tools that read and sort documents automatically, so your team can focus on real work.",
    tag: "Document AI · Automation",
  },
  {
    icon: BarChart3,
    title: "You have data, but no clear way to use it",
    desc: "We build tools that turn your data into simple, useful answers you can act on right away.",
    tag: "Data · Machine learning",
  },
  {
    icon: Rocket,
    title: "You need a new app or website, and need it fast",
    desc: "We plan, design, and build it as one team, so nothing gets lost between different vendors.",
    tag: "Web · Mobile",
  },
  {
    icon: Compass,
    title: "You're not sure what to build first",
    desc: "We start with a short planning session to find the highest-value project before writing a line of code.",
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
    name: "Startups & product teams",
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
    desc: "Who did what, and when, recorded in a way you can actually produce if you're ever asked.",
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

// Each item gets its own gradient within the brand's blue/cyan family
// (never a color outside it — see the palette rule in AGENTS.md) so the
// four icon tiles read as a related set rather than four identical copies
// of the same swatch.
const WHY_US = [
  {
    icon: Users,
    title: "One accountable team",
    desc: "The people who design your system are the people who build and support it. No subcontractor handoffs.",
    gradient: "from-blue-600 to-cyan-400",
  },
  {
    icon: BadgeCheck,
    title: "Senior engineers on your project",
    desc: "You get experienced engineers doing the work, not a junior team learning on your budget.",
    gradient: "from-blue-700 to-sky-500",
  },
  {
    icon: Receipt,
    title: "Fixed scope, no surprise invoices",
    desc: "We agree what's being built and what it costs before we start, and we stick to it.",
    gradient: "from-sky-500 to-cyan-400",
  },
  {
    icon: LifeBuoy,
    title: "A named contact after launch",
    desc: "One person you can actually reach, with an agreed response time and continuity after launch.",
    gradient: "from-blue-500 to-sky-400",
  },
];

const ENGAGEMENTS = [
  {
    icon: Layers,
    name: "Fixed-scope project",
    desc: "A defined outcome for a defined price. Best when you know what you need built.",
    fit: "a specific system, app, or migration",
  },
  {
    icon: UserPlus,
    name: "Embedded engineers",
    desc: "Our engineers work inside your team and ship alongside your people. Best when you have the direction but not the capacity.",
    fit: "teams with a roadmap and no bandwidth",
  },
  {
    icon: LifeBuoy,
    name: "Ongoing support",
    desc: "We keep what we built running, fix issues, and keep improving it after launch.",
    fit: "live systems that need to stay healthy",
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

// FAQPage structured data built straight from FAQS above, so the schema
// can never drift out of sync with the visible accordion/terminal content.
// This is the single highest-value piece of structured data on the page
// for AEO specifically: an answer engine (or a GenAI browsing tool) can
// lift a question/answer pair here directly into a generated answer with
// attribution, rather than having to summarize prose.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const TRUST_LOGOS = [
  { src: "/icons/payPal.svg", alt: "PayPal", w: 80 },
  { src: "/icons/bayer.svg", alt: "Bayer", w: 64 },
  { src: "/icons/tik-tok.svg", alt: "TikTok", w: 72 },
  { src: "/icons/cognizant.svg", alt: "Cognizant", w: 100 },
  { src: "/icons/turing.svg", alt: "Turing", w: 72 },
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

// TODO(hero typewriter): re-enable once the reveal renders reliably.
// Shipped and reverted twice on 2026-09-14 — the gradient-clip-per-letter
// version left "and AI tools" not rendering for some viewers even after
// switching to a plain solid color for the typed run, so this is parked
// as static text rather than shipping a flaky hero. Next attempt should
// probably avoid splitting the phrase into ~28 individually-animated DOM
// nodes altogether (e.g. a single-element `clip-path`/`width` reveal
// instead of per-character spans) rather than continuing to patch the
// per-character approach. See src/app/globals.css for the still-present
// `.type-char`/`.type-caret` keyframes this would reuse.
//
// // Per-character stagger step (ms) for the hero headline's typewriter
// // reveal — see the `.type-char` comment in globals.css for how this
// // stays crawler- and screen-reader-safe.
// const TYPE_STEP_MS = 90;
//
// /**
//  * Splits `text` into individually-staggered `<span>` characters for the
//  * hero headline's typewriter effect — only "website, app, and AI
//  * tools." types in; "One team to build your" renders as normal static
//  * text. Plain inline `<span>`s (not `inline-block`) so word-wrapping at
//  * narrow viewports still happens only at the real space characters,
//  * not mid-word.
//  */
// function typeChars(text: string, startIndex: number) {
//   return text.split("").map((char, i) => (
//     <span
//       key={startIndex + i}
//       className="type-char text-blue-600 dark:text-cyan-400"
//       style={{ animationDelay: `${(startIndex + i) * TYPE_STEP_MS}ms` }}
//     >
//       {char}
//     </span>
//   ));
// }

// Existing project artwork shows the products behind our web and mobile services.
function HeroVisual() {
  return (
    <figure className="mx-auto w-full max-w-[520px]">
      <div className="relative aspect-[6/5]">
        <div aria-hidden className="absolute inset-x-3 bottom-4 top-4 border-y border-gray-200 dark:border-white/10" />
        <Image
          src="/images/case-studies/Macbook_Laptop.svg"
          alt="WMTFA stakeholder management web application displayed on a laptop"
          width={482}
          height={325}
          priority
          sizes="(max-width: 640px) 65vw, 390px"
          className="absolute bottom-0 left-0 h-auto w-[75%] drop-shadow-lg"
        />
        <Image
          src="/images/case-studies/iPhone-15.svg"
          alt="DASGUZO car rental app showing vehicle search and booking on mobile"
          width={343}
          height={456}
          priority
          sizes="(max-width: 640px) 44vw, 260px"
          className="absolute right-0 top-0 h-auto w-[50%] drop-shadow-lg"
        />
      </div>
      <figcaption className="mt-5 flex items-center justify-between gap-4 border-t border-gray-200 pt-4 text-sm dark:border-white/10">
        <span className="text-gray-600 dark:text-gray-400">Real products. Built by our team.</span>
        <a href="#case-studies" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-blue-600 dark:text-cyan-400">
          Our work <ArrowRight aria-hidden className="h-4 w-4" />
        </a>
      </figcaption>
    </figure>
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

/**
 * Segmented "What we do / How we help" control over one shared list of
 * rows, modelled on the tabbed services block at glidedesign.com: a pill
 * switch with a solid active state, then large typographic rows separated
 * by hairlines rather than a grid of cards.
 *
 * The rows are presentational, not links — we don't have a page per
 * service to send anyone to — so they carry a hover accent (the dot and
 * the rule tinting) but deliberately no arrow affordance, which would
 * promise a destination that doesn't exist.
 */
function CapabilityTabs() {
  const [tab, setTab] = useState<"what" | "how">("what");

  const rows =
    tab === "what"
      ? SERVICES.map((s) => ({ icon: s.icon, title: s.title, desc: s.desc, tag: undefined }))
      : USE_CASES.map((u) => ({ icon: u.icon, title: u.title, desc: u.desc, tag: u.tag }));

  const tabs = [
    { id: "what", label: "What we do" },
    { id: "how", label: "How we help" },
  ] as const;

  return (
    <div>
      {/* Pill switch. `role="tablist"` + arrow-free buttons keeps it
          operable from the keyboard without pulling in a tab library. */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Capabilities"
          className="inline-flex gap-1 rounded-full border border-blue-200 p-1.5 dark:border-blue-800/50"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`min-w-[136px] rounded-full px-5 py-2.5 text-base font-semibold transition-colors sm:min-w-[188px] ${
                tab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-cyan-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows. Mobile stacks title over description; from `lg` the
          description moves into a second column so the titles form a
          single scannable left edge. */}
      <ul className="mt-10 border-t border-gray-200 dark:border-white/10">
        {rows.map((row) => (
          <li
            key={row.title}
            className="group border-b border-gray-200 py-6 transition-colors hover:border-blue-300 sm:py-7 dark:border-white/10 dark:hover:border-cyan-400/40"
          >
            <div className="flex items-start gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10">
              <div className="flex items-start gap-4">
                {/* Hover dot — the small "you're on this one" accent from
                    the reference site, scaled up from 0 so it doesn't
                    shift the row's layout. */}
                <span
                  aria-hidden
                  className="mt-3 hidden h-2.5 w-2.5 shrink-0 scale-0 rounded-full bg-blue-600 transition-transform duration-300 group-hover:scale-100 motion-reduce:transition-none lg:block dark:bg-cyan-400"
                />
                <row.icon
                  aria-hidden
                  className="mt-1 h-6 w-6 shrink-0 text-blue-600 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none dark:text-cyan-400 lg:mt-1.5 lg:h-7 lg:w-7"
                />
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl lg:text-3xl">
                    {row.title}
                  </h3>
                  {row.tag && (
                    <p className="mt-2 font-mono text-sm text-blue-600 dark:text-cyan-400">
                      {row.tag}
                    </p>
                  )}
                  <p className="mt-3 text-base leading-relaxed text-gray-600 lg:hidden dark:text-gray-400">
                    {row.desc}
                  </p>
                </div>
              </div>
              <p className="hidden text-base leading-relaxed text-gray-600 lg:block dark:text-gray-400">
                {row.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeClient() {
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
    <div className="landing-page marketing-type min-h-screen bg-white dark:bg-[#060a14] text-gray-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
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
      <section className="relative isolate overflow-hidden px-4 sm:px-6 pt-24 pb-10 sm:pt-28 sm:pb-14">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridBackdrop />
        </div>

        {/* Mobile-first: single stacked column (text, then the hero
            graphic below it) until `lg`, where it becomes a real 2-column
            layout — text left, graphic right. */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[14.5px] font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Web, mobile and AI services, built by one team
            </div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-normal leading-[1.08] mb-5">
              {/* Static for now — see the typeChars TODO above. Back to
                  the one-piece gradient span (pre-animation), not the
                  plain solid color the broken attempt fell back to. */}
              One team to build your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                website, app, and AI tools.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-9">
              Universal Perk helps growing businesses build software that
              works, move to the cloud, and put AI to real use, without
              juggling five different vendors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => openForm("landing_hero")}
                className="marketing-cta w-full sm:w-auto"
                data-analytics-event="quote_form_open_click"
              >
                Get an estimate
                <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
              </button>
              <a
                href="#case-studies"
                className="marketing-cta marketing-cta-secondary w-full sm:w-auto"
              >
                View our work
              </a>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── Trusted by — infinite scroll strip ───────────────────────── */}
      <section className="relative border-y border-gray-100 dark:border-gray-800/60 py-10 overflow-hidden">
        <p className="text-center text-[12.5px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-6">
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
              <p className="mt-2 text-[14.5px] text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── What we do / How we help ─────────────────────────────────── */}
      {/* One tabbed section replaces what used to be two: a bento grid of
          services here, and a separate "Where we come in" problem grid
          further down. Both answered the same visitor question from
          different angles — what we sell, and what it fixes — so they now
          share a segmented control, and the page loses a repeated card
          grid. The rows are deliberately large and typographic rather than
          boxed: at this size a prospect can scan the whole offering in one
          pass. */}
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
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              One team, end to end
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Six services and the everyday problems they solve. Switch
              between them below.
            </p>
          </Reveal>
          <CapabilityTabs />
        </div>
      </section>

      {/* ── Industries we serve ─────────────────────────────────────── */}
      {/* Equal-weight cards on purpose: signals relevance to regulated,
          premium buyers (practices, labs, firms) without narrowing the
          whole page down to a single vertical. */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* The blueprint texture, tinted with the brand blue/cyan pair
              instead of the site-wide grey `bg-circuit` — this section and
              "Security" below are the two places the page argues its
              engineering credibility, so they get the brand accent rather
              than the neutral texture used elsewhere. The wrapper's radial
              mask fades it out toward the edges so it sits behind the
              cards as a soft corner wash rather than a hard-edged tile. */}
          <div className="absolute -bottom-40 -left-32 h-[620px] w-[620px] [mask-image:radial-gradient(circle,black_35%,transparent_75%)]">
            <div className="bg-blueprint animate-blueprint-pan absolute inset-0 text-blue-600 dark:text-cyan-400" />
          </div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Who we build for
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
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
                  <h3 className="text-[18px] font-semibold mb-2">{ind.name}</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Built with tools that actually ship
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              The full stack, in one team, so no part of your project has
              to be handed to someone else.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TECH_GROUPS.map((group, i) => (
              <Reveal key={group.label} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="group h-full rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.03] shadow-sm p-5 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_10px_28px_rgba(37,99,235,0.12)] transition">
                  <p className="text-[12.5px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
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
                        className="rounded-md bg-gray-100 dark:bg-white/[0.06] px-2 py-1 text-[12.5px] font-medium text-gray-600 dark:text-gray-400"
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

      <CaseStudiesSection />
      <StartupSection onGetStarted={() => openForm("landing_startup")} />

      {/* ── Security & compliance ───────────────────────────────────── */}
      {/* For regulated buyers (practices, labs, firms) this is usually the
          section that decides whether they keep reading. Every claim here
          is one the business can actually back — deliberately no SOC 2
          line, and it says "HIPAA-compliant delivery", never "HIPAA
          certified", which isn't a real vendor certification. */}
      <section className="relative isolate overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
        {/* Same brand-tinted blueprint texture as "Who we build for" above,
            full-bleed. The gradient wash keeps the section's copy readable
            over it. */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="bg-blueprint animate-blueprint-pan absolute inset-0 text-blue-600/70 dark:text-cyan-400/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white dark:from-[#060a14] dark:via-[#060a14]/70 dark:to-[#060a14]" />
          <div className="animate-drift absolute top-0 right-0 w-[420px] h-[420px] rounded-full opacity-[0.12] dark:opacity-[0.18] blur-[110px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[14.5px] font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Security &amp; compliance
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Built for businesses that can&rsquo;t afford a data problem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
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
                  <h3 className="text-[18px] font-semibold mb-2">{item.title}</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Need this in writing for your compliance review?{" "}
              <button
                onClick={() => openForm("landing_security")}
                className="inline-flex min-h-11 items-center font-semibold text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
              >
                Request the packet
              </button>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <DeliveryProcess />

      {/* ── Engagement models ───────────────────────────────────────── */}
      {/* Premium buyers want to know what "working together" actually
          means before they'll take a call. Three clear entry points with
          an explicit "best for" line removes that ambiguity. */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="bg-circuit absolute inset-0 text-gray-400 dark:text-gray-700 opacity-[0.06] dark:opacity-[0.1]" />
        <div className="relative max-w-5xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Ways to work with us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Start where it makes sense. You can always change shape later.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ENGAGEMENTS.map((e, i) => (
              <Reveal key={e.name} style={{ animationDelay: `${i * 90}ms` }}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] dark:border-gray-700/50 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                  {/* Gradient top rule — a light "spec sheet" cue */}
                  <span className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 p-6">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      <e.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-[19px] font-semibold mb-2">{e.name}</h3>
                    <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                      {e.desc}
                    </p>
                  </div>
                  {/* Footer: bleeds to the card's edges on a tinted plate so
                      "best for" reads as a spec rather than another line of
                      body copy — the same distinction a real spec sheet
                      draws between description and fit. */}
                  <div className="flex items-start gap-2.5 border-t border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50/60 px-6 py-4 dark:border-blue-500/15 dark:from-blue-500/[0.08] dark:to-cyan-400/[0.04]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 dark:bg-cyan-400">
                      <Check aria-hidden className="h-3 w-3 text-white dark:text-gray-950" strokeWidth={3} />
                    </span>
                    <p className="text-[13.5px] leading-snug">
                      <span className="font-semibold text-blue-700 dark:text-cyan-400">Best for </span>
                      <span className="text-gray-600 dark:text-gray-300">{e.fit}</span>
                    </p>
                  </div>
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Why teams choose us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              The things clients tell us mattered most after working with
              other agencies.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_US.map((w, i) => (
              <Reveal key={w.title} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="group h-full flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-white/[0.02] shadow-sm p-6 hover:border-blue-300 dark:hover:border-blue-500/40 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] transition">
                  {/* Bigger tile, a soft brand-colored glow behind it, and a
                      slight rotate on hover — this section is the page's
                      one spot for a solid-fill icon badge, so it's worth
                      making it read as more deliberate than the flat
                      tinted badges used everywhere else on the page. */}
                  <div
                    className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${w.gradient} flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(37,99,235,0.45)] ring-1 ring-white/40 dark:ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <w.icon className="w-6 h-6 text-white" strokeWidth={2.25} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold mb-2">{w.title}</h3>
                    <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                      {w.desc}
                    </p>
                  </div>
                </div>
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
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-12">
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
                    <span className="text-base font-semibold">{item.q}</span>
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
                      <p className="px-5 pb-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
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
                <span className="ml-3 font-mono text-[12.5px] text-gray-400 dark:text-gray-500">
                  faq / universalperk
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
                        className={`group w-full flex items-center gap-3 text-left px-4 py-3.5 text-base leading-snug transition-colors ${
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
                  <p className="text-[12.5px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3">
                    Answer
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
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
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Let&rsquo;s talk about what you&rsquo;re building.
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Tell us what you need. We&rsquo;ll tell you honestly whether we&rsquo;re
            the right fit, and what it would take.
          </p>
          <button
            onClick={() => openForm("landing_closing_cta")}
            className="marketing-cta w-full sm:w-auto"
            data-analytics-event="quote_form_open_click"
          >
            Discuss a project
            <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
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
