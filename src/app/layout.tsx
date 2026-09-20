import type { Metadata } from "next";
import { Inter, Space_Grotesk, Manrope } from "next/font/google";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

import "./globals.css";

// Site-wide body font. Also exposed as --font-inter for the client portal
// (/portal) and PM console, which pick it up via --p-font in portal.css.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

// Falls back to the production domain if NEXT_PUBLIC_SITE_URL isn't set —
// confirm this is the live domain and set the env var if it changes.
// Everything below (canonical URLs, Open Graph, sitemap, robots.txt) is
// built from this one constant.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.universalperk.com";
const SITE_NAME = "Universal Perk";
const SITE_DESCRIPTION =
  "Universal Perk helps US businesses move faster, cut costs, and compete smarter with a single trusted partner for web, mobile, cloud, DevOps, and AI — without the overhead of building it all in-house.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Web, Mobile, Cloud & AI Development`,
    // Per-page <title> exports (e.g. "AI Services") render as "AI Services
    // | Universal Perk" instead of repeating the full default title.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and friends read
  // these same tags — there's no separate "AI meta tag" standard yet, so
  // solid conventional SEO (title, description, OG, canonical, structured
  // data below) is also the whole AEO playbook for on-page signals.
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Web, Mobile, Cloud & AI Development`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/icons/logo.svg", width: 512, height: 512, alt: `${SITE_NAME} logo` }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Web, Mobile, Cloud & AI Development`,
    description: SITE_DESCRIPTION,
  },
  alternates: { canonical: "/" },
};

// Organization + WebSite JSON-LD, present on every page via the root
// layout. This is the baseline structured data an answer engine (or a
// GenAI browsing tool) uses to resolve "who is this" and "is this a real
// company" — name, logo, contact point, and same-as links to verify it's
// the same entity elsewhere. Kept deliberately factual: no claims here
// that aren't already made plainly elsewhere on the site (see AGENTS.md /
// the compliance-copy rules — never assert a certification we don't have).
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icons/logo.svg`,
  description: SITE_DESCRIPTION,
  email: "contact@universalperk.com",
  address: { "@type": "PostalAddress", addressRegion: "VA", addressCountry: "US" },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} ${spaceGrotesk.variable} ${manrope.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <ThemeProvider>
          <ToastContainer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
