import Link from "next/link";
import type { ReactNode } from "react";

/** Dashed blue "PM" box. Rendered only for the "pm" role by callers. */
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
    <div className="mt-4 rounded-xl border border-dashed border-blue-400 bg-blue-50/60 p-4 text-[13px] leading-relaxed text-slate-600 dark:border-blue-500/60 dark:bg-blue-500/10 dark:text-slate-300">
      <span className="font-semibold text-blue-700 dark:text-blue-300">PM</span>{" "}
      {children}
      {linkLabel && href ? (
        <div className="mt-2">
          <Link
            href={href}
            className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300"
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
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
        <span className="font-semibold">PM annotations are on.</span>
        <span>
          Dashed controls are visible to Universal Perk admins and PMs only — clients
          never see them.
        </span>
        <Link
          href="/portal/console"
          className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300"
        >
          Open the PM console
        </Link>
      </div>
    </div>
  );
}
