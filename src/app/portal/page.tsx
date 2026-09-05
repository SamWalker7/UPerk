import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { listProjects } from "@/lib/portal/data";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { NewProjectDialog } from "@/components/portal/NewProjectDialog";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await getPortalSession();
  if (!session) redirect("/portal/login");
  const role = session.role;

  const projects = await listProjects(session.apiToken);

  return (
    <main>
      <PortalTopBar role={role} crumb="Projects" />

      <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">
              {projects.length === 1
                ? "1 project"
                : `${projects.length} projects`}
            </p>
          </div>
          {role === "pm" ? <NewProjectDialog /> : null}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--p-border)] p-12 text-center">
            <p className="text-[14px] font-medium">No projects yet</p>
            <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">
              {role === "pm"
                ? "Create one to get started."
                : "Your project will show up here once it kicks off."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
