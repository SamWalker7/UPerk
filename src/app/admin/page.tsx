import { redirect } from "next/navigation";
import { getPortalSession } from "@/lib/portal/session";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { AdminPanels } from "@/components/admin/AdminPanels";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getPortalSession();
  if (session?.role !== "pm") redirect("/portal");

  return (
    <main>
      <PortalTopBar role={session.role} showConsoleLink backHref="/portal" crumb="Admin" />
      <div className="mx-auto w-full max-w-[1440px] px-3 pb-24 pt-6 sm:px-6">
        <AdminPanels />
      </div>
    </main>
  );
}
