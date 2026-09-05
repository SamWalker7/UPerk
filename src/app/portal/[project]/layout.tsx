import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { ProjectHeader } from "@/components/portal/ProjectHeader";
import { StatusHero } from "@/components/portal/StatusHero";
import { PmBanner } from "@/components/portal/PmAnnotation";
import { TabNav } from "@/components/portal/TabNav";

export const dynamic = "force-dynamic";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ project: string }>;
}) {
  const session = await getPortalSession();
  if (!session) redirect("/portal/login");
  const role = session.role;

  const { project } = await params;
  const data = await readProject(session.apiToken, project);
  if (!data) notFound();

  const openRequests = data.requests.filter((r) => r.status === "open").length;

  return (
    <main className="pb-20">
      <PortalTopBar role={role} crumb={data.project.name} showConsoleLink={false} />
      <ProjectHeader project={data.project} slug={data.slug} role={role} />

      <div className="mx-auto mt-4 w-full max-w-6xl px-3 sm:px-4">
        <StatusHero data={data} />
      </div>

      {role === "pm" ? <PmBanner /> : null}

      <TabNav openRequests={openRequests} />

      <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        {children}
      </div>
    </main>
  );
}
