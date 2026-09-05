"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECT_TABS, type ProjectTab } from "@/lib/portal/types";
import { cn } from "@/lib/utils";

const LABELS: Record<ProjectTab, string> = {
  overview: "Overview",
  requests: "Waiting on you",
  prototype: "See it working",
  timeline: "Timeline",
  decisions: "Decisions",
};

// Height of the sticky bars above the section content (top bar + this nav),
// used both to offset the scroll target and to bias which section counts as
// "current" while scrolling.
const SCROLL_OFFSET = 116;

export function TabNav({ openRequests }: { openRequests: number }) {
  const [active, setActive] = useState<ProjectTab>("overview");
  const clickedRef = useRef<ProjectTab | null>(null);

  useEffect(() => {
    const sections = PROJECT_TABS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (sections.length === 0) return;

    function onScroll() {
      // A click already knows which tab it's headed to — trust it until the
      // page settles there, so the fast-scroll animation doesn't flicker
      // through intermediate sections.
      if (clickedRef.current) {
        const target = document.getElementById(clickedRef.current);
        if (target) {
          const dist = Math.abs(target.getBoundingClientRect().top - SCROLL_OFFSET);
          if (dist < 4) clickedRef.current = null;
          else return;
        }
      }

      const line = SCROLL_OFFSET + 8;
      let current: ProjectTab = sections[0].id as ProjectTab;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) {
          current = el.id as ProjectTab;
        }
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function handleClick(tab: ProjectTab, e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById(tab);
    if (!el) return;
    clickedRef.current = tab;
    setActive(tab);
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${tab}`);
  }

  return (
    <div className="sticky top-14 z-30 mt-6 border-b border-t border-[var(--p-border)] bg-[var(--p-bg)]/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-4">
        {PROJECT_TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <a
              key={tab}
              href={`#${tab}`}
              onClick={(e) => handleClick(tab, e)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex cursor-pointer items-center whitespace-nowrap px-3 py-3 text-[13px] transition-colors",
                isActive
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
              {isActive ? (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--p-accent)] transition-all" />
              ) : null}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
