"use client";

import { useEffect, useMemo, useState } from "react";
import type { WeeklyUpdate } from "@/lib/portal/types";

const EMPTY_UPDATES: WeeklyUpdate[] = [];

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Earlier updates"
    : new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function timeLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
}

export function WeeklyHistoryDrawer({ updates, className }: { updates?: WeeklyUpdate[]; className?: string }) {
  const [open, setOpen] = useState(false);
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || "text-[13px] font-semibold underline underline-offset-4"}
        aria-haspopup="dialog"
      >
        History{entries.length ? ` (${entries.length})` : ""}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Weekly update history">
          <button className="absolute inset-0 bg-[#061827]/55" aria-label="Close history" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-[var(--p-surface)] shadow-[-16px_0_42px_rgba(6,24,39,.24)]">
            <header className="flex items-start justify-between border-b border-[var(--p-border)] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">Project updates</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">Weekly history</h2>
                <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">Previous updates, kept in date order.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-xl leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)] hover:text-[var(--p-text)]" aria-label="Close history">×</button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              {grouped.length ? grouped.map(([day, dayUpdates]) => (
                <section key={day} className="relative border-l border-[var(--p-border)] pb-7 pl-5 last:pb-0">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--p-accent)] ring-4 ring-[var(--p-surface)]" />
                  <h3 className="text-[13px] font-bold text-[var(--p-text)]">{day}</h3>
                  <div className="mt-3 space-y-3">
                    {dayUpdates.map((update) => (
                      <article key={update.id} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] p-4">
                        <p className="text-[11px] font-medium text-[var(--p-text-dim)]">{timeLabel(update.recordedAt)}{update.recordedBy ? ` · ${update.recordedBy}` : ""}</p>
                        <HistoryDetail label="Shipped" value={update.thisWeek} />
                        <HistoryDetail label="Up next" value={update.upNext} />
                        <HistoryDetail label="Needed from you" value={update.neededFromYou} tone="warn" />
                      </article>
                    ))}
                  </div>
                </section>
              )) : (
                <div className="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-2)] p-5 text-center">
                  <p className="text-[14px] font-semibold">No previous updates yet</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--p-text-dim)]">When the PM updates this week’s summary, the prior update will appear here.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function HistoryDetail({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  if (!value) return null;
  return <div className="mt-3"><p className={"text-[11px] font-bold uppercase tracking-wide " + (tone ? "text-[var(--p-warn)]" : "text-[var(--p-text-dim)]")}>{label}</p><p className="mt-1 text-[13px] leading-relaxed text-[var(--p-text)]">{value}</p></div>;
}
