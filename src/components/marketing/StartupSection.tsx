"use client";

import { ArrowRight, Compass, PanelsTopLeft, Rocket } from "lucide-react";

const DELIVERABLES = [
  {
    icon: Compass,
    title: "A clear first step",
    desc: "Focus on the problem your customers need solved. Leave discovery with an agreed scope, priorities, and a launch plan.",
    outcome: "Your roadmap",
  },
  {
    icon: PanelsTopLeft,
    title: "An idea you can put to work",
    desc: "See your product take shape through working demos. Test the experience with us and give feedback as we build.",
    outcome: "Your first working release",
  },
  {
    icon: Rocket,
    title: "Ready for your first customers",
    desc: "Launch with tested software, a clear handover, and ownership of your code and accounts. Learn what to build next.",
    outcome: "Your launch and next steps",
  },
];

export default function StartupSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="startups" className="scroll-mt-20 border-y border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-cyan-400">
          <Rocket aria-hidden className="h-4 w-4" /> For startups & founders
        </p>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight tracking-normal text-gray-900 sm:text-4xl dark:text-white">
              From idea to MVP in 4-6 weeks.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Bring your idea to life and get it into your first customers&rsquo; hands.
              We help you choose the essential features, design the experience, and
              build a first release you can learn from.
            </p>
          </div>
          <button onClick={onGetStarted} className="marketing-cta w-full shrink-0 sm:w-auto">
            Plan your MVP <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
          </button>
        </div>
        {/* Show the tangible deliverables without repeating the process timeline. */}
        <ul className="mt-9 grid gap-7 md:grid-cols-3 md:gap-8">
          {DELIVERABLES.map((item, index) => (
            <li key={item.title} className="flex flex-col border-t border-gray-300 pt-5 dark:border-white/15">
              <div className="mb-4 flex items-center justify-between">
                <item.icon aria-hidden className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">0{index + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 mb-4 flex-1 text-base leading-relaxed text-gray-600 dark:text-gray-400">{item.desc}</p>
              <p className="text-sm font-medium text-blue-700 dark:text-cyan-400">{item.outcome}</p>
            </li>
          ))}
        </ul>
        <p className="mt-7 text-base leading-relaxed text-gray-600 dark:text-gray-400">
          The 4-6 week timeline is for a focused first release. We confirm scope, integrations, and timing together during discovery.
        </p>
      </div>
    </section>
  );
}
