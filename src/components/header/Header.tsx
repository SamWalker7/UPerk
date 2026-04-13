"use client";

import React, { useState } from "react";
import CalendlyEmbed from "./CalendlyEmbed";
import GetAQuote from "../get-a-quote/GetAQuote";
import Overlay from "../common/Overlay";

const Header = () => {
  const [showCalendly, setShowCalendly] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 right-0 w-[700px] h-[700px] rounded-full opacity-25 dark:opacity-15 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #2563EB 0%, #34E5FF 60%, transparent 100%)",
            }}
          />
          <div
            className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full opacity-15 dark:opacity-10 blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, #2563EB 0%, #0ea5e9 60%, transparent 100%)",
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[13px] font-medium mb-8 select-none">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            Web · Mobile · Cloud · DevOps · AI
          </div>

          {/* Headline — problem-first */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.08]">
            Your tech stack is{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #2563EB, #2FBAF8, #34E5FF)",
              }}
            >
              holding you back.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Universal Perk modernizes legacy software, APIs, and infrastructure
            for enterprise teams — with web, mobile, cloud, DevOps, and AI
            handled by one partner, end to end.
          </p>

          {/* Single primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setShowCalendly(!showCalendly)}
              className="px-9 py-4 text-white font-semibold rounded-xl cursor-pointer text-[15px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:opacity-95 transition-all"
              style={{
                background:
                  "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
              }}
            >
              → Book a Discovery Call
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-9 py-4 font-semibold rounded-xl cursor-pointer text-[15px] border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
            >
              Get a Free Quote
            </button>
          </div>

          {/* Social proof numbers */}
          <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-800/60 border border-gray-200 dark:border-gray-800/60 rounded-2xl max-w-xl mx-auto bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm shadow-sm">
            {[
              { value: "300%", label: "Avg. performance improvement" },
              { value: "90-Day", label: "MVP delivery" },
              { value: "50+", label: "Projects shipped" },
            ].map((stat) => (
              <div key={stat.label} className="py-5 px-4">
                <div
                  className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #2563EB, #34E5FF)",
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

      {showForm && (
        <Overlay>
          <GetAQuote handleQuoteClose={() => setShowForm(false)} />
        </Overlay>
      )}
    </>
  );
};

export default Header;
