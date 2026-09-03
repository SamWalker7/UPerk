import Link from "next/link";
import type { ProjectSummary } from "@/lib/portal/types";
import { StatusChip, ProgressBar } from "./ui";

export function ProjectCard({ p }: { p: ProjectSummary }) {
  return (
    <Link
      href={`/portal/${p.slug}`}
      className="group flex flex-col rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-transform duration-150 hover:-translate-y-0.5 hover:border-[var(--p-accent)]/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold leading-tight">{p.name}</h3>
          <p className="mt-0.5 text-[12px] text-[var(--p-text-dim)]">{p.client}</p>
        </div>
        <StatusChip label={p.statusLabel} tone={p.statusTone} />
      </div>

      <div className="mt-4 flex items-center gap-4 text-[12px] text-[var(--p-text-dim)]">
        <span>
          <span className="font-semibold text-[var(--p-text)]">{p.currentPhase}</span>
        </span>
        <span>
          <span className="font-semibold text-[var(--p-text)]">{p.daysToLaunch}</span> days
          to launch
        </span>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[11px] text-[var(--p-text-dim)]">
          <span>Screens</span>
          <span>
            {p.screensBuilt} / {p.screensTotal}
          </span>
        </div>
        <ProgressBar value={p.screensBuilt} total={p.screensTotal} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--p-border)] pt-3 text-[12px]">
        {p.openRequests > 0 ? (
          <span className="font-semibold text-[var(--p-warn)]">
            {p.openRequests} waiting on you
          </span>
        ) : (
          <span className="text-[var(--p-text-dim)]">Nothing waiting</span>
        )}
        <span className="text-[var(--p-text-dim)]">Updated {p.updatedAt}</span>
      </div>
    </Link>
  );
}
