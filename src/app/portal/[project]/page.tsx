import { notFound } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { readProject } from "@/lib/portal/data";
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
      <section id="requests" className="scroll-mt-6">
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

      <section id="timeline" className="scroll-mt-6">
        <ThePlan plan={data.plan} role={role} slug={data.slug} />
      </section>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8">
        <section className="scroll-mt-6">
          <JustFinished screens={data.finishedScreens} role={role} slug={data.slug} />
        </section>
        <section id="decisions" className="scroll-mt-6">
          <Decisions
            decisions={data.decisions}
            intro={data.decisionsIntro}
            nextCall={data.nextCall}
            role={role}
            slug={data.slug}
          />
        </section>
      </div>
    </div>
  );
}
