import { notFound } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { Decisions } from "@/components/portal/Decisions";

export default async function DecisionsPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const role = (await getPortalRole()) ?? "client";
  const data = await readProject(project);
  if (!data) notFound();
  return (
    <Decisions
      decisions={data.decisions}
      intro={data.decisionsIntro}
      nextCall={data.nextCall}
      role={role}
      slug={data.slug}
    />
  );
}
