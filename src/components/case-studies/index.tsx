"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navebar from "../header/Navebar";
import CaseStudyBanner from "./CaseStudyBanner";
import ImplementationApproach from "./ImplementationApproach";
import PainPointsDiscovered from "./PainPointsDiscovered";
import RequirementForSuccess from "./RequirementForSuccess";
import TechStackSection from "./TechStackSection";
import Banner from "./Banner";
import Accomplishments from "./Accomplishments";
import { Footer } from "../footer/Fotter";

const CaseStudies = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Navebar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="max-w-7xl sm:px-10 px-4 mx-auto mt-[50px]">
        <CaseStudyBanner />
        <ImplementationApproach />
      </div>
      <PainPointsDiscovered />
      <RequirementForSuccess />
      <TechStackSection />
      <Banner />
      <Accomplishments />

      {/* ─── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-4">
            Let&apos;s Talk
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272A2D] dark:text-white mb-4 tracking-tight">
            Have a similar challenge?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Whether you&apos;re building a marketplace, a mobile product, or
            need an end-to-end team to take you from zero to launch — let&apos;s
            talk about what&apos;s possible in 90 days.
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
              className="px-8 py-4 font-semibold rounded-xl text-[15px] border border-gray-200 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all inline-block"
            >
              View all case studies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CaseStudies;
