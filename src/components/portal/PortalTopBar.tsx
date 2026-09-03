import Link from "next/link";
import type { ReactNode } from "react";
import type { PortalRole } from "@/lib/portal/types";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

/** Shared sticky top bar: brand on the left, actions on the right. `crumb`
 *  renders between the brand and the actions (project name, "Projects", etc.). */
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
    <header className="sticky top-0 z-40 h-14 border-b border-[var(--p-border)] bg-[var(--p-surface)]/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center gap-x-4 px-4">
        <BrandLogo />
        {crumb ? (
          <>
            <span className="text-[var(--p-border)]">/</span>
            <div className="text-[14px] text-[var(--p-text-dim)]">{crumb}</div>
          </>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {role === "pm" && showConsoleLink ? (
            <Link
              href="/console"
              className="cursor-pointer rounded-lg border border-[var(--p-border)] px-3 py-1.5 text-[13px] font-medium hover:bg-[var(--p-surface-2)]"
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
