import Link from "next/link";
import type { ProjectSummary } from "@/lib/portal/types";
import { formatDateTime } from "@/lib/portal/format";
import { StatusChip } from "./ui";


const TONE_ACCENT: Record<ProjectSummary["statusTone"], string> = {
  ok: "var(--p-ok)",
  warn: "var(--p-warn)",
  risk: "var(--p-risk)",
};

export function ProjectCard({ p }: { p: ProjectSummary }) {
  const pct =
    p.screensTotal > 0
      ? Math.min(100, Math.round((p.screensBuilt / p.screensTotal) * 100))
      : 0;

  return (
    <Link
      href={`/portal/${p.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_1px_2px_rgba(16,35,58,.04)] transition-all duration-150 hover:-translate-y-1 hover:border-[var(--p-accent)]/40 hover:shadow-[0_16px_34px_rgba(16,35,58,.12)]"
    >
      {/* status accent rail */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: TONE_ACCENT[p.statusTone] }}
      />

      <div className="flex flex-1 flex-col p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-[16px] font-bold leading-tight tracking-[-0.01em]">
              <span className="truncate">{p.name}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="h-4 w-4 shrink-0 -translate-x-1 text-[var(--p-accent)] opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </h3>
            <p className="mt-0.5 truncate text-[12px] text-[var(--p-text-dim)]">
              {p.client}
            </p>
          </div>
          <StatusChip
            label={p.statusLabel}
            tone={p.statusTone}
            className="shrink-0"
          />
        </div>

        {/* headline stats */}
        <div className="mt-5 flex items-end gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--p-text-dim)]">
              Phase
            </p>
            <p className="mt-1 text-[15px] font-bold leading-none tracking-[-0.01em]">
              {p.currentPhase}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--p-text-dim)]">
              To launch
            </p>
            <p className="mt-1 flex items-baseline gap-1 leading-none">
              <span className="text-[22px] font-bold tracking-[-0.02em]">
                {p.daysToLaunch}
              </span>
              <span className="text-[12px] font-medium text-[var(--p-text-dim)]">
                days
              </span>
            </p>
          </div>
        </div>

        {/* screens progress */}
        <div className="mt-5">
          <div className="mb-1.5 flex items-baseline justify-between text-[12px]">
            <span className="text-[var(--p-text-dim)]">Screens built</span>
            <span className="font-semibold tabular-nums">
              {p.screensBuilt}
              <span className="font-normal text-[var(--p-text-dim)]">
                {" "}
                / {p.screensTotal}
              </span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--p-surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--p-accent)] transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-auto" />

        {/* footer */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--p-border)] pt-3.5 text-[12px]">
          {p.openRequests > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--p-warn-bg)] px-2.5 py-1 font-semibold text-[var(--p-warn)]">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {p.openRequests} waiting on you
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[var(--p-text-dim)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--p-ok)]" />
              All caught up
            </span>
          )}
          <span className="shrink-0 truncate text-[var(--p-text-dim)]">
            {formatDateTime(p.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
