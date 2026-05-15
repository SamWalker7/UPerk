"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import GetAQuote from "../get-a-quote/GetAQuote";
import Overlay from "../common/Overlay";
import { trackEvent } from "@/lib/analytics";

// Accept legacy props optionally so existing pages (Blog, CaseStudies) still compile
interface NavbarProps {
  toggleMenu?: () => void;
  isMenuOpen?: boolean;
}

const Navebar: React.FC<NavbarProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/ai-services", label: "AI Services" },
    { href: "/#case-studies", label: "Case Studies" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const base = href.split("#")[0];
    return base !== "/" && pathname.startsWith(base);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-white/90 dark:bg-[#060a14]/90 border-b border-gray-200/60 dark:border-gray-800/40 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0"
              data-analytics-event="nav_logo_click"
              data-analytics-category="navigation"
              data-analytics-label="Universal Perk logo"
            >
              <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="Universal Perk"
              />
              <span className="font-extrabold text-[11px] leading-tight tracking-widest dark:text-white text-gray-900 uppercase">
                Universal
                <br />
                Perk
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-analytics-event="nav_link_click"
                  data-analytics-category="navigation"
                  data-analytics-label={link.label}
                  className={`text-[13.5px] font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => {
                    trackEvent("theme_toggle", {
                      category: "engagement",
                      theme: theme === "dark" ? "light" : "dark",
                    });
                    toggle();
                  }}
                  data-analytics-event="theme_toggle_click"
                  data-analytics-category="engagement"
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Get Started CTA */}
              <button
                onClick={() => {
                  trackEvent("quote_form_open", {
                    category: "lead_generation",
                    source: "navbar_desktop",
                  });
                  setShowForm(true);
                }}
                data-analytics-event="cta_click"
                data-analytics-category="lead_generation"
                data-analytics-label="Navbar Get Started"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
                }}
              >
                Get Started
              </button>

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                onClick={() => {
                  trackEvent("mobile_menu_toggle", {
                    category: "navigation",
                    state: isMenuOpen ? "closed" : "opened",
                  });
                  setIsMenuOpen(!isMenuOpen);
                }}
                data-analytics-event="mobile_menu_toggle_click"
                data-analytics-category="navigation"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800/60 bg-white dark:bg-[#060a14] px-4 pt-3 pb-5 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                data-analytics-event="mobile_nav_link_click"
                data-analytics-category="navigation"
                data-analytics-label={link.label}
                className="block text-[14px] font-medium py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  trackEvent("quote_form_open", {
                    category: "lead_generation",
                    source: "navbar_mobile",
                  });
                  setShowForm(true);
                  setIsMenuOpen(false);
                }}
                data-analytics-event="cta_click"
                data-analytics-category="lead_generation"
                data-analytics-label="Mobile Navbar Get Started"
                className="w-full py-3 text-[14px] font-semibold text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {showForm && (
        <Overlay>
          <GetAQuote handleQuoteClose={() => setShowForm(false)} />
        </Overlay>
      )}
    </>
  );
};

export default Navebar;
