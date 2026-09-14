import type { MetadataRoute } from "next";
import { JOBS } from "@/lib/jobs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.universalperk.com";

// Every public marketing route. /landing and /case-studies are included
// even though they're secondary (a redirect and the pre-redesign page,
// respectively) — Next's redirect resolves them for a crawler anyway, and
// omitting a live, reachable URL from the sitemap doesn't hide it, it just
// stops this file from being the authoritative list.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ai-services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/voice-ai`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/dasguzo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/wmtfa`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/creva`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/careers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
  ];

  // One entry per open role so a job posting can be found and cited
  // directly (a specific /careers?job=<id> link), not just the listing page.
  const jobRoutes: MetadataRoute.Sitemap = JOBS.map((job) => ({
    url: `${SITE_URL}/careers?job=${job.id}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...jobRoutes];
}
