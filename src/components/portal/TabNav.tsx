"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { PROJECT_TABS } from "@/lib/portal/types";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const LABELS: Record<string, string> = {
  overview: "Overview",
  requests: "Waiting on you",
  prototype: "See it working",
  timeline: "Timeline",
  decisions: "Decisions",
};

function TabPending() {
  const { pending } = useLinkStatus();
  return pending ? <Spinner className="ml-1.5 h-3.5 w-3.5" /> : null;
}

export function TabNav({
  slug,
  openRequests,
}: {
  slug: string;
  openRequests: number;
}) {
  const pathname = usePathname();
  const base = `/portal/${slug}`;

  return (
    <div className="sticky top-14 z-30 border-b border-[var(--p-border)] bg-[var(--p-bg)]/90 backdrop-blur">
      <nav
        className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {PROJECT_TABS.map((tab) => {
          const href = tab === "overview" ? base : `${base}/${tab}`;
          const active =
            tab === "overview"
              ? pathname === base || pathname === `${base}/overview`
              : pathname === href;
          return (
            <Link
              key={tab}
              href={href}
              prefetch
              className={cn(
                "relative flex items-center whitespace-nowrap px-3 py-3 text-[13px] transition-colors",
                "cursor-pointer",
                active
                  ? "font-semibold text-[var(--p-text)]"
                  : "text-[var(--p-text-dim)] hover:text-[var(--p-text)]",
              )}
            >
              {LABELS[tab]}
              {tab === "requests" && openRequests > 0 ? (
                <span className="ml-1.5 rounded-full bg-[var(--p-warn-bg)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--p-warn)]">
                  {openRequests}
                </span>
              ) : null}
              <TabPending />
              {active ? (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--p-accent)]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
