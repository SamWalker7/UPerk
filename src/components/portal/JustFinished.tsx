import { Section } from "./Section";
import { PmAnnotation } from "./PmAnnotation";
import type { FinishedScreen, PortalRole } from "@/lib/portal/types";

export function JustFinished({
  screens,
  role,
}: {
  screens: FinishedScreen[];
  role: PortalRole;
}) {
  if (screens.length === 0) return null;
  return (
    <Section title="Just finished" aside="Newest first">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {screens.map((s) => (
          <div key={s.id} className="w-40 shrink-0">
            <div className="flex h-56 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              {s.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-2xl">🖼️</span>
              )}
            </div>
            <p className="mt-2 text-[13px] font-medium">{s.name}</p>
            <p className="text-[12px] text-slate-400">{s.date}</p>
          </div>
        ))}
      </div>
      {role === "pm" ? (
        <PmAnnotation linkLabel="+ Add screen" href="/portal/console">
          Drop a screenshot, give it a name and a date. Newest goes to the front
          automatically.
        </PmAnnotation>
      ) : null}
    </Section>
  );
}
