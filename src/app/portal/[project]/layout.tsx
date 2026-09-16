"use client";

import { use, type ReactNode } from "react";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { StatusHero } from "@/components/portal/StatusHero";
import { ProjectDataProvider, useProjectData } from "@/components/portal/ProjectDataProvider";
import { PortalFooter } from "@/components/portal/PortalFooter";

function ProjectShell({ children }: { children: ReactNode }) {
  const { data, role } = useProjectData();
  return (
    <main>
      <PortalTopBar role={role} backHref="/portal" crumb={data.project.name} />

      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6">
        <StatusHero data={data} role={role} />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-6 sm:py-11">
        {children}
      </div>

      <PortalFooter />
    </main>
  );
}

export default function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ project: string }>;
}) {
  const { project } = use(params);
  return (
    <ProjectDataProvider slug={project}>
      <ProjectShell>{children}</ProjectShell>
    </ProjectDataProvider>
  );
}
