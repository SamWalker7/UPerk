"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const OBSTACLES = [
  {
    q: "We already looked at an AI answering tool. Compliance said no.",
    a: "That's the problem we built this for. You get a signed Business Associate Agreement and a written data-handling document before you sign anything — not a demo followed by a compliance fight. If your reviewer can't approve it, we haven't done our job.",
  },
  {
    q: "We don't have anyone technical to manage this.",
    a: "You're not meant to. This is a managed service, not software you operate. There's no dashboard you're responsible for keeping alive — we build it, monitor it, and support it.",
  },
  {
    q: "What if it gives a caller the wrong information?",
    a: "It's scoped to scheduling, intake, and FAQs only — it never gives clinical or legal guidance, and it's built to recognize when a call needs a person and hand it off immediately, with no hold time.",
  },
  {
    q: "Will callers know they're talking to an AI, and will they hate it?",
    a: "Callers can ask for a person at any point and get one immediately. Most callers care about getting booked quickly — not about who answered. We test call scripts against your real call patterns before go-live.",
  },
  {
    q: "How does this integrate with our phone system and scheduling software?",
    a: "We confirm integration feasibility during a technical discovery call before any commitment is made — not after you've signed.",
  },
  {
    q: "What happens if something breaks outside business hours?",
    a: "You get a named support contact and a written response-time commitment as part of the agreement — not a ticket queue.",
  },
  {
    q: "We've been burned by a vendor before.",
    a: "Fixed-scope statement of work, a named point of contact, and weekly check-ins during the build. You'll know exactly what's happening and when.",
  },
  {
    q: "Are we locked into your platform?",
    a: "No. You own your call data and configuration, and off-boarding is a documented process — written into the agreement, not a verbal promise.",
  },
];

export default function VoiceAIClient() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (hasGetStartedHash()) {
      trackEvent("quote_form_open", {
        category: "lead_generation",
        source: "voice_ai_hash",
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

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[14.5px] font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400 mb-4">
            Managed AI Voice Infrastructure
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
            Never lose another patient to a missed call.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-9">
            A HIPAA-ready AI voice receptionist that answers every call your
            practice currently misses, books and reschedules appointments,
            and hands off to your staff on request — deployed under a signed
            BAA, by the team that built it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openForm("voice_ai_hero")}
              className="w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[16.5px] font-semibold px-6 py-3 transition"
              data-analytics-event="quote_form_open_click"
            >
              Talk to us about your call volume
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-center rounded-lg border border-gray-200 dark:border-gray-800 text-[16.5px] font-semibold px-6 py-3 hover:border-gray-300 dark:hover:border-gray-700 transition"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 dark:border-gray-800/60 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            "HIPAA-compliant delivery",
            "BAA available",
            "Production AI voice systems",
            "One accountable team",
          ].map((item) => (
            <div key={item} className="text-[14.5px] sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Problem framing */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-center">
            The problem isn&rsquo;t that answering services don&rsquo;t exist.
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed text-center max-w-2xl mx-auto">
            It&rsquo;s that most of them can&rsquo;t touch patient or client data safely.
            The moment an AI agent hears a name, a condition, or a case
            detail, a $99-a-month tool without a BAA becomes a compliance
            problem — which is usually why your last look at &ldquo;AI for the
            front desk&rdquo; ended with legal saying no. This is the version of
            that solution built to actually pass review.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
            How it&rsquo;s delivered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                n: "01",
                title: "Discovery & compliance review",
                desc: "We review your call volume, current tooling, and data-handling requirements before anything is built.",
              },
              {
                n: "02",
                title: "Configuration",
                desc: "The system is trained on your real scripts and call patterns, and scoped to scheduling, intake, and FAQs only.",
              },
              {
                n: "03",
                title: "Phased go-live",
                desc: "Launches on overflow calls only, so you see recovered calls before it ever touches every line.",
              },
              {
                n: "04",
                title: "Managed support",
                desc: "A named contact and response-time commitment cover the system after go-live — not just the launch.",
              },
            ].map((step) => (
              <div key={step.n}>
                <div className="text-[14.5px] font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {step.n}
                </div>
                <h3 className="text-[16.5px] font-semibold mb-2">{step.title}</h3>
                <p className="text-[15.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
            Built on production AI voice work, not a demo.
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Our AI voice interview system for Creva is already live, screening
            and evaluating candidates end-to-end and integrating directly
            into their applicant tracking system.
          </p>
          <Link
            href="/creva"
            className="inline-flex items-center gap-1.5 text-[16.5px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            See the Creva case study →
          </Link>
        </div>
      </section>

      {/* FAQ / objection handling */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
            Questions practices ask before signing
          </h2>
          <div className="space-y-8">
            {OBSTACLES.map((item) => (
              <div key={item.q} className="border-b border-gray-200 dark:border-gray-800/60 pb-8 last:border-0 last:pb-0">
                <h3 className="text-[18px] font-semibold mb-2">{item.q}</h3>
                <p className="text-[15.5px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Start with your call volume, not a demo.
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            A short discovery conversation tells us whether this fits your
            practice — and gives you a compliance packet to bring to your own
            review, whether or not you move forward.
          </p>
          <button
            onClick={() => openForm("voice_ai_closing_cta")}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[16.5px] font-semibold px-8 py-3.5 transition"
            data-analytics-event="quote_form_open_click"
          >
            Talk to us about your call volume
          </button>
        </div>
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
