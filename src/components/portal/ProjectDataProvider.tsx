"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { PortalRole, ProjectData } from "@/lib/portal/types";
import { PageLoader } from "./Spinner";

type ProjectContextValue = {
  data: ProjectData;
  role: PortalRole;
  /** Re-fetches the project from the API and swaps it in. */
  refresh: () => Promise<void>;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

/** Read the current project + role inside a page nested under
 *  `<ProjectDataProvider>`. Throws if used outside one — every page under
 *  `/portal/[project]` is. */
export function useProjectData(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectData() must be used inside ProjectDataProvider");
  return ctx;
}

/**
 * Client-side data boundary for `/portal/[project]/**`. Fetches the
 * project (and the caller's role) from this app's own `/portal/api/*`
 * routes — visible in the browser's Network tab — instead of the old
 * server-component `readProject()` call, which ran entirely server-side
 * and never showed up there.
 *
 * Renders `layout.tsx`'s hero + `page.tsx`'s body once the fetch resolves;
 * `middleware.ts` still gates the route server-side, so by the time this
 * mounts a session is assumed to exist (a 401 here just means it expired
 * mid-session, handled below).
 */
export function ProjectDataProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [data, setData] = useState<ProjectData | null>(null);
  const [role, setRole] = useState<PortalRole | null>(null);
  const [error, setError] = useState<"not-found" | "error" | null>(null);

  async function load() {
    setError(null);
    const [sessionRes, projectRes] = await Promise.all([
      fetch("/portal/api/session"),
      fetch(`/portal/api/projects/${encodeURIComponent(slug)}`),
    ]);

    if (sessionRes.status === 401 || projectRes.status === 401) {
      router.replace(`/portal/login?next=${encodeURIComponent(`/portal/${slug}`)}`);
      return;
    }
    if (projectRes.status === 404) {
      setError("not-found");
      return;
    }
    if (!sessionRes.ok || !projectRes.ok) {
      setError("error");
      return;
    }

    const sessionBody = await sessionRes.json();
    const projectBody = await projectRes.json();
    setRole(sessionBody.role);
    setData(projectBody as ProjectData);
  }

  useEffect(() => {
    setData(null);
    setRole(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (error === "not-found") {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-24 text-center">
        <h1 className="text-xl font-bold">Project not found</h1>
        <p className="mt-2 text-[13px] text-[var(--p-text-dim)]">
          It may have been removed, or the link is wrong.
        </p>
      </div>
    );
  }
  if (error === "error") {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-24 text-center">
        <h1 className="text-xl font-bold">Couldn&apos;t load this project</h1>
        <p className="mt-2 text-[13px] text-[var(--p-text-dim)]">
          Something went wrong talking to the portal API.
        </p>
        <button
          type="button"
          onClick={load}
          className="mt-4 rounded-lg border border-[var(--p-border)] px-4 py-2 text-[13px] font-semibold hover:bg-[var(--p-surface-2)]"
        >
          Try again
        </button>
      </div>
    );
  }
  if (!data || !role) return <PageLoader label="Loading project…" />;

  return (
    <ProjectContext.Provider value={{ data, role, refresh: load }}>
      {children}
    </ProjectContext.Provider>
  );
}
