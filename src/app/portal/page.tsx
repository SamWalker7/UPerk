"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalRole, ProjectSummary } from "@/lib/portal/types";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { PageLoader } from "@/components/portal/Spinner";
import { ProjectCard } from "@/components/portal/ProjectCard";
import { NewProjectDialog } from "@/components/portal/NewProjectDialog";

// Client-side data boundary: fetches the caller's role and project list from
// this app's own /portal/api/* routes (visible in the browser's Network
// tab) instead of the old server-component getPortalSession()/
// listProjects() calls. middleware.ts still redirects unauthenticated
// visitors to /portal/login server-side.
export default function ProjectsPage() {
  const router = useRouter();
  const [role, setRole] = useState<PortalRole | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/portal/api/session").then((res) => (res.ok ? res.json() : null)),
      fetch("/portal/api/projects").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([sessionBody, projectsBody]) => {
        if (cancelled) return;
        if (!sessionBody || !projectsBody) {
          router.replace("/portal/login");
          return;
        }
        setRole(sessionBody.role);
        setProjects(projectsBody.projects ?? []);
      })
      .catch(() => !cancelled && setError("Couldn't load projects."));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <p className="mx-auto max-w-[640px] px-6 py-24 text-center text-[13px] text-[var(--p-risk)]">{error}</p>;
  }
  if (!role || !projects) return <PageLoader label="Loading projects…" />;

  return (
    <main>
      <PortalTopBar role={role} crumb="Projects" />

      <div className="mx-auto w-full max-w-[1440px] px-3 py-6 sm:px-6 sm:py-10">
        <div className="mb-7 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.02em]">Projects</h1>
            <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">
              {projects.length === 1
                ? "1 active project"
                : `${projects.length} active projects`}
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
