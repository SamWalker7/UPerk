import { notFound } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { OverviewTab } from "@/components/portal/OverviewTab";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const role = (await getPortalRole()) ?? "client";
  const data = await readProject(project);
  if (!data) notFound();
  return <OverviewTab data={data} role={role} />;
}
