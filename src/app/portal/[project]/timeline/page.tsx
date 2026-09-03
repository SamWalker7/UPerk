import { notFound } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { ThePlan } from "@/components/portal/ThePlan";
import { JustFinished } from "@/components/portal/JustFinished";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const role = (await getPortalRole()) ?? "client";
  const data = await readProject(project);
  if (!data) notFound();
  return (
    <div className="space-y-10">
      <ThePlan plan={data.plan} role={role} slug={data.slug} />
      <JustFinished screens={data.finishedScreens} role={role} slug={data.slug} />
    </div>
  );
}
