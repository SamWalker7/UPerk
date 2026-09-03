"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROJECT_TABS } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  overview: "Overview",
  requests: "Waiting on you",
  prototype: "See it working",
  timeline: "Timeline",
  decisions: "Decisions",
};

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
    <div className="sticky top-0 z-30 border-b border-[var(--p-border)] bg-[var(--p-bg)]/85 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4">
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
              className={cn(
                "relative whitespace-nowrap px-3 py-3 text-[13px] transition-colors",
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
              {active ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--p-accent)]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
