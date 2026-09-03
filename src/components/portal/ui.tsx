import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/portal/types";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  aside,
}: {
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {aside ? (
        <div className="text-[13px] text-[var(--p-text-dim)]">{aside}</div>
      ) : null}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--p-text-dim)]">
      {children}
    </p>
  );
}

const TONE: Record<StatusTone, string> = {
  ok: "text-[var(--p-ok)] bg-[var(--p-ok-bg)]",
  warn: "text-[var(--p-warn)] bg-[var(--p-warn-bg)]",
  risk: "text-[var(--p-risk)] bg-[var(--p-risk-bg)]",
};

export function StatusChip({
  label,
  tone,
  className,
}: {
  label: string;
  tone: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold",
        TONE[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function ProgressBar({
  value,
  total,
  className,
}: {
  value: number;
  total: number;
  className?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-[var(--p-border)]",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-[var(--p-accent)] transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
