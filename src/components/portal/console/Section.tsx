"use client";

import { useId, type ReactNode } from "react";

export function Section({
  title,
  summary,
  badge,
  dirty,
  open,
  onToggle,
  headerAction,
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
  /** Optional control beside the summary, outside the section toggle. */
  headerAction?: ReactNode;
  children: ReactNode;
}) {
  const panelId = useId();
  return (
    <section className="console-section">
      <div className="flex w-full items-center gap-2.5 pb-3 sm:gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left sm:gap-3"
        >
          <span
            className={"hidden shrink-0 text-[var(--p-text-dim)] transition-transform " + (open ? "rotate-90" : "")}
            aria-hidden
          >
            ▶
          </span>
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[18px] font-bold tracking-tight">
            <span className="truncate">{title}</span>
            {typeof badge === "number" ? (
              <span className="shrink-0 rounded-full bg-[var(--p-surface-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--p-text-dim)]">
                {badge}
              </span>
            ) : null}
            {dirty ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--p-warn)]"
                title="Unsaved changes in this section"
              />
            ) : null}
          </span>
          {summary ? (
            <span className="ml-auto hidden shrink-0 max-w-[45%] truncate pl-2 text-[12px] text-[var(--p-text-dim)] sm:block">
              {summary}
            </span>
          ) : null}
        </button>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>
      {open ? (
        <div
          id={panelId}
          className="console-section-body space-y-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 shadow-[0_1px_1px_rgba(16,35,58,.04)] sm:p-5"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
