import Link from "next/link";
import type { ReactNode } from "react";
import type { PortalRole } from "@/lib/portal/types";
import { BrandLogo } from "./BrandLogo";

/** Shared sticky top bar: brand on the left, actions on the right. `crumb`
 *  renders between the brand and the actions (project name, "Projects", etc.). */
export function PortalTopBar({
  role,
  crumb,
  showConsoleLink = true,
  backHref,
}: {
  role: PortalRole;
  crumb?: ReactNode;
  showConsoleLink?: boolean;
  /** shows a "← All projects" link before the crumb, e.g. "/portal" */
  backHref?: string;
}) {
  return (
    <header className="h-[84px]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center gap-x-2 px-3 sm:gap-x-3 sm:px-6">
        <BrandLogo />
        {backHref ? (
          <>
            <span className="text-[var(--p-border)]">|</span>
            <Link
              href={backHref}
              className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-[var(--p-text-dim)] hover:text-[var(--p-text)] sm:text-[14px]"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">All projects</span>
            </Link>
          </>
        ) : null}
        {crumb ? (
          <>
            <span className="text-[var(--p-border)]">|</span>
            <div className="min-w-0 flex-1 truncate text-[13px] text-[var(--p-text-dim)] sm:text-[14px]">
              {crumb}
            </div>
          </>
        ) : null}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {role === "pm" && showConsoleLink ? (
            <Link
              href="/console"
              className="cursor-pointer rounded-lg border border-[#b8c3d0] bg-white px-3 py-1.5 text-[13px] font-semibold shadow-sm hover:bg-[var(--p-surface-2)]"
            >
              PM console
            </Link>
          ) : null}
          <form action="/portal/api/logout" method="post">
            <button
              type="submit"
              className="cursor-pointer text-[13px] text-[var(--p-text-dim)] underline underline-offset-2 hover:text-[var(--p-text)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
