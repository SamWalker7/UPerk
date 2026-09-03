import Link from "next/link";
import type { ReactNode } from "react";

/** Dashed "PM" box. Rendered only for the "pm" role by callers. */
export function PmAnnotation({
  children,
  linkLabel,
  href,
}: {
  children: ReactNode;
  linkLabel?: string;
  href?: string;
}) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-[var(--p-accent)]/50 bg-[var(--p-accent-weak)] p-4 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
      <span className="font-semibold text-[var(--p-accent)]">PM</span> {children}
      {linkLabel && href ? (
        <div className="mt-2">
          <Link
            href={href}
            className="font-medium text-[var(--p-accent)] underline underline-offset-2"
          >
            {linkLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function PmBanner() {
  return (
    <div className="mx-auto mt-4 w-full max-w-6xl px-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-[13px] text-[var(--p-text-dim)]">
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--p-accent)]" />
        <span className="font-semibold text-[var(--p-text)]">PM annotations are on.</span>
        <span>
          Dashed controls are visible to Universal Perk admins and PMs only — clients
          never see them.
        </span>
      </div>
    </div>
  );
}
