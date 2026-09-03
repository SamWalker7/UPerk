import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Legacy wrapper kept for the tab section components. On a project tab the tab
 *  itself supplies the page context, so `bare` drops the outer heading. */
export function Section({
  id,
  title,
  aside,
  bare,
  children,
}: {
  id?: string;
  title?: string;
  aside?: ReactNode;
  bare?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="w-full">
      {!bare && title ? (
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          {aside ? (
            <div className="text-[13px] text-[var(--p-text-dim)]">{aside}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

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
