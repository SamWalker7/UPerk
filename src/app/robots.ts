import type { MetadataRoute } from "next";

// Same domain constant as the root layout — kept independent (rather than
// importing from layout.tsx) since robots.ts must stay a small, dependency-
// free file the Next.js build can execute in isolation.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.universalperk.com";

// Paths with nothing for a search or GenAI crawler to index: the client
// portal, the internal console, and API routes. Everything else on the
// marketing site is meant to be found.
const DISALLOWED = ["/portal", "/console", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // A blanket allow covers conventional search bots (Googlebot,
      // Bingbot, ...) and general-purpose GenAI crawlers alike — there is
      // no separate "AI crawler" opt-in standard, they read robots.txt the
      // same way search bots do. Named explicitly anyway so an intentional
      // future exclusion (e.g. blocking a scraper that ignores `*`) is a
      // one-line change instead of a policy rewrite.
      { userAgent: "*", allow: "/", disallow: DISALLOWED },
      { userAgent: "GPTBot", allow: "/", disallow: DISALLOWED }, // OpenAI (ChatGPT training/browsing)
      { userAgent: "ChatGPT-User", allow: "/", disallow: DISALLOWED }, // ChatGPT live browsing
      { userAgent: "OAI-SearchBot", allow: "/", disallow: DISALLOWED }, // ChatGPT search
      { userAgent: "ClaudeBot", allow: "/", disallow: DISALLOWED }, // Anthropic (Claude training/browsing)
      { userAgent: "Claude-Web", allow: "/", disallow: DISALLOWED }, // Claude live browsing
      { userAgent: "anthropic-ai", allow: "/", disallow: DISALLOWED },
      { userAgent: "PerplexityBot", allow: "/", disallow: DISALLOWED },
      { userAgent: "Google-Extended", allow: "/", disallow: DISALLOWED }, // Gemini / Google AI features
      { userAgent: "Applebot-Extended", allow: "/", disallow: DISALLOWED }, // Apple Intelligence
      { userAgent: "Amazonbot", allow: "/", disallow: DISALLOWED }, // Alexa+/Amazon AI
      { userAgent: "meta-externalagent", allow: "/", disallow: DISALLOWED }, // Meta AI
      { userAgent: "CCBot", allow: "/", disallow: DISALLOWED }, // Common Crawl — feeds most open LLM training sets
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
