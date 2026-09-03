import { notFound } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { SeeItWorking } from "@/components/portal/SeeItWorking";

export default async function PrototypePage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const role = (await getPortalRole()) ?? "client";
  const data = await readProject(project);
  if (!data) notFound();
  return (
    <SeeItWorking
      prototype={data.prototype}
      build={data.build}
      role={role}
      slug={data.slug}
    />
  );
}
