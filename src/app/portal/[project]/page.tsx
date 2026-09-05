import { notFound } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
import { OverviewTab } from "@/components/portal/OverviewTab";
import { WaitingOnYou } from "@/components/portal/WaitingOnYou";
import { SeeItWorking } from "@/components/portal/SeeItWorking";
import { ThePlan } from "@/components/portal/ThePlan";
import { JustFinished } from "@/components/portal/JustFinished";
import { Decisions } from "@/components/portal/Decisions";

// One scrolling page. TabNav (in the layout) is a scroll-spy over these
// section ids — it never navigates, it just scrolls to and highlights them.
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const session = await getPortalSession();
  const role = session?.role ?? "client";
  const data = session ? await readProject(session.apiToken, project) : null;
  if (!data) notFound();

  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-[7.5rem]">
        <OverviewTab data={data} role={role} />
      </section>

      <section id="requests" className="scroll-mt-[7.5rem]">
        <WaitingOnYou requests={data.requests} role={role} slug={data.slug} />
      </section>

      <section id="prototype" className="scroll-mt-[7.5rem]">
        <SeeItWorking
          prototype={data.prototype}
          build={data.build}
          role={role}
          slug={data.slug}
        />
      </section>

      <section id="timeline" className="scroll-mt-[7.5rem] space-y-10">
        <ThePlan plan={data.plan} role={role} slug={data.slug} />
        <JustFinished screens={data.finishedScreens} role={role} slug={data.slug} />
      </section>

      <section id="decisions" className="scroll-mt-[7.5rem]">
        <Decisions
          decisions={data.decisions}
          intro={data.decisionsIntro}
          nextCall={data.nextCall}
          role={role}
          slug={data.slug}
        />
      </section>
    </div>
  );
}
