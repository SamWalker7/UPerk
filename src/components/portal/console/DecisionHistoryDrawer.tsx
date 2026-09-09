"use client";

import { useEffect, useMemo, useState } from "react";
import type { Decision } from "@/lib/portal/types";
import { formatDate, formatDateTime } from "@/lib/portal/format";

function groupKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatDate(value) || "Earlier decisions";
  return date.toISOString().slice(0, 10);
}

export function DecisionHistoryDrawer({
  decisions,
  className,
}: {
  decisions: Decision[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const groups = useMemo(() => {
    const sorted = [...decisions].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });
    const result = new Map<string, Decision[]>();
    for (const decision of sorted) {
      const key = groupKey(decision.date);
      result.set(key, [...(result.get(key) || []), decision]);
    }
    return [...result.entries()];
  }, [decisions]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || "text-[13px] font-semibold text-[var(--p-accent)] underline underline-offset-2"}
        aria-haspopup="dialog"
      >
        History{decisions.length ? ` (${decisions.length})` : ""}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Decision history">
          <button type="button" className="absolute inset-0 bg-[#061827]/55 backdrop-blur-[1px]" aria-label="Close decision history" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-[var(--p-surface)] shadow-[-16px_0_42px_rgba(6,24,39,.24)]">
            <header className="flex items-start justify-between gap-4 border-b border-[var(--p-border)] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">Audit trail</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">Decision history</h2>
                <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">Every decision is retained, including superseded entries.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-xl leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)]" aria-label="Close decision history">×</button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              {groups.length ? groups.map(([date, entries]) => (
                <section key={date} className="relative border-l border-[var(--p-border)] pb-7 pl-5 last:pb-0">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--p-accent)] ring-4 ring-[var(--p-surface)]" />
                  <h3 className="text-[13px] font-bold text-[var(--p-text)]">{formatDate(date)}</h3>
                  <div className="mt-3 space-y-3">
                    {entries.map((decision) => (
                      <article key={decision.id} className={"rounded-xl border p-4 " + (decision.supersededBy ? "border-[var(--p-border)] bg-[var(--p-surface-2)] opacity-70" : "border-[var(--p-accent)]/25 bg-[var(--p-accent-weak)]/40")}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className={"rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide " + (decision.supersededBy ? "bg-[var(--p-border)] text-[var(--p-text-dim)]" : "bg-[var(--p-ok-bg)] text-[var(--p-ok)]")}>
                            {decision.supersededBy ? "Superseded" : "Active"}
                          </span>
                          {decision.createdAt ? <span className="text-[11px] text-[var(--p-text-dim)]">Created {formatDateTime(decision.createdAt)}</span> : null}
                        </div>
                        <p className="mt-3 text-[14px] leading-relaxed text-[var(--p-text)]">{decision.body}</p>
                        <p className="mt-2 text-[12px] text-[var(--p-text-dim)]">{decision.attribution || "Project team"}</p>
                        {decision.referenceUrl ? <a href={decision.referenceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[12px] font-semibold text-[var(--p-accent)] underline underline-offset-2">Open reference ↗</a> : null}
                      </article>
                    ))}
                  </div>
                </section>
              )) : (
                <div className="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-2)] p-5 text-center">
                  <p className="text-[14px] font-semibold">No decisions yet</p>
                  <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">Logged decisions will appear here in date order.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
