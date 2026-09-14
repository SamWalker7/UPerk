"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ProjectData, ProjectSummary } from "@/lib/portal/types";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { PageLoader } from "@/components/portal/Spinner";
import ConsoleEditor from "@/components/portal/console/ConsoleEditor";
import { ConsoleProjectPicker } from "@/components/portal/console/ConsoleProjectPicker";

// Client-side data boundary for /console: fetches the project list and the
// selected project from this app's own /portal/api/* routes (visible in the
// browser's Network tab) instead of the old server-component
// listProjects()/readProject() calls. middleware.ts still gates the route
// (PM-only) server-side, so a 401/403 here just means the session expired
// mid-visit.
export default function ConsolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("p") ?? undefined;

  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [data, setData] = useState<ProjectData | null>(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/portal/api/projects")
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.replace("/portal");
          return null;
        }
        return res.json();
      })
      .then((body) => {
        if (cancelled || !body) return;
        if (body.error) setError(body.error);
        else setProjects(body.projects ?? []);
      })
      .catch(() => !cancelled && setError("Couldn't load projects."));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected =
    (requestedSlug && projects?.some((p) => p.slug === requestedSlug) ? requestedSlug : undefined) ||
    projects?.[0]?.slug;

  useEffect(() => {
    if (!selected) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoadingProject(true);
    fetch(`/portal/api/projects/${encodeURIComponent(selected)}`)
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (body.error) setError(body.error);
        else setData(body as ProjectData);
      })
      .catch(() => !cancelled && setError("Couldn't load project."))
      .finally(() => !cancelled && setLoadingProject(false));
    return () => {
      cancelled = true;
    };
  }, [selected]);

  if (!projects) return <PageLoader label="Loading projects…" />;

  return (
    <main>
      <PortalTopBar
        role="pm"
        showConsoleLink={false}
        backHref="/portal"
        crumb={
          <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden shrink-0 sm:inline">PM console —</span>
            {projects.length > 0 ? (
              <ConsoleProjectPicker
                projects={projects.map((x) => ({ slug: x.slug, name: x.name }))}
                selected={selected}
              />
            ) : null}
          </span>
        }
      />

      <div className="mx-auto w-full max-w-[1440px] px-3 pb-24 pt-0 sm:px-6">
        {error ? <p className="mt-8 text-[13px] text-[var(--p-risk)]">{error}</p> : null}
        {loadingProject && !data ? (
          <PageLoader label="Loading project…" />
        ) : data ? (
          <>
            <div className="-mt-[52px] flex items-center justify-end">
              <Link
                href={`/portal/${data.slug}`}
                className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-[13px] font-semibold text-[var(--p-text)] shadow-sm hover:bg-[var(--p-surface-2)]"
              >
                View as client
              </Link>
            </div>
            <div className="mt-6">
              <ConsoleEditor key={data.slug} initialData={data} slug={data.slug} />
            </div>
          </>
        ) : !error ? (
          <p className="mt-8 text-[13px] text-[var(--p-text-dim)]">
            No projects yet. Create one to start editing.
          </p>
        ) : null}
      </div>
    </main>
  );
}
