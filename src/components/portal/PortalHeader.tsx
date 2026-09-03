import Link from "next/link";
import type { PortalData, PortalRole } from "@/lib/portal/types";

export function PortalHeader({
  project,
  role,
}: {
  project: PortalData["project"];
  role: PortalRole;
}) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-8">
      <div className="flex items-center gap-2">
        <span className="inline-block h-5 w-5 rounded bg-blue-600" />
        <span className="text-[15px] font-semibold">Universal Perk</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="text-[15px] text-slate-500 dark:text-slate-400">
          Client portal — {project.name}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-[13px] text-slate-400 dark:text-slate-500">
          Updated {project.updatedAt} by {project.updatedBy}
        </span>
        {role === "pm" ? (
          <Link
            href="/portal/console"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            PM console
          </Link>
        ) : null}
        <form action="/portal/api/logout" method="post">
          <button
            type="submit"
            className="text-[13px] text-slate-400 underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
