import { PmAnnotation } from "./PmAnnotation";
import { SectionTitle } from "./ui";
import { formatDate } from "@/lib/portal/format";
import type { FinishedScreen, PortalRole } from "@/lib/portal/types";

export function JustFinished({
  screens,
  role,
  slug,
}: {
  screens: FinishedScreen[];
  role: PortalRole;
  slug: string;
}) {
  return (
    <div>
      <SectionTitle title="Just finished" aside="Newest first" />
      {screens.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--p-border)] p-10 text-center text-[13px] text-[var(--p-text-dim)]">
          No finished screens yet.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {screens.map((s) => (
            <div key={s.id} className="w-40 shrink-0">
              <div className="flex h-56 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] text-[12px] text-[var(--p-text-dim)]">
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
              <p className="text-[12px] text-[var(--p-text-dim)]">
                {formatDate(s.date)}
              </p>
            </div>
          ))}
        </div>
      )}
      {role === "pm" ? (
        <PmAnnotation linkLabel="+ Add screen" href={`/console?p=${slug}`}>
          Drop a screenshot, give it a name and a date. Newest goes to the front
          automatically.
        </PmAnnotation>
      ) : null}
    </div>
  );
}
