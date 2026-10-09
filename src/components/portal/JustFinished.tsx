import { PmAnnotation } from "./PmAnnotation";
import { SectionTitle } from "./ui";
import { ScreenCarousel } from "./ScreenCarousel";
import type { FinishedScreen, PortalRole } from "@/lib/portal/types";

// Timestamp for sorting; freeform/blank dates ("1 Sept", "") count as 0 so
// they sink to the end (Array.sort is stable, so their order is kept).
const dateValue = (date: string) => {
  const t = Date.parse(date);
  return Number.isNaN(t) ? 0 : t;
};

export function JustFinished({
  screens: allScreens,
  role,
  slug,
}: {
  screens: FinishedScreen[];
  role: PortalRole;
  slug: string;
}) {
  // Newest date first, regardless of the order the PM stored them in.
  const screens = [...allScreens].sort(
    (a, b) => dateValue(b.date) - dateValue(a.date),
  );

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
