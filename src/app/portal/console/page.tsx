import { redirect } from "next/navigation";
import Link from "next/link";
import { getPortalRole } from "@/lib/portal/session";
import { readPortalData } from "@/lib/portal/data";
import ConsoleEditor from "@/components/portal/console/ConsoleEditor";

export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const role = await getPortalRole();
  if (role !== "pm") redirect("/portal");

  const data = await readPortalData();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-5 w-5 rounded bg-blue-600" />
          <h1 className="text-lg font-semibold">PM console — {data.project.name}</h1>
        </div>
        <Link
          href="/portal"
          className="text-[13px] text-blue-700 underline underline-offset-2 dark:text-blue-300"
        >
          ← Back to client view
        </Link>
      </div>
      <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
        Edits are written to <code>src/portal-data/portal.json</code> in local dev.
        Production is read-only until the backend API is connected.
      </p>

      <ConsoleEditor initialData={data} />
    </main>
  );
}
