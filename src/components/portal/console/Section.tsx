"use client";

import { useId, type ReactNode } from "react";

export function Section({
  title,
  summary,
  badge,
  dirty,
  open,
  onToggle,
  children,
}: {
  title: string;
  /** short right-aligned context, e.g. "3 open · 1 blocking" */
  summary?: ReactNode;
  /** count pill next to the title, e.g. number of items */
  badge?: number;
  /** true when this section has unsaved edits */
  dirty?: boolean;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = useId();
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[var(--p-surface-2)]/60"
      >
        <span
          className={
            "text-[var(--p-text-dim)] transition-transform " +
            (open ? "rotate-90" : "")
          }
          aria-hidden
        >
          ▶
        </span>
        <span className="flex items-center gap-2 text-[14px] font-bold">
          {title}
          {typeof badge === "number" ? (
            <span className="rounded-full bg-[var(--p-surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--p-text-dim)]">
              {badge}
            </span>
          ) : null}
          {dirty ? (
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--p-warn)]"
              title="Unsaved changes in this section"
            />
          ) : null}
        </span>
        {summary ? (
          <span className="ml-auto truncate text-[12px] text-[var(--p-text-dim)]">
            {summary}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          id={panelId}
          className="space-y-4 border-t border-[var(--p-border)] px-5 py-5"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
