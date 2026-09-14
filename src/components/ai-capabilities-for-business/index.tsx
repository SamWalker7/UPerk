"use client";
import React from "react";
import Banner from "./Banner"; // Assuming Banner component is already built
import Image from "next/image";
import { Paragraph } from "../common/Paragraph";
import { Heading } from "../common/Heading";

// Card Component using Tailwind CSS
interface CardProps {
  title: string;
  subtitle: string;
  description: string;
  iconUrlLight: string; // Icon for light mode
  iconUrlDark: string; // Icon for dark mode
}

const Card = ({
  title,
  subtitle,
  description,
  iconUrlLight,
  iconUrlDark,
}: CardProps) => {
  return (
    <div className="dark:bg-[#1e1e1e] bg-white text-white rounded-xl py-6 px-[13px] w-[280px] h-[250px] shadow-lg flex-shrink-0">
      <div className="flex items-center mb-4">
        {(iconUrlLight || iconUrlDark) && (
          <div className="">
            <Image
              src={iconUrlLight}
              alt="icon"
              className="mr-2 mb-3 dark:hidden" // Show in light mode
              width={20}
              height={20}
            />
            <Image
              src={iconUrlDark}
              alt="icon"
              className="mr-2 mb-3 hidden dark:block" // Show in dark mode
              width={20}
              height={20}
            />
          </div>
        )}
        <div>
          <Heading
            level={5}
            className="dark:text-white text-[#272A2D] font-semibold "
          >
            {title}
          </Heading>
          <Paragraph className="text-[#272A2D] dark:text-[#A5A5A5] text-[15.5px]">
            {subtitle}
          </Paragraph>
        </div>
      </div>
      <Paragraph className="text-[#272A2D] dark:text-[#A5A5A5] text-[18px] mb-4">
        {description}
      </Paragraph>
      <a
        href="#"
        className="dark:text-[#2563EB] text-[#2563EB]  text-sm underline font-medium hover:underline"
      >
        Get Started
      </a>
    </div>
  );
};

// Main Page Component
export default function AICapabilitiesForBusiness() {
  const cards = [
    {
      title: "Lead Generation & Sales AI",
      subtitle: "AI Chatbots & Voice Assistants",
      description:
        "Maximize your sales potential with AI-driven lead generation and automated sales processes.",
      iconUrlLight: "/icons/service/light/leade-generation-light.svg",
      iconUrlDark: "/icons/service/leade-generation.svg",
    },
    {
      title: "Customer Support AI",
      subtitle: "Intelligent Chat & Voice Agents",
      description:
        "Enhance customer satisfaction with 24/7 AI-powered support and faster response times.",
      iconUrlLight: "/icons/service/light/customer-support-light.svg",
      iconUrlDark: "/icons/service/customer-support.svg",
    },
    {
      title: "AI Recruiting Assistant",
      subtitle: "Candidate Sourcing & Screening",
      description:
        "Streamline hiring with AI that sources, screens, and ranks candidates efficiently.",
      iconUrlLight: "/icons/service/light/Recruiting-assistant-light.svg",
      iconUrlDark: "/icons/service/Recruiting-assistant.svg",
    },
    {
      title: "Virtual Assistant",
      subtitle: "Appointment Scheduling & Reminders",
      description:
        "Boost productivity with an AI assistant that manages tasks, schedules, and more.",
      iconUrlLight: "/icons/service/light/vertual-assistant-light.svg",
      iconUrlDark: "/icons/service/vertual-assistant.svg",
    },
    {
      title: "Mobile App Development",
      subtitle: "AI-Driven App Development",
      description:
        "Create intuitive mobile apps with AI-powered development and seamless user experiences.",
      iconUrlLight: "/icons/service/light/mobile-app-light.svg",
      iconUrlDark: "/icons/service/mobile-app.svg",
    },
    {
      title: "Web Development",
      subtitle: "Responsive Web Solutions",
      description:
        "Build stunning, responsive websites with AI-driven design and development.",
      iconUrlLight: "/icons/service/light/web-app-light.svg",
      iconUrlDark: "/icons/service/web-app.svg",
    },
    {
      title: "Cloud Services & Integration",
      subtitle: "Scalable Cloud Solutions",
      description:
        "Optimize your business with secure, scalable cloud solutions and seamless integrations.",
      iconUrlLight: "/icons/service/light/cloud-solution-light.svg",
      iconUrlDark: "/icons/service/cloud-solution.svg",
    },
  ];

  return (
    <div className="relative xl:h-[960px] mt-50 h-[700px]">
      {/* Inclined Background with Reduced Skew */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transform -skew-y-6 origin-top-left z-0 top-0"></div>

      {/* Content Container */}
      <div className="relative z-10 pt-1 pb-24 px-8">
        {/* Banner Component */}
        <div className="text-center mb-16">
          <Banner
            heading="Our Comprehensive AI Capabilities For Business Growth"
            paragraph="Leverage our AI-driven tools to enhance efficiency, boost sales, and streamline customer support, empowering your business to thrive."
          />
        </div>

        {/* Cards Grid */}
        <div className="mx-auto flex justify-center xl:flex-wrap gap-12 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 xl:overflow-x-hidden">
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              subtitle={card.subtitle}
              description={card.description}
              iconUrlLight={card.iconUrlLight}
              iconUrlDark={card.iconUrlDark}
            />
          ))}
        </div>
      </div>

      {/* Custom CSS to ensure cards maintain size */}
      <style jsx>{`
        .flex > .flex-shrink-0 {
          min-width: 236px;
        }
        @media (max-width: 1279px) {
          .flex {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
