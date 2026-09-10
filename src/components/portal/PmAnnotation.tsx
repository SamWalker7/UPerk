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
