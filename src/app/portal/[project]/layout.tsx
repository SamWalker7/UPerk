import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { StatusHero } from "@/components/portal/StatusHero";
import { PmBanner } from "@/components/portal/PmAnnotation";

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

  return (
    <main className="pb-20">
      <PortalTopBar role={role} crumb={`Client portal — ${data.project.name}`} />

      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6">
        <StatusHero data={data} role={role} />
      </div>

      {role === "pm" ? <PmBanner /> : null}

      <div className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-6 sm:py-11">
        {children}
      </div>
    </main>
  );
}
