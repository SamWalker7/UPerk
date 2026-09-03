import Link from "next/link";
import type { ReactNode } from "react";
import type { PortalRole } from "@/lib/portal/types";

/** Shared top bar: brand on the left, actions on the right. `crumb` renders
 *  between the brand and the actions (project name, "Projects", etc.). */
export function PortalTopBar({
  role,
  crumb,
  showConsoleLink = true,
}: {
  role: PortalRole;
  crumb?: ReactNode;
  showConsoleLink?: boolean;
}) {
  return (
    <header className="border-b border-[var(--p-border)] bg-[var(--p-surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/portal" className="flex items-center gap-2">
          <span className="inline-block h-5 w-5 rounded bg-[var(--p-accent)]" />
          <span className="text-[14px] font-semibold">Universal Perk</span>
        </Link>
        {crumb ? (
          <>
            <span className="text-[var(--p-border)]">/</span>
            <div className="text-[14px] text-[var(--p-text-dim)]">{crumb}</div>
          </>
        ) : null}
        <div className="ml-auto flex items-center gap-3">
          {role === "pm" && showConsoleLink ? (
            <Link
              href="/portal/console"
              className="rounded-lg border border-[var(--p-border)] px-3 py-1.5 text-[13px] font-medium hover:bg-[var(--p-surface-2)]"
            >
              PM console
            </Link>
          ) : null}
          <form action="/portal/api/logout" method="post">
            <button
              type="submit"
              className="text-[13px] text-[var(--p-text-dim)] underline underline-offset-2 hover:text-[var(--p-text)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
