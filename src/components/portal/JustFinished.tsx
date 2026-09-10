import { PmAnnotation } from "./PmAnnotation";
import { SectionTitle } from "./ui";
import { ScreenCarousel } from "./ScreenCarousel";
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
        <ScreenCarousel screens={screens} />
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
