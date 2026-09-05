import Link from "next/link";
import type { ProjectData, PortalRole } from "@/lib/portal/types";
import { formatDateTime } from "@/lib/portal/format";

export function ProjectHeader({
  project,
  slug,
  role,
}: {
  project: ProjectData["project"];
  slug: string;
  role: PortalRole;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-3 pt-5 sm:px-4 sm:pt-6">
      <div>
        <Link
          href="/portal"
          className="text-[12px] text-[var(--p-text-dim)] hover:text-[var(--p-text)]"
        >
          ← Projects
        </Link>
        <h1 className="mt-1 text-xl font-bold tracking-tight">
          {project.name}
          <span className="ml-2 text-[13px] font-normal text-[var(--p-text-dim)]">
            {project.client}
          </span>
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-3 text-[13px] text-[var(--p-text-dim)]">
        <span>Updated {formatDateTime(project.updatedAt)}</span>
        {role === "pm" ? (
          <Link
            href={`/console?p=${slug}`}
            className="rounded-lg border border-[var(--p-border)] px-3 py-1.5 font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-2)]"
          >
            Edit in console
          </Link>
        ) : null}
      </div>
    </div>
  );
}
