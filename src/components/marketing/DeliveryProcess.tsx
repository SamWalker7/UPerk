"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Layers, Code2, Rocket, Pause, Play } from "lucide-react";

const STEPS = [
  { icon: Compass, title: "Discovery", desc: "We learn about your business, your customers, and what you want to achieve.", result: "Your priorities, clearly defined" },
  { icon: Layers, title: "Architect & Plan", desc: "We map out the experience, the right solution, and what it will take to build it.", result: "An agreed scope and roadmap" },
  { icon: Code2, title: "Build & QA", desc: "We design, build, and test in short cycles. You see working progress and give feedback.", result: "Working software you can review" },
  { icon: Rocket, title: "Launch & Support", desc: "We launch it, help your team get started, and stay on to fix issues and help it grow.", result: "A supported launch and handover" },
];

export default function DeliveryProcess() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [paused, setPaused] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Only advance while the process is on screen and motion is welcome.
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(preference.matches);
    syncMotion();
    preference.addEventListener("change", syncMotion);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion || paused) return;
    const timer = window.setInterval(() => setActiveStep((step) => (step + 1) % STEPS.length), 2800);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion, paused]);

  return (
    <section ref={ref} id="process" className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">How we work together</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">Four clear stages. You know what happens next and what you get at every step.</p>
          </div>
          {!reducedMotion && (
            <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play process animation" : "Pause process animation"} title={paused ? "Play process animation" : "Pause process animation"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/10">
              {paused ? <Play aria-hidden className="h-4 w-4" /> : <Pause aria-hidden className="h-4 w-4" />}
            </button>
          )}
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-14">
          {/* Labels stay in the adjacent list; only the progress marker orbits. */}
          <div className="relative mx-auto aspect-square w-full max-w-[320px]">
            <div aria-hidden className="absolute inset-6 rounded-full border border-gray-200 dark:border-white/15" />
            <div aria-hidden className="absolute inset-12 rounded-full border border-dashed border-gray-300 dark:border-gray-700" />
            <div aria-hidden className="process-orbit absolute inset-6 rounded-full" style={{ animationPlayState: visible && !paused && !reducedMotion ? "running" : "paused" }}>
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-cyan-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
              <div className="max-w-[160px] px-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your project</p>
                <p className="mt-2 text-xl font-semibold leading-tight">{STEPS[activeStep].title}</p>
                <p className="mt-3 font-mono text-xs text-blue-600 dark:text-cyan-400">0{activeStep + 1} / 04</p>
              </div>
            </div>
            {STEPS.map((step, index) => (
              <button key={step.title} type="button" onClick={() => setActiveStep(index)} aria-label={`View ${step.title} stage`} aria-pressed={activeStep === index} title={step.title}
                className={`absolute flex h-12 w-12 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${["top-0 left-1/2 -translate-x-1/2", "right-0 top-1/2 -translate-y-1/2", "bottom-0 left-1/2 -translate-x-1/2", "left-0 top-1/2 -translate-y-1/2"][index]} ${activeStep === index ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600 dark:border-gray-700 dark:bg-[#0d1220] dark:text-gray-300"}`}>
                <step.icon aria-hidden className="h-5 w-5" />
              </button>
            ))}
          </div>
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <li key={step.title} data-active={index === activeStep} className="relative border-t-2 border-gray-200 pt-5 dark:border-white/15">
              <span aria-hidden className={`absolute -top-0.5 left-0 h-0.5 w-full origin-left bg-blue-600 transition-transform duration-700 motion-reduce:transition-none dark:bg-cyan-400 ${index === activeStep ? "scale-x-100" : "scale-x-0"}`} />
              <div className="mb-4 flex items-center justify-between">
                <step.icon aria-hidden className={`h-6 w-6 transition-colors duration-500 motion-reduce:transition-none ${index === activeStep ? "text-blue-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"}`} />
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-400">{step.desc}</p>
              <p className="mt-4 text-base font-medium text-blue-700 dark:text-cyan-400">{step.result}</p>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
