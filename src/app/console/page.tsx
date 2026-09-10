import { redirect } from "next/navigation";
import Link from "next/link";
import { getPortalSession } from "@/lib/portal/session";
import { listProjects, readProject } from "@/lib/portal/data";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import ConsoleEditor from "@/components/portal/console/ConsoleEditor";
import { ConsoleProjectPicker } from "@/components/portal/console/ConsoleProjectPicker";

export const dynamic = "force-dynamic";

export default async function ConsolePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const session = await getPortalSession();
  if (session?.role !== "pm") redirect("/portal");
  const role = session.role;

  const projects = await listProjects(session.apiToken);
  const { p } = await searchParams;
  const selected =
    (p && projects.find((x) => x.slug === p)?.slug) || projects[0]?.slug;

  const data = selected ? await readProject(session.apiToken, selected) : null;

  return (
    <main>
      <PortalTopBar
        role={role}
        showConsoleLink={false}
        crumb={
          <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden shrink-0 sm:inline">PM console —</span>
            {projects.length > 0 ? (
              <ConsoleProjectPicker
                projects={projects.map((x) => ({
                  slug: x.slug,
                  name: x.name,
                }))}
                selected={selected}
              />
            ) : null}
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#dceeff] px-2.5 py-1 text-[12px] font-semibold text-[#0b5f9f] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0b5f9f]" />
              PM{data?.project.updatedBy ? ` · ${data.project.updatedBy}` : ""}
            </span>
          </span>
        }
      />

      <div className="mx-auto w-full max-w-[1256px] px-3 pb-24 pt-0 sm:px-0">
        {data ? (
          <>
            <div className="-mt-[58px] flex items-center justify-end gap-3">
              <span className="hidden text-[13px] text-[var(--p-text-dim)] sm:inline">
                Clients cannot see this page
              </span>
              <Link
                href={`/portal/${data.slug}`}
                className="rounded-lg border border-[#b8c3d0] bg-white px-3 py-2 text-[13px] font-semibold text-[var(--p-text)] shadow-sm hover:bg-[var(--p-surface-2)]"
              >
                View as client
              </Link>
            </div>
            <ConsoleEditor key={data.slug} initialData={data} slug={data.slug} />
          </>
        ) : (
          <p className="mt-8 text-[13px] text-[var(--p-text-dim)]">
            No projects yet. Create one to start editing.
          </p>
        )}
      </div>
    </main>
  );
}
