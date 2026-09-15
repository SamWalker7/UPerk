"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Braces,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileSearch,
  FlaskConical,
  GaugeCircle,
  KeyRound,
  Layers,
  LineChart,
  Lock,
  PackageCheck,
  PhoneCall,
  Radar,
  ScrollText,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  UserPlus,
  Workflow,
} from "lucide-react";
import Navebar from "@/components/header/Navebar";
import { Footer } from "@/components/footer/Fotter";
import Chatbot from "@/components/chatbot/Chatbot";
import GetAQuote from "@/components/get-a-quote/GetAQuote";
import Overlay from "@/components/common/Overlay";
import GridBackdrop from "@/components/common/GridBackdrop";
import Reveal from "@/components/common/Reveal";
import CalendlyEmbed from "@/components/header/CalendlyEmbed";
import { trackEvent } from "@/lib/analytics";
import {
  clearGetStartedHash,
  hasGetStartedHash,
  setGetStartedHash,
} from "@/lib/getStartedTracking";

// ─── Content ─────────────────────────────────────────────────────────────────

// An illustrative agent run, rendered in the hero console. Every line is a
// real stage of a system we'd ship — routing, retrieval, tool use, an eval
// gate, and a human handoff — so the visual doubles as an explanation of
// how the work is actually built. Labelled "illustrative" in the UI: these
// are not a specific client's numbers.
const TRACE = [
  { step: "route", detail: "intent: billing_dispute → agent.v4", accent: false },
  { step: "retrieve", detail: "12 passages · your policy corpus", accent: false },
  { step: "tool_call", detail: "crm.lookup(account) · 240ms", accent: false },
  { step: "eval_gate", detail: "grounded 0.96 · PII clean · passed", accent: true },
  { step: "resolve", detail: "answered · 1 of 43 escalated to a human", accent: false },
];

// The three reasons AI work stalls, phrased the way a buyer experiences
// them rather than the way an engineer would describe them.
const STALLS = [
  {
    icon: Radar,
    title: "Nobody can say what it's worth",
    desc: "The demo impressed everyone and then sat there, because no one measured what it saves, what it earns, or what it costs to run.",
    fix: "We size the opportunity in hours and dollars before a line of code is written.",
  },
  {
    icon: FlaskConical,
    title: "It works in the demo, not on your data",
    desc: "Accuracy that looks fine on ten test questions falls apart on the messy, real inputs your team deals with every day.",
    fix: "We build an eval set from your real cases and prove the accuracy before launch.",
  },
  {
    icon: Lock,
    title: "Legal and security stop it at the door",
    desc: "The moment it touches patient records, client files, or payment data, the off-the-shelf tool is disqualified.",
    fix: "We build inside your cloud, sign a BAA, and hand you the audit trail.",
  },
];

// Where we plug into a client's stack, rendered as a six-layer diagram.
// Deliberately not another card grid — the strata layout is the page's
// signature visual and shows we own the whole stack, not one tool.
const LAYERS = [
  {
    label: "Interface",
    blurb: "Where your customers and staff actually meet the system.",
    chips: ["Web & in-app chat", "Voice & telephony", "Email & SMS", "Slack / Teams"],
  },
  {
    label: "Agents & orchestration",
    blurb: "The part that does the task instead of talking about it.",
    chips: ["Tool use", "MCP servers", "Multi-step workflows", "Human-in-the-loop"],
  },
  {
    label: "Model layer",
    blurb: "The right model for the job, tuned to your language.",
    chips: ["Model selection", "Fine-tuning & RFT", "Distillation", "Context engineering"],
  },
  {
    label: "Knowledge & data",
    blurb: "Answers from your business, not from the open internet.",
    chips: ["RAG pipelines", "Vector search", "Document extraction", "Systems of record"],
  },
  {
    label: "Evaluation & guardrails",
    blurb: "The proof that it behaves, before and after launch.",
    chips: ["Golden datasets", "Regression gates", "LLM-as-judge", "PII & red-teaming"],
  },
  {
    label: "Run & observe",
    blurb: "Keeping it fast, cheap and accurate once it's live.",
    chips: ["Tracing", "Cost & latency budgets", "Drift monitoring", "On-call support"],
  },
];

// Outcome first, capability second — a prospect should recognise their own
// problem in the heading before they meet the acronym underneath it.
const SERVICES = [
  {
    icon: Compass,
    kind: "AI opportunity audit",
    entry: true,
    title: "Find the AI work that actually pays",
    desc: "We map every candidate use case against the hours it saves and the revenue it protects, then tell you which one to build first — and which ones to leave alone.",
    points: ["Use-case scoring in hours and dollars", "Build, buy or skip recommendation", "A costed roadmap you own"],
  },
  {
    icon: UserPlus,
    kind: "Forward-deployed engineering",
    title: "Put a senior AI engineer inside your team",
    desc: "Our engineer works in your repo, your stack and your standups — turning your team's idea into a working system instead of another backlog ticket.",
    points: ["Embedded in your workflow, not a black box", "Prototype to production in weeks", "Your team keeps the knowledge"],
  },
  {
    icon: Target,
    kind: "Evaluation & benchmarking",
    title: "Prove it works before it touches a customer",
    desc: "We turn your real cases into a scored test suite, so every model, prompt and release is measured against the same bar instead of argued about in a meeting.",
    points: ["Golden dataset built from your cases", "Model bake-off on your own data", "Regression gates in your pipeline"],
  },
  {
    icon: Braces,
    kind: "Fine-tuning, RFT & distillation",
    title: "Make the model an expert in your business",
    desc: "When general models get your terminology, tone or edge cases wrong, we train on your data — supervised or reinforcement — and distill it down so it runs cheaper and faster.",
    points: ["Supervised and reinforcement fine-tuning", "Distilled for lower cost and latency", "Benchmarked against the base model"],
  },
  {
    icon: PhoneCall,
    kind: "Voice AI",
    title: "Stop losing the calls nobody answers",
    desc: "A voice agent that picks up every call, books the appointment, answers the routine question, and hands the real ones to your team with the context already gathered.",
    points: ["Answers 24/7, no hold queue", "Books straight into your calendar", "Clean handoff with a call summary"],
  },
  {
    icon: FileSearch,
    kind: "Document AI",
    title: "End the manual paperwork shift",
    desc: "Intake forms, invoices, claims, contracts and scans read, extracted and filed into your systems — with a confidence score and a human check where it matters.",
    points: ["Extraction from messy real-world files", "Confidence scoring and review queue", "Straight into your systems of record"],
  },
  {
    icon: Bot,
    kind: "Agent engineering",
    title: "Agents that finish the task, not just chat",
    desc: "We connect models to your tools and data through MCP and typed integrations, so the system books, updates, files and escalates instead of producing text about it.",
    points: ["Tool use and MCP integrations", "Multi-step workflows with approvals", "Human-in-the-loop where stakes are high"],
  },
  {
    icon: Layers,
    kind: "Knowledge & RAG",
    title: "Answers from your business, not the internet",
    desc: "Your policies, product docs, contracts and history made searchable and answerable — with citations, so anyone can check where the answer came from.",
    points: ["Retrieval tuned on your corpus", "Cited, checkable answers", "Access rules follow the user"],
  },
  {
    icon: GaugeCircle,
    kind: "LLMOps & governance",
    title: "Keep it accurate after launch day",
    desc: "Live systems drift. We instrument yours with tracing, cost and latency budgets, and scheduled evals, so you find out before your customers do.",
    points: ["Tracing and cost control", "Scheduled eval runs and alerting", "Named contact and response times"],
  },
];

// An eval-gated delivery loop, not a generic four-step agency process.
// The "gate" line on each step is the differentiator: something has to be
// true before the work moves on.
const LOOP = [
  {
    n: "01",
    title: "Discovery & Scoping",
    desc: "A short working session with the people doing the work, to find where the time and money actually goes.",
    gate: "Gate: one use case with a number attached to it.",
  },
  {
    n: "02",
    title: "Define Success Metrics",
    desc: "We assemble a scored eval set from your real cases and benchmark candidate models against it.",
    gate: "Gate: a target accuracy everyone has agreed to.",
  },
  {
    n: "03",
    title: "Production Launch",
    desc: "One end-to-end workflow in production — integrated, monitored, and handling real volume.",
    gate: "Gate: it beats the eval bar on live traffic.",
  },
  {
    n: "04",
    title: "Scale & Optimize",
    desc: "Expand coverage, tune cost and latency, and wire evals into your release pipeline so quality can't regress silently.",
    gate: "Gate: regressions fail the build, not the customer.",
  },
];

const ENGAGEMENTS = [
  {
    icon: Compass,
    name: "AI opportunity audit",
    meta: "2 weeks · fixed fee",
    desc: "A fixed-fee sprint that ends with a scored use-case shortlist, a costed roadmap, and an honest answer on whether to build at all.",
    fit: "teams who know AI matters but not where to start",
  },
  {
    icon: Workflow,
    name: "Production build",
    meta: "Fixed scope · fixed price",
    desc: "A defined system, a defined price. We design, build, evaluate and deploy it into your stack, then support it.",
    fit: "a specific system you already want shipped",
  },
  {
    icon: UserPlus,
    name: "Embedded engineers (FDE)",
    meta: "Month to month",
    desc: "Senior AI engineers working inside your team on your roadmap, shipping alongside your people month to month.",
    fit: "teams with the direction but not the AI capacity",
  },
  {
    icon: ServerCog,
    name: "Managed AI operations",
    meta: "Ongoing retainer",
    desc: "We keep live systems accurate and affordable — monitoring, scheduled evals, model upgrades and on-call cover.",
    fit: "AI already in production that has to keep behaving",
  },
];

// Model-agnostic on purpose: the audit picks the model, not the sales
// pitch. Only tools we have real brand assets for get a logo; the rest are
// text chips rather than shipping marks we don't have licensed.
const STACK = [
  {
    label: "Models",
    logos: [
      { name: "OpenAI", src: "/icons/tech/openai.svg" },
      { name: "Anthropic Claude", src: "/icons/tech/claude.svg" },
      { name: "Google Gemini", src: "/icons/tech/googlegemini.svg" },
      { name: "AWS Bedrock", src: "/icons/tech/aws-nova.svg" },
      { name: "Mistral AI", src: "/icons/tech/mistralai.svg" },
      { name: "Meta Llama", src: "/icons/tech/meta.svg" },
      { name: "Hugging Face", src: "/icons/tech/huggingface.svg" },
    ],
    also: ["Open-weight models"],
  },
  {
    label: "Agents & orchestration",
    logos: [
      { name: "LangChain", src: "/icons/tech/langchain.svg" },
      { name: "LangGraph", src: "/icons/tech/langgraph.svg" },
      { name: "CrewAI", src: "/icons/tech/crewai.svg" },
      { name: "n8n", src: "/icons/tech/n8n.svg" },
      { name: "Zapier", src: "/icons/tech/zapier.svg" },
    ],
    also: ["MCP", "Tool calling"],
  },
  {
    label: "Voice",
    logos: [
      { name: "ElevenLabs", src: "/icons/tech/elevenlabs.svg" },
      { name: "Deepgram", src: "/icons/tech/deepgram.svg" },
      { name: "OpenAI Realtime", src: "/icons/tech/openai.svg" },
      // Black marks: flipped in dark mode so they don't vanish.
      { name: "LiveKit", src: "/icons/tech/livekit.svg", darkInvert: true },
      { name: "WebRTC", src: "/icons/tech/webrtc.svg", darkInvert: true },
      { name: "Vonage", src: "/icons/tech/vonage.svg", darkInvert: true },
    ],
    also: ["Telephony & SIP"],
  },
  {
    label: "Evals & observability",
    logos: [
      { name: "LangSmith", src: "/icons/tech/langsmith.svg" },
      { name: "Weights & Biases", src: "/icons/tech/weightsandbiases.svg" },
      { name: "Grafana", src: "/icons/tech/grafana.svg" },
    ],
    also: ["Custom eval harnesses", "LLM-as-judge", "Tracing"],
  },
  {
    label: "Data & retrieval",
    logos: [
      { name: "PostgreSQL", src: "/icons/tech/postgresql.svg" },
      { name: "Supabase", src: "/icons/tech/supabase.svg" },
      { name: "Redis", src: "/icons/tech/redis.svg" },
      { name: "Python", src: "/icons/tech/python.svg" },
      { name: "FastAPI", src: "/icons/tech/fastapi.svg" },
    ],
    also: ["pgvector", "Hybrid search"],
  },
  {
    label: "Cloud & delivery",
    logos: [
      { name: "AWS", src: "/icons/tech/aws.svg" },
      { name: "Google Cloud", src: "/icons/tech/googlecloud.svg" },
      { name: "Docker", src: "/icons/tech/docker.svg" },
      { name: "Kubernetes", src: "/icons/tech/kubernetes.svg" },
      { name: "Terraform", src: "/icons/tech/terraform.svg" },
    ],
    also: ["Your cloud account"],
  },
];

const TRUST_LOGOS = [
  { src: "/icons/payPal.svg", alt: "PayPal", w: 80 },
  { src: "/icons/bayer.svg", alt: "Bayer", w: 64 },
  { src: "/icons/tik-tok.svg", alt: "TikTok", w: 72 },
  { src: "/icons/cognizant.svg", alt: "Cognizant", w: 100 },
  { src: "/icons/turing.svg", alt: "Turing", w: 72 },
];

// Only claims the business can actually back. No SOC 2 line — not
// certified — and never "HIPAA certified", which isn't a vendor
// certification that exists. The two governance cards restate commitments
// already made in the services list (human-in-the-loop, access rules).
const TRUST = [
  {
    icon: ShieldCheck,
    title: "HIPAA-compliant, with a signed BAA",
    desc: "We build to HIPAA requirements and sign a Business Associate Agreement before any work involves patient data.",
  },
  {
    icon: ServerCog,
    title: "Deployed in your own cloud",
    desc: "Your data stays inside your infrastructure. You own the code, the prompts and the test data we create.",
  },
  {
    icon: Lock,
    title: "Your data is never used for training",
    desc: "We use enterprise AI services with training turned off, and remove sensitive details before any data leaves your systems.",
  },
  {
    icon: ScrollText,
    title: "A full audit trail",
    desc: "Every question, source, action and answer is recorded, so you can show a regulator or client exactly what happened.",
  },
  {
    icon: UserCheck,
    title: "People approve high-risk decisions",
    desc: "You decide which actions need human sign-off. The system pauses and waits for approval instead of acting on its own.",
  },
  {
    icon: KeyRound,
    title: "Access follows your existing permissions",
    desc: "The AI only sees and shares what each user is already allowed to access, using the roles you manage today.",
  },
];

const FAQS = [
  {
    q: "How do we know the AI is actually accurate?",
    a: "We build a scored test set from your own real cases before development starts, and agree a target the system has to hit. Every release is measured against it, so accuracy is a number you can check rather than an opinion.",
  },
  {
    q: "What is a forward-deployed engineer?",
    a: "A senior engineer from our team who works inside yours — in your repo, your tools and your meetings — instead of delivering from behind a wall. It's the fastest way to get an idea from your team into production without hiring for AI skills you only need for a few months.",
  },
  {
    q: "Do we need to fine-tune a model?",
    a: "Usually not first. Better prompts, retrieval and tooling solve most problems more cheaply. We fine-tune when the general model keeps getting your terminology, tone or edge cases wrong, or when distilling to a smaller model would cut your running costs significantly.",
  },
  {
    q: "Which AI models do you use?",
    a: "Whichever one wins on your data. We benchmark candidates — including Claude, OpenAI, models on AWS Bedrock, and open-weight options — against your eval set, and we build so the model can be swapped later without a rewrite.",
  },
  {
    q: "Can you work with sensitive or regulated data?",
    a: "Yes. We deploy inside your cloud account, use model endpoints that don't train on your data, redact sensitive fields, log every decision for audit, and will sign a Business Associate Agreement for healthcare work.",
  },
  {
    q: "How long before we see something real?",
    a: "An opportunity audit takes a couple of weeks. A first production workflow is typically live in weeks rather than quarters, because we ship one end-to-end slice first instead of building everything before anything works.",
  },
];

// FAQPage structured data generated from FAQS so the schema can't drift
// out of sync with what's rendered on the page.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

// ─── Hero console ────────────────────────────────────────────────────────────

/**
 * A mock agent run that types itself out line by line. It replaces the
 * stock "AI illustration" most agency pages use with something that shows
 * how the systems are actually built — routing, retrieval, tool calls and
 * an eval gate — which is the page's whole argument in one graphic.
 */
function RunConsole() {
  // Start fully rendered so the server output and the no-JS/reduced-motion
  // experience both show the complete trace.
  const [shown, setShown] = useState(TRACE.length);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;

    function start() {
      clearTimeout(timer);
      if (motion.matches) {
        setShown(TRACE.length);
        return;
      }
      let next = 0;
      setShown(0);
      function tick() {
        next += 1;
        setShown(next);
        // Hold the finished trace for four seconds, then replay it.
        timer = setTimeout(next === TRACE.length ? start : tick, next === TRACE.length ? 4000 : 700);
      }
      timer = setTimeout(tick, 500);
    }

    start();
    motion.addEventListener("change", start);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", start);
    };
  }, []);

  return (
    <figure className="mx-auto w-full max-w-[540px]">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-gray-700/60 dark:bg-[#0a1120]">
        {/* Window chrome — a light "this is a real system" cue. */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700/60 dark:bg-white/[0.03]">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="ml-3 font-mono text-[12.5px] text-gray-400 dark:text-gray-500">
            agent-run · support.v4
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11.5px] text-blue-600 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 dark:bg-cyan-400" />
            live
          </span>
        </div>

        <ul className="space-y-2.5 p-4 font-mono text-[12.5px] sm:p-5 sm:text-[13px]">
          {TRACE.map((line, i) => (
            <li
              key={line.step}
              // Lines hold their space while hidden so the card never
              // reflows as the trace plays.
              className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 transition-opacity duration-500 ${
                i < shown ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className={line.accent ? "text-cyan-500 dark:text-cyan-400" : "text-blue-600 dark:text-blue-400"}>
                →
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{line.step}</span>
              <span className={line.accent ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"}>
                {line.detail}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer strip: the eval score is the point of the whole graphic. */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700/60 dark:bg-white/[0.03] sm:px-5">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Eval score
            </span>
            <span className="font-mono text-[13px] font-semibold text-blue-600 dark:text-cyan-400">
              0.96 / target 0.92
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-4 text-sm dark:border-white/10">
        <span className="text-gray-500 dark:text-gray-400">Illustrative run trace.</span>
        <a href="#how-we-build" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-blue-600 dark:text-cyan-400">
          How we build <ArrowRight aria-hidden className="h-4 w-4" />
        </a>
      </figcaption>
    </figure>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AIServicesClient() {
  const [showForm, setShowForm] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  // One FAQ open at a time; the first starts open so the block doesn't
  // read as empty on first paint.
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  function openForm(source: string) {
    trackEvent("quote_form_open", { category: "lead_generation", source });
    setGetStartedHash();
    setShowForm(true);
  }

  function openCalendly(source: string) {
    trackEvent("calendly_open", { category: "lead_generation", source });
    setShowCalendly(true);
  }

  return (
    <div className="landing-page marketing-type min-h-screen bg-white text-gray-900 dark:bg-[#060a14] dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <Navebar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      {/* `isolate` is load-bearing: without it `position: relative` alone
          doesn't create a stacking context, and the `-z-10` background
          layer escapes this section and paints behind the page entirely. */}
      <section className="relative isolate overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <GridBackdrop />
          <div className="animate-drift absolute -top-32 right-0 h-[520px] w-[520px] rounded-full opacity-[0.16] blur-[120px] dark:opacity-[0.22] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="text-center lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[14.5px] font-medium text-blue-600 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400">
              <Sparkles aria-hidden className="h-4 w-4" />
              Applied AI engineering
            </div>
            <h1 className="mb-5 text-5xl font-semibold leading-[1.08] tracking-normal sm:text-6xl">
              Get AI out of the pilot and{" "}
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                into production.
              </span>
            </h1>
            <p className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-gray-600 lg:mx-0 dark:text-gray-400 sm:text-xl">
              We find where AI actually moves your numbers, prove it against
              your own data, and ship it into the systems your business already
              runs on — inside your cloud, with the audit trail your compliance
              team will ask for.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={() => openForm("ai_services_hero")}
                className="marketing-cta w-full sm:w-auto"
                data-analytics-event="quote_form_open_click"
                data-analytics-category="lead_generation"
                data-analytics-label="AI Hero Audit"
              >
                Book an AI opportunity audit
                <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
              </button>
              <button
                onClick={() => openCalendly("ai_services_hero")}
                className="marketing-cta marketing-cta-secondary w-full sm:w-auto"
                data-analytics-event="calendly_open_click"
                data-analytics-category="lead_generation"
                data-analytics-label="AI Hero Discovery Call"
              >
                Talk to an engineer
              </button>
            </div>

            {/* Capability rail: scannable proof of range without another
                card grid this high up the page. */}
            <ul className="mt-9 flex flex-wrap justify-center gap-2 lg:justify-start">
              {["Evals", "Fine-tuning & RFT", "Agents", "Voice AI", "Document AI", "Embedded engineers"].map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-gray-200 px-3 py-1.5 font-mono text-[12.5px] text-gray-600 dark:border-gray-700/60 dark:text-gray-400"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <RunConsole />
        </div>
      </section>

      {/* ── Trusted by ───────────────────────────────────────────────── */}
      {/* Proof sits immediately under the hero on purpose: a buyer deciding
          whether to keep reading wants to know who has trusted us before
          they read a word of the pitch. */}
      <section className="relative overflow-hidden border-t border-gray-100 py-9 dark:border-gray-800/60">
        <p className="mb-6 text-center text-[12.5px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          Engineers who have shipped at
        </p>
        {/* The list is duplicated so translating by exactly -50% lines the
            second copy up with the first and the loop is seamless. */}
        <div className="relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max">
            {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="relative mx-6 opacity-40 transition-opacity hover:opacity-80 dark:opacity-25 dark:hover:opacity-60 sm:mx-10"
                style={{ width: logo.w, height: 28 }}
              >
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AI stalls ─────────────────────────────────────────────── */}
      {/* A sticky heading beside hairline-separated rows: a different
          rhythm from the card grids further down, and it lets the problem
          statement stay on screen while the three failure modes scroll. */}
      <section className="relative overflow-hidden border-y border-gray-100 px-4 py-16 dark:border-gray-800/60 sm:px-6 sm:py-20 bg-gray-50 dark:bg-white/[0.015]">
        <div className="bg-circuit absolute inset-0 text-gray-400 opacity-[0.07] dark:text-gray-700 dark:opacity-[0.12]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                The real problem
              </p>
              <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Most AI projects die after the demo
              </h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Not because the technology failed. Because nobody could prove
                what it was worth, nobody tested it on real inputs, and nobody
                got it past security. That&rsquo;s the part we do differently.
              </p>
            </div>
          </Reveal>

          <ul className="border-t border-gray-200 dark:border-white/10">
            {STALLS.map((s, i) => (
              <Reveal key={s.title} style={{ animationDelay: `${i * 80}ms` }}>
                <li className="group border-b border-gray-200 py-7 transition-colors hover:border-blue-300 dark:border-white/10 dark:hover:border-cyan-400/40">
                  <div className="flex items-start gap-4">
                    <s.icon
                      aria-hidden
                      className="mt-1 h-6 w-6 shrink-0 text-blue-600 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none dark:text-cyan-400"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold leading-snug sm:text-2xl">{s.title}</h3>
                      <p className="mt-2.5 text-base leading-relaxed text-gray-600 dark:text-gray-400">{s.desc}</p>
                      <p className="mt-3 border-l-2 border-blue-500 pl-3 text-base font-medium text-blue-700 dark:border-cyan-400 dark:text-cyan-400">
                        {s.fix}
                      </p>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stack layers ──────────────────────────────────────────────── */}
      {/* The page's signature visual: six strata showing we own the whole
          stack rather than one layer of it. Rows rather than cards, so it
          reads as an architecture diagram, not another service menu. */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="bg-blueprint animate-blueprint-pan absolute inset-0 text-blue-600/70 dark:text-cyan-400/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white dark:from-[#060a14] dark:via-[#060a14]/70 dark:to-[#060a14]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              System anatomy
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">We build the whole stack</h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Most vendors sell you one layer and leave the rest to you. Here&rsquo;s
              every layer of a production AI system, and what we deliver at each.
            </p>
          </Reveal>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-white/[0.03]">
            {LAYERS.map((layer, i) => (
              <Reveal key={layer.label} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="group relative grid grid-cols-1 gap-3 border-b border-gray-200 p-5 transition-colors last:border-b-0 hover:bg-blue-50/60 dark:border-gray-700/50 dark:hover:bg-blue-500/[0.06] sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
                  {/* Left edge accent: fills in on hover so the strata read
                      as one connected stack being traced top to bottom. */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-gradient-to-b from-blue-600 to-cyan-400 transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none"
                  />
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 font-mono text-[12.5px] text-gray-400 dark:text-gray-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold sm:text-xl">{layer.label}</h3>
                      <p className="mt-1 text-base leading-relaxed text-gray-500 dark:text-gray-400">{layer.blurb}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {layer.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[13px] font-medium text-gray-700 transition-colors group-hover:border-blue-300 dark:border-gray-700/60 dark:bg-white/[0.04] dark:text-gray-300 dark:group-hover:border-cyan-400/40"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section id="ai-services" className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <GridBackdrop className="opacity-[0.06] dark:opacity-[0.1]" />
          <div className="animate-drift absolute -top-10 left-0 h-[380px] w-[380px] rounded-full opacity-[0.12] blur-[100px] dark:opacity-[0.18] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              What we deliver
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Everything from first audit to live system
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Every engagement is built for your workflow and your data. No
              reselling someone else&rsquo;s chatbot.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} style={{ animationDelay: `${(i % 3) * 70}ms` }}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] dark:border-gray-700/50 dark:bg-white/[0.02] dark:hover:border-blue-500/40">
                  {/* Gradient top rule — the same "spec sheet" cue used on
                      the homepage's engagement cards. */}
                  <span
                    aria-hidden
                    className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40 transition-opacity group-hover:opacity-100"
                  />
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-500/10">
                    <s.icon aria-hidden className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="font-mono text-[12px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                      {s.kind}
                    </p>
                    {/* Only the audit is flagged — with nine cards, one
                        marked entry point turns a menu into a funnel. */}
                    {"entry" in s && (
                      <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                        Start here
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2.5 text-[19px] font-semibold leading-snug">{s.title}</h3>
                  <p className="mb-5 text-base leading-relaxed text-gray-500 dark:text-gray-400">{s.desc}</p>
                  <ul className="mt-auto space-y-2 border-t border-gray-100 pt-4 dark:border-white/10">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[14px] text-gray-600 dark:text-gray-300">
                        <span
                          aria-hidden
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Not sure which of these you need?{" "}
              <button
                onClick={() => openForm("ai_services_grid")}
                className="inline-flex min-h-11 items-center font-semibold text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 dark:text-cyan-400"
                data-analytics-event="quote_form_open_click"
                data-analytics-category="lead_generation"
                data-analytics-label="AI Services Grid"
              >
                Start with the audit
              </button>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Eval-gated delivery loop ──────────────────────────────────── */}
      {/* A vertical spine with an explicit gate on every step. The gates
          are the differentiator — most agency "process" sections promise
          phases; this one promises something has to be true to move on. */}
      <section
        id="how-we-build"
        className="relative overflow-hidden border-y border-gray-100 bg-gray-50 px-4 py-16 dark:border-gray-800/60 dark:bg-white/[0.015] sm:px-6 sm:py-20"
      >
        <div className="bg-circuit absolute inset-0 text-gray-400 opacity-[0.07] dark:text-gray-700 dark:opacity-[0.12]" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              How we build
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Nothing ships on a hunch
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Four stages, each with a gate that has to be cleared before we
              move on. It&rsquo;s slower to promise and far faster to finish.
            </p>
          </Reveal>

          <ol className="relative">
            {/* The spine. Hidden on mobile, where the steps stack plainly. */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[22px] top-6 hidden w-px bg-gradient-to-b from-blue-600 via-sky-500 to-cyan-400 opacity-40 sm:block"
            />
            {LOOP.map((step, i) => (
              <Reveal key={step.n} style={{ animationDelay: `${i * 80}ms` }}>
                <li className="relative flex gap-5 pb-8 last:pb-0">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 font-mono text-[14px] font-bold text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.45)] ring-4 ring-gray-50 dark:ring-[#060a14]">
                    {step.n}
                  </span>
                  <div className="min-w-0 pt-1.5">
                    <h3 className="text-xl font-semibold sm:text-2xl">{step.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">{step.desc}</p>
                    <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50/60 px-3 py-2 text-[13.5px] font-medium text-blue-700 dark:border-blue-500/15 dark:from-blue-500/[0.08] dark:to-cyan-400/[0.04] dark:text-cyan-400">
                      <LineChart aria-hidden className="h-4 w-4 shrink-0" />
                      {step.gate}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Engagement models ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <GridBackdrop className="opacity-[0.06] dark:opacity-[0.1]" />
          <div className="animate-drift absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-[0.12] blur-[110px] dark:opacity-[0.18] bg-[radial-gradient(circle,_#0ea5e9_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              Ways to work with us
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Start where it makes sense</h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Four entry points, from a two-week audit to engineers embedded in
              your team. You can change shape later.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ENGAGEMENTS.map((e, i) => (
              <Reveal key={e.name} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] dark:border-gray-700/50 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                  <div className="flex-1 p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-500/10">
                      <e.icon aria-hidden className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mb-1.5 text-[19px] font-semibold">{e.name}</h3>
                    <p className="mb-2.5 font-mono text-[12.5px] text-blue-600 dark:text-cyan-400">{e.meta}</p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{e.desc}</p>
                  </div>
                  {/* "Best for" sits on a tinted plate that bleeds to the
                      card edges, so it reads as a spec line rather than
                      another sentence of body copy. */}
                  <div className="border-t border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50/60 px-6 py-4 dark:border-blue-500/15 dark:from-blue-500/[0.08] dark:to-cyan-400/[0.04]">
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

      {/* ── Model-agnostic stack ──────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-gray-100 bg-gray-50 px-4 py-16 dark:border-gray-800/60 dark:bg-white/[0.015] sm:px-6 sm:py-20">
        <div className="bg-circuit absolute inset-0 text-gray-400 opacity-[0.08] dark:text-gray-700 dark:opacity-[0.12]" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              Model-agnostic by design
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              We pick the model that wins on your data
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Not the one we have a deal with. And we build so it can be
              swapped next year without a rewrite.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((group, i) => (
              <Reveal key={group.label} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="group h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-[0_10px_28px_rgba(37,99,235,0.12)] dark:border-gray-700/50 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                  <p className="mb-4 text-[12.5px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    {group.label}
                  </p>
                  <div className="mb-4 flex flex-wrap items-center gap-2.5">
                    {group.logos.map((tool) => (
                      <div
                        key={tool.name}
                        title={tool.name}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-transform duration-300 group-hover:scale-105 dark:border-gray-700/50 dark:bg-white/[0.05]"
                      >
                        <Image
                          src={tool.src}
                          alt={tool.name}
                          width={20}
                          height={20}
                          className={`h-5 w-5 object-contain ${"darkInvert" in tool ? "dark:invert" : ""}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.also.map((name) => (
                      <span
                        key={name}
                        className="rounded-md bg-gray-100 px-2 py-1 text-[12.5px] font-medium text-gray-600 dark:bg-white/[0.06] dark:text-gray-400"
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

      {/* ── Creva spotlight ───────────────────────────────────────────── */}
      {/* The page's proof asset: a shipped AI system with real numbers. */}
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <GridBackdrop className="opacity-[0.06] dark:opacity-[0.1]" />
          <div className="animate-drift absolute -top-20 right-0 h-[440px] w-[440px] rounded-full opacity-[0.12] blur-[110px] dark:opacity-[0.18] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mb-12">
            <p className="mb-3 font-mono text-[12.5px] uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              Shipped, not theoretical
            </p>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="mb-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  We cut a hiring cycle in half for{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                    Creva.ai
                  </span>
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  Voice interviews, resume screening and candidate ranking,
                  running autonomously — so recruiters only spend time on the
                  shortlist that matters.
                </p>
              </div>
              <Link
                href="/creva"
                data-analytics-event="case_study_click"
                data-analytics-category="case_study"
                data-analytics-label="Creva.ai spotlight"
                className="marketing-cta marketing-cta-secondary shrink-0"
              >
                Read the case study
                <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Reveal className="h-full">
              <div className="flex h-full flex-col gap-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "70%", label: "Faster screening" },
                    { value: "2×", label: "Time-to-hire speed" },
                    { value: "78%", label: "Candidate satisfaction" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700/50 dark:bg-white/[0.03]"
                    >
                      <div className="mb-1 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text font-mono text-3xl font-bold text-transparent">
                        {m.value}
                      </div>
                      <div className="text-[12.5px] font-medium leading-snug text-gray-600 dark:text-gray-400">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
                {/* The deliverables are the proof, so this card is the one
                    that stands out: brand-tinted plate, gradient top edge,
                    and check marks instead of neutral bullets. */}
                <div className="relative flex-1 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50/70 p-6 shadow-[0_14px_36px_-10px_rgba(37,99,235,0.3)] dark:border-blue-500/30 dark:from-blue-500/[0.1] dark:via-white/[0.02] dark:to-cyan-400/[0.06] sm:p-7">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400"
                  />
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-[0_8px_20px_-4px_rgba(37,99,235,0.45)]">
                      <PackageCheck aria-hidden className="h-5 w-5 text-white" />
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">What we delivered</h3>
                  </div>
                  <ul className="space-y-3.5">
                    {[
                      "AI voice interview agent with real-time scoring",
                      "Resume parser and job-description match engine",
                      "Automated candidate ranking dashboard",
                      "ATS integration for a clean pipeline handoff",
                      "Recruiter analytics: bottleneck detection and insights",
                    ].map((d) => (
                      <li key={d} className="flex items-start gap-3 text-[15px] font-medium text-gray-800 dark:text-gray-200">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-cyan-400" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal className="h-full" style={{ animationDelay: "90ms" }}>
              <div className="flex h-full flex-col gap-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-white/[0.03]">
                  <h3 className="mb-4 text-[12.5px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    AI stack used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["OpenAI GPT-4o", "ElevenLabs voice", "Deepgram STT", "AWS Bedrock Nova", "LangChain", "LangGraph"].map(
                      (tool) => (
                        <span
                          key={tool}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12.5px] font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/[0.08] dark:text-cyan-400"
                        >
                          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 dark:bg-cyan-400" />
                          {tool}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Pipeline readout, styled as the dark console from the
                    hero so the two "system" graphics read as one family. */}
                <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 font-mono shadow-sm dark:border-gray-700/60 dark:bg-[#0a1120]">
                  <div className="mb-4 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="ml-2 text-[11.5px] text-gray-400 dark:text-gray-500">creva-pipeline</span>
                  </div>
                  <div className="space-y-2 text-[12.5px]">
                    {[
                      ["resume_parser", "matched", "94% · JD: Senior ML Engineer"],
                      ["voice_interview", "completed", "12m 34s · score 87/100"],
                      ["ranking_model", "ranked", "#3 of 247 candidates"],
                      ["ats_handoff", "pushed", "Greenhouse · stage: Technical"],
                    ].map(([name, state, detail]) => (
                      <div key={name} className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span className="text-gray-800 dark:text-gray-200">{name}</span>
                        <span className="text-cyan-600 dark:text-cyan-400">{state}</span>
                        <span className="text-gray-500 dark:text-gray-400">{detail}</span>
                      </div>
                    ))}
                    <div className="mt-3 border-t border-gray-200 pt-3 text-[12.5px] dark:border-white/[0.08]">
                      <span className="text-gray-500 dark:text-gray-400">Pipeline processed </span>
                      <span className="font-semibold text-gray-900 dark:text-white">247 candidates</span>
                      <span className="text-gray-500 dark:text-gray-400"> in </span>
                      <span className="font-semibold text-blue-600 dark:text-cyan-400">4.2 hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust & compliance ────────────────────────────────────────── */}
      {/* For regulated buyers this is usually the section that decides
          whether the conversation happens at all. Every line here is one
          the business can actually back. */}
      <section className="relative overflow-hidden border-y border-gray-100 px-4 py-16 dark:border-gray-800/60 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-blueprint animate-blueprint-pan absolute inset-0 text-blue-600/70 dark:text-cyan-400/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white dark:from-[#060a14] dark:via-[#060a14]/70 dark:to-[#060a14]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[14.5px] font-medium text-blue-600 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400">
              <ShieldCheck aria-hidden className="h-4 w-4" />
              Governance, security &amp; compliance
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              AI that meets your governance, security and compliance standards
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              When your work involves patient records, client files or payment
              details, everyday AI tools often aren&rsquo;t allowed. Here is how we
              protect your data and keep every system accountable.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {TRUST.map((t, i) => (
              <Reveal key={t.title} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="group flex h-full gap-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition hover:border-blue-300 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] dark:border-gray-700/50 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 shadow-[0_8px_20px_-4px_rgba(37,99,235,0.45)] ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 dark:ring-white/10">
                    <t.icon aria-hidden className="h-6 w-6 text-white" strokeWidth={2.25} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-[18px] font-semibold">{t.title}</h3>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Need this documented for your security review?{" "}
              <button
                onClick={() => openForm("ai_services_security")}
                className="inline-flex min-h-11 items-center font-semibold text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 dark:text-cyan-400"
                data-analytics-event="quote_form_open_click"
                data-analytics-category="lead_generation"
                data-analytics-label="AI Security Packet"
              >
                Request our security overview
              </button>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-50 px-4 py-16 dark:bg-white/[0.015] sm:px-6 sm:py-20">
        <div className="bg-circuit absolute inset-0 text-gray-400 opacity-[0.06] dark:text-gray-700 dark:opacity-[0.1]" />
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <h2 className="mb-10 text-center text-4xl font-bold tracking-tight sm:text-5xl">
              Questions buyers actually ask
            </h2>
          </Reveal>
          <Reveal className="space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700/50 dark:bg-white/[0.02]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold">{item.q}</span>
                    <ChevronDown
                      aria-hidden
                      className={`h-4 w-4 shrink-0 text-blue-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* Animating a grid row from 0fr to 1fr gives a smooth
                      height transition without measuring the content. */}
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────── */}
      <section id="ai-contact" className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/glow.svg"
            alt=""
            width={1023}
            height={1092}
            className="absolute w-[700px] max-w-none opacity-[0.12] dark:opacity-[0.2]"
          />
          <div className="h-[480px] w-[480px] rounded-full opacity-20 blur-[120px] dark:opacity-15 bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
        </div>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Tell us what&rsquo;s costing you the most.
          </h2>
          <p className="mb-8 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            We&rsquo;ll tell you honestly whether AI is the right answer, what it
            would take, and what it would be worth. In plain language, no
            jargon.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => openForm("ai_services_cta")}
              className="marketing-cta w-full sm:w-auto"
              data-analytics-event="quote_form_open_click"
              data-analytics-category="lead_generation"
              data-analytics-label="AI CTA Audit"
            >
              Book an AI opportunity audit
              <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
            </button>
            <button
              onClick={() => openCalendly("ai_services_cta")}
              className="marketing-cta marketing-cta-secondary w-full sm:w-auto"
              data-analytics-event="calendly_open_click"
              data-analytics-category="lead_generation"
              data-analytics-label="AI CTA Discovery Call"
            >
              Book a discovery call
            </button>
          </div>
        </Reveal>
      </section>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
              <span className="font-semibold">Book a discovery call</span>
              <button
                onClick={() => {
                  trackEvent("calendly_close", {
                    category: "lead_generation",
                    source: "ai_services_page",
                  });
                  setShowCalendly(false);
                }}
                data-analytics-event="calendly_close_click"
                data-analytics-category="lead_generation"
                aria-label="Close"
                className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
