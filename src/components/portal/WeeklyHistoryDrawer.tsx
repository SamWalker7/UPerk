"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { WeeklyUpdate } from "@/lib/portal/types";

const EMPTY_UPDATES: WeeklyUpdate[] = [];

const DAY_FMT = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

function dateLabel(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "Earlier updates" : DAY_FMT.format(d);
}
function timeLabel(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : TIME_FMT.format(d);
}

export function WeeklyHistoryDrawer({
  updates,
  className,
}: {
  updates?: WeeklyUpdate[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // Drives the CSS enter transition: mount off-screen, then flip on next frame.
  const [shown, setShown] = useState(false);
  // Portal target: the .portal-scope root, so the sheet keeps the portal's
  // design tokens but escapes the hero <section>'s local variable overrides
  // (which repaint --p-accent / --p-text-dim for the dark hero).
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(
      document.querySelector<HTMLElement>(".portal-scope") ?? document.body,
    );
  }, []);

  const entries = updates || EMPTY_UPDATES;
  const grouped = useMemo(() => {
    const groups = new Map<string, WeeklyUpdate[]>();
    for (const update of entries) {
      const label = dateLabel(update.recordedAt);
      groups.set(label, [...(groups.get(label) || []), update]);
    }
    return [...groups.entries()];
  }, [entries]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setShown(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      setShown(false);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className || "text-[13px] font-semibold underline underline-offset-4"
        }
        aria-haspopup="dialog"
      >
        History{entries.length ? ` (${entries.length})` : ""}
      </button>

      {open && portalTarget
        ? createPortal(
        <div
          className="fixed inset-0 z-50 text-[var(--p-text)]"
          role="dialog"
          aria-modal="true"
          aria-label="Project update history"
        >
          <div
            aria-hidden
            className={`sheet-backdrop absolute inset-0 bg-[#061827]/50 ${
              shown ? "is-open" : ""
            }`}
          />

          <aside
            className={`sheet-panel absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-[var(--p-border)] bg-[var(--p-surface)] shadow-[-24px_0_60px_rgba(6,24,39,.28)] ${
              shown ? "is-open" : ""
            }`}
          >
            <header className="flex items-center gap-3 border-b border-[var(--p-border)] px-5 py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--p-accent-weak)] text-[var(--p-accent)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold tracking-[-0.01em]">
                  Project updates
                </h2>
                <p className="text-[12px] text-[var(--p-text-dim)]">
                  {entries.length
                    ? `${entries.length} past update${entries.length === 1 ? "" : "s"}, newest first`
                    : "Past weekly summaries"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)] hover:text-[var(--p-text)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {grouped.length ? (
                <ol className="space-y-6">
                  {grouped.map(([day, dayUpdates]) => (
                    <li key={day} className="relative pl-5">
                      <span
                        className="absolute left-0 top-[6px] h-2 w-2 rounded-full bg-[var(--p-accent)]"
                        aria-hidden
                      />
                      <span
                        className="absolute left-[3px] top-[16px] bottom-0 w-px bg-[var(--p-border)]"
                        aria-hidden
                      />
                      <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--p-text-dim)]">
                        {day}
                      </h3>
                      <div className="mt-2.5 space-y-2.5">
                        {dayUpdates.map((update) => (
                          <article
                            key={update.id}
                            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] p-3.5"
                          >
                            <p className="text-[11px] font-medium text-[var(--p-text-dim)]">
                              {timeLabel(update.recordedAt)}
                              {update.recordedBy ? ` · ${update.recordedBy}` : ""}
                            </p>
                            <HistoryDetail
                              label="Shipped"
                              value={update.thisWeek}
                            />
                            <HistoryDetail
                              label="Up next"
                              value={update.upNext}
                            />
                            <HistoryDetail
                              label="Needed from you"
                              value={update.neededFromYou}
                              tone="warn"
                            />
                          </article>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-2)] p-6 text-center">
                  <p className="text-[13px] font-semibold">
                    No previous updates yet
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--p-text-dim)]">
                    When the PM posts a new weekly summary, the one it replaces
                    lands here.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>,
            portalTarget,
          )
        : null}
    </>
  );
}

function HistoryDetail({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warn";
}) {
  if (!value) return null;
  return (
    <div className="mt-2.5 first:mt-3">
      <p
        className={
          "text-[10px] font-bold uppercase tracking-[0.06em] " +
          (tone ? "text-[var(--p-warn)]" : "text-[var(--p-text-dim)]")
        }
      >
        {label}
      </p>
      <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--p-text)]">
        {value}
      </p>
    </div>
  );
}
