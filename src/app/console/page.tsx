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
      <PortalTopBar role={role} crumb="PM console" showConsoleLink={false} />

      <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">PM console</h1>
            <ConsoleProjectPicker
              projects={projects.map((x) => ({ slug: x.slug, name: x.name }))}
              selected={selected}
            />
          </div>
          <NewProjectDialog />
        </div>
        <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">
          Edits save directly to the portal API.
        </p>

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
