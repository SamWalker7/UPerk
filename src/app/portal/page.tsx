import { redirect } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import { readPortalData } from "@/lib/portal/data";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { StatusHero } from "@/components/portal/StatusHero";
import { PmBanner } from "@/components/portal/PmAnnotation";
import { WaitingOnYou } from "@/components/portal/WaitingOnYou";
import { SeeItWorking } from "@/components/portal/SeeItWorking";
import { ThePlan } from "@/components/portal/ThePlan";
import { JustFinished } from "@/components/portal/JustFinished";
import { Decisions } from "@/components/portal/Decisions";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const role = await getPortalRole();
  if (!role) redirect("/portal/login");

  const data = await readPortalData();

  return (
    <main className="pb-20">
      <PortalHeader project={data.project} role={role} />
      <StatusHero data={data} />
      {role === "pm" ? <PmBanner /> : null}
      <WaitingOnYou requests={data.requests} role={role} />
      <SeeItWorking prototype={data.prototype} build={data.build} role={role} />
      <ThePlan plan={data.plan} role={role} />
      <JustFinished screens={data.finishedScreens} role={role} />
      <Decisions
        decisions={data.decisions}
        intro={data.decisionsIntro}
        nextCall={data.nextCall}
        role={role}
      />
    </main>
  );
}
