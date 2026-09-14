"use client";
import GradientButton from "../common/BgGradientButton";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Heading } from "../common/Heading";
import { Paragraph } from "../common/Paragraph";
import { useState } from "react";
import GetAQuote from "../get-a-quote/GetAQuote";
import Overlay from "../common/Overlay";

//steps

const steps = [
  {
    id: 1,
    title: "Discovery & Project Planning",
    description:
      "Our discovery phase includes in-depth analysis of your existing workflows, user needs, and project requirements to ensure a strong foundation.",
  },
  {
    id: 2,
    title: "Process Optimization",
    description:
      "We analyze your business to identify areas where digital solutions can streamline operations and enhance productivity for maximum impact.",
  },
  {
    id: 3,
    title: "Define KPIs & Success Metrics",
    description:
      "We help you establish clear, measurable KPIs and success metrics to track progress and ensure alignment with your business objectives.",
  },
  {
    id: 4,
    title: "Timeline & Milestone Planning",
    description:
      "Our team works collaboratively with yours to map out a comprehensive project timeline with clear milestones and deliverables.",
  },
  {
    id: 5,
    title: "Risk Assessment & Strategy",
    description:
      "We conduct thorough research to identify potential challenges and develop proactive strategies to mitigate risks throughout the project lifecycle.",
  },
];




export default function ProjectPlanningSteps() {
  const isMobile = useMediaQuery("(max-width: 1025px)");
    const [showForm, setShowForm] = useState(false);

    const handleQuoteOpen = () => {
      setShowForm(true);
    };

    const handleQuoteClose = () => {
      setShowForm(false);
    };
  
const line = (
  <svg
    width="6"
    height="89"
    viewBox="0 0 6 89"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.28"
      d="M3 86L3 3"
      stroke="url(#paint0_linear_114_233)"
      strokeWidth="6"
      strokeLinecap="square"
    />
    <defs>
      <linearGradient
        id="paint0_linear_114_233"
        x1="3.5"
        y1="86"
        x2="3.5"
        y2="3"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2563EB" />
        <stop offset="0.25" stopColor="#1FBAFF" stopOpacity="0" />
        <stop offset="0.5" stopColor="#2FBAF8" />
        <stop offset="0.75" stopColor="#1EE2FF" stopOpacity="0" />
        <stop offset="1" stopColor="#34E5FF" />
      </linearGradient>
    </defs>
  </svg>
);

  return (
    <>
      <div className="  text-white  flex flex-col items-center justify-center">
        {isMobile ? (
          // Mobile Layout
          <div className="w-full max-w-md space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="relative p-5 bg-gradient-to-br from-[#F6F6F6] to-[#FAFAFA] dark:bg-gradient-to-br dark:from-[#232323] dark:to-[#292929] rounded-lg min-h-[120px] flex"
              >
                <div className="absolute right-5 top-5 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  {step.id}
                </div>
                <div className="mr-12 space-y-1.5">
                  <Heading
                    level={4}
                    className="text-[#272A2D] dark:text-[#E8E9EA]"
                  >
                    {step.title}
                  </Heading>
                  <Paragraph className=" text-[#272A2D] dark:text-[#E8E9EA]">
                    {step.description}
                  </Paragraph>
                </div>
              </div>
            ))}
            {/* <button className="w-[123px] bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2.5 mt-6 font-medium">
            Start Your 90 Day MVP
          </button> */}
            <div
              className="flex justify-center mt-10"
              onClick={handleQuoteOpen}
            >
              <GradientButton className="rounded-[3px]">
                Start Your 90 Day MVP
              </GradientButton>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="w-full max-w-7xl relative ">
            <div className="grid grid-cols-5 gap-8 relative z-10">
              {steps.map((step, index) => {
                const isOdd = step.id % 2 !== 0;

                return (
                  <div
                    key={step.id}
                    className="relative flex flex-col items-center "
                  >
                    {/* ODD Steps: Card on Top */}
                    {isOdd && (
                      <div className="mb-0 bg-gradient-to-br from-[#F6F6F6] to-[#FAFAFA] dark:bg-gradient-to-br dark:from-[#232323] dark:to-[#292929] p-5  rounded-lg min-h-[200px] w-full text-left">
                        <Heading
                          level={4}
                          className="font-medium  mb-1.5 text-[#272A2D] dark:text-[#E8E9EA]"
                        >

                          {step.title}
                        </Heading>
                        <p className="text-[18px] leading-relaxed text-zinc-400">
                          {step.description}
                        </p>
                      </div>
                    )}

                    {/* Vertical Line + Step Number */}

                    <div className="flex flex-col items-center">
                      {/* Vertical line BEFORE the circle: only for ODD steps */}
                      {isOdd && (
                        <>
                          {/* <div className="w-0.5 h-24 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                          <div>{line}</div>
                          {/* <div className="w-0.5 h-12 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                          {/* <div className="w-0.5 h-6 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                          {/* <div className="w-0.5 h-6 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                        </>
                      )}

                      {/* Step Number */}
                      <div className="w-8 h-8  rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center z-10">
                        {step.id}
                      </div>

                      {/* Vertical line AFTER the circle: only for EVEN steps */}
                      {!isOdd && (
                        <>
                          {/* <div className="w-0.5 h-24 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                          <div>{line}</div>
                          {/* <div className="w-0.5 h-24 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                          {/* <div className="w-0.5 h-6 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                          {/* <div className="w-0.5 h-6 bg-gradient-to-t from-[#2563EB] via-transparent to-[#34E5FF]" /> */}
                        </>
                      )}
                    </div>

                    {/* EVEN Steps: Card on Bottom */}
                    {!isOdd && (
                      <div className="mt-0 bg-gradient-to-br from-[#F6F6F6] to-[#FAFAFA] dark:bg-gradient-to-br dark:from-[#232323] dark:to-[#292929] p-5 rounded-lg min-h-[200px] w-full text-left">
                        <Heading
                          level={4}
                          className="font-medium  mb-1.5 text-[#272A2D] dark:text-[#E8E9EA]"
                        >

                          {step.title}
                        </Heading>
                        <p className="text-[18px] leading-relaxed text-zinc-400">
                          {step.description}
                        </p>
                      </div>
                    )}

                    {/* Horizontal line to next step (not after last step) */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute ${
                          isOdd ? "bottom-4" : "top-0"
                        } right-[-50%] w-full h-0.5  bg-gradient-to-r from-[#2563EB] via-transparent to-[#34E5FF] z-0`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-24">
              <GradientButton
                className="rounded-[3px]"
                onClick={handleQuoteOpen}
              >
                Start Your 90 Day MVP
              </GradientButton>
            </div>
          </div>
        )}
      </div>

      {/* Get a Quote Form */}
      {showForm && (
        <div>
          <Overlay>
            <GetAQuote handleQuoteClose={handleQuoteClose} />
          </Overlay>

        </div>
      )}
    </>
  );
}
