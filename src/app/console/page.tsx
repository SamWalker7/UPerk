import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { listProjects, readProject } from "@/lib/portal/data";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import ConsoleEditor from "@/components/portal/console/ConsoleEditor";
import { ConsoleProjectPicker } from "@/components/portal/console/ConsoleProjectPicker";
import { NewProjectDialog } from "@/components/portal/NewProjectDialog";

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
            <span className="hidden shrink-0 sm:inline">Console</span>
            {projects.length > 0 ? (
              <>
                <span className="hidden shrink-0 text-[var(--p-border)] sm:inline">
                  /
                </span>
                <ConsoleProjectPicker
                  projects={projects.map((x) => ({
                    slug: x.slug,
                    name: x.name,
                  }))}
                  selected={selected}
                />
              </>
            ) : null}
            <NewProjectDialog />
          </span>
        }
      />

      <div className="mx-auto w-full max-w-5xl px-3 pb-24 pt-6 sm:px-4 sm:pt-8">
        {data ? (
          <ConsoleEditor key={data.slug} initialData={data} slug={data.slug} />
        ) : (
          <p className="mt-8 text-[13px] text-[var(--p-text-dim)]">
            No projects yet. Create one to start editing.
          </p>
        )}
      </div>
    </main>
  );
}
