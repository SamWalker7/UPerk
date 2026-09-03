import { notFound } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { WaitingOnYou } from "@/components/portal/WaitingOnYou";

export default async function RequestsPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const role = (await getPortalRole()) ?? "client";
  const data = await readProject(project);
  if (!data) notFound();
  return <WaitingOnYou requests={data.requests} role={role} slug={data.slug} />;
}
