"use client";

import { useRef, useState } from "react";
import { PmAnnotation } from "./PmAnnotation";
import { PrototypeEmbed } from "./PrototypeEmbed";
import { Card, SectionTitle } from "./ui";
import { formatDate } from "@/lib/portal/format";
import { toFigmaEmbedUrl } from "@/lib/portal/figma";
import type { BuildInfo, PortalRole, ProjectLink } from "@/lib/portal/types";

const LINK_TYPE_LABEL: Record<ProjectLink["type"], string> = {
  figma: "Figma file",
  playstore: "Play Store build",
  testflight: "TestFlight build",
  other: "Link",
};

/** One item in the horizontally-scrollable link strip: just the title/type
 *  as a label. Clicking it selects that link as the active one, so its
 *  title/description/build-version (with its own "Open" button) surface
 *  below — same for every viewer, nothing is edited. */
function LinkCard({
  link,
  active,
  onSelect,
}: {
  link: ProjectLink;
  active: boolean;
  onSelect: () => void;
}) {
  const label = link.title || LINK_TYPE_LABEL[link.type];
  const cls = active
    ? "bg-[var(--p-accent)] text-white"
    : "border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text)]";
  return (
    <button
      type="button"
      onClick={onSelect}
      title={label}
      className={`shrink-0 snap-start truncate rounded-lg px-4 py-2 text-[13px] font-semibold ${cls}`}
      style={{ maxWidth: 200 }}
    >
      {label}
    </button>
  );
}

/** Horizontally-scrollable row with no visible scrollbar and left/right nav
 *  buttons at the ends — used instead of flex-wrap so an unbounded number of
 *  links stays on one row. */
function ScrollRow({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }

  function scrollBy(dir: -1 | 1) {
    trackRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        aria-label="Scroll left"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-dim)] disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        aria-label="Scroll right"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-dim)] disabled:opacity-30"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/** Colour the "known issues" dot from the free-text value. */
function knownIssuesDot(text: string): "ok" | "warn" | "risk" {
  const t = text.trim().toLowerCase();
  // "none", "no known issues", "0" → clear
  if (!t || /^(none|no known|0\b|nothing)/.test(t) || t === "—") return "ok";
  // issues exist and at least one blocks → risk; otherwise amber
  return /(?<!none |not |no )blocking/.test(t) ? "risk" : "warn";
}

function Fact({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  /** small status dot before the value, e.g. amber for "known issues" */
  dot?: "ok" | "warn" | "risk";
}) {
  const dotColor =
    dot === "warn"
      ? "bg-[var(--p-warn)]"
      : dot === "risk"
        ? "bg-[var(--p-risk)]"
        : "bg-[var(--p-ok)]";
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--p-border)] py-3 text-[13px] last:border-0">
      <span className="text-[var(--p-text-dim)]">{label}</span>
      <span className="flex items-center gap-2 text-right font-medium">
        {dot ? (
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
        ) : null}
        {value}
      </span>
    </div>
  );
}

export function SeeItWorking({
  links,
  build,
  role,
  slug,
}: {
  links: ProjectLink[];
  build: BuildInfo;
  role: PortalRole;
  slug: string;
}) {
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const activeLink = links.find((l) => l.id === activeLinkId) || links[0];

  // Figma links embed in the iframe; anything else (Play Store, TestFlight,
  // other) can't be framed, so it gets a coloured card with an Open button
  // instead of a dead placeholder.
  const embedSrc =
    activeLink?.type === "figma" ? toFigmaEmbedUrl(activeLink.url) : null;

  return (
    <div>
      <SectionTitle title="See it working" />
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Card className="flex items-center justify-center">
          {embedSrc ? (
            <PrototypeEmbed
              src={embedSrc}
              title={activeLink?.title || "Embedded prototype"}
            />
          ) : activeLink ? (
            <div className="flex h-[480px] w-full max-w-[280px] flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--p-accent-weak)] px-6 text-center">
              <p className="text-[14px] font-semibold text-[var(--p-text)]">
                {activeLink.title || LINK_TYPE_LABEL[activeLink.type]}
              </p>
              {activeLink.url?.trim() ? (
                <a
                  href={activeLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                  Open
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                    <path
                      d="M7 17L17 7M17 7H9M17 7V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ) : (
                <span className="cursor-not-allowed rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[13px] font-semibold text-white opacity-40">
                  Open
                </span>
              )}
            </div>
          ) : (
            <div className="flex h-[480px] w-full max-w-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-2)] px-6 text-center text-[12px] text-[var(--p-text-dim)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mb-3 h-8 w-8 text-[var(--p-text-dim)]"
                aria-hidden
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path
                  d="M21 15l-4.5-4.5L7 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Embedded prototype
            </div>
          )}
        </Card>

        <div>
          <p className="text-[14px] leading-relaxed text-[var(--p-text-dim)]">
            This is the clickable prototype, not a picture. Tap through it the way you
            would the real app — it refreshes every time we push work, so what is here is
            what is built.
          </p>
          <div className="mt-4">
            {links.length === 0 ? (
              <span className="inline-block cursor-not-allowed rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[13px] font-semibold text-white opacity-40">
                Open the prototype
              </span>
            ) : (
              <ScrollRow>
                {links.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    active={link === activeLink}
                    onSelect={() => setActiveLinkId(link.id)}
                  />
                ))}
              </ScrollRow>
            )}
          </div>

          {(() => {
            const latestBuild = [build.version, formatDate(build.date)]
              .filter(Boolean)
              .join(" — ");
            const screens = build.screensBuilt || build.screensTotal
              ? `${build.screensBuilt} of ${build.screensTotal}`
              : "";
            const rows = [
              activeLink?.buildVersion
                ? { label: "Build version", value: activeLink.buildVersion }
                : null,
              latestBuild ? { label: "Latest build", value: latestBuild } : null,
              screens ? { label: "Screens in prototype", value: screens } : null,
              build.knownIssues
                ? { label: "Known issues", value: build.knownIssues, dot: knownIssuesDot(build.knownIssues) }
                : null,
              build.testedOn ? { label: "Tested on", value: build.testedOn } : null,
            ].filter((r): r is NonNullable<typeof r> => r !== null);
            const hasHeader = Boolean(activeLink?.title || activeLink?.description);
            const hasOpen = Boolean(activeLink?.url?.trim());
            if (rows.length === 0 && !hasHeader && !hasOpen) return null;
            return (
              <Card className="mt-4 py-2">
                {hasHeader ? (
                  <div
                    className={`py-3 first:pt-0 ${rows.length > 0 || hasOpen ? "border-b border-[var(--p-border)]" : ""}`}
                  >
                    {activeLink?.title ? (
                      <p className="text-[14px] font-bold text-[var(--p-text)]">{activeLink.title}</p>
                    ) : null}
                    {activeLink?.description ? (
                      <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">{activeLink.description}</p>
                    ) : null}
                  </div>
                ) : null}
                {rows.map((row) => (
                  <Fact key={row.label} label={row.label} value={row.value} dot={"dot" in row ? row.dot : undefined} />
                ))}
                {hasOpen ? (
                  <div className="py-3 last:pb-0">
                    <a
                      href={activeLink!.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md bg-[var(--p-accent)] px-2.5 py-1 text-[12px] font-semibold text-white hover:opacity-90"
                    >
                      Open
                      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                        <path
                          d="M7 17L17 7M17 7H9M17 7V15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                ) : null}
              </Card>
            );
          })()}

          {role === "pm" ? (
            <PmAnnotation
              linkLabel="+ Add / replace links"
              href={`/console?p=${slug}`}
            >
              <span className="font-semibold text-[var(--p-text)]">
                — how this area gets filled
              </span>
              <span className="mt-1.5 block">
                Add a Figma prototype or share URL and a TestFlight or Play link;
                the embed and the buttons update together. Give each link its own
                title, description and build version.
              </span>
            </PmAnnotation>
          ) : null}
        </div>
      </div>
    </div>
  );
}
