import type { Metadata } from "next";
import HomeClient from "./HomeClient";

// The homepage's actual content lives in HomeClient.tsx ("use client" —
// it needs interactivity: the tab toggle, reveal animations, the quote
// form). A Server Component can't export `metadata` from a "use client"
// file, so this thin wrapper holds the metadata and renders the client
// component as its child — the same split used for every other marketing
// page that needs both per-page SEO tags and client-side interactivity.
export const metadata: Metadata = {
  // A literal full title, not just "Web, Mobile, Cloud & AI Development" —
  // Next.js doesn't apply a layout's title template to a page.tsx in that
  // exact same route segment, only to nested segments (so this same
  // pattern works fine on /wmtfa, /careers, etc., but not on the root "/").
  title: "Web, Mobile, Cloud & AI Development | Universal Perk",
  description:
    "One team builds your website, app, and AI tools — web, mobile, cloud migration, and AI solutions, with a compliance-ready delivery for businesses handling sensitive data.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeClient />;
}
