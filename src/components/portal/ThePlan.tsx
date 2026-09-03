import { PmAnnotation } from "./PmAnnotation";
import { Card, SectionTitle } from "./ui";
import type { ProjectData, PortalRole } from "@/lib/portal/types";

const LABEL_W = 168; // px

function pct(date: string, start: number, span: number) {
  const t = new Date(date + "T00:00:00").getTime();
  return Math.max(0, Math.min(100, ((t - start) / span) * 100));
}

function monthTicks(startISO: string, endISO: string) {
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");
  const ticks: { label: string; date: string }[] = [];
  const d = new Date(start.getFullYear(), start.getMonth(), 1);
  while (d <= end) {
    ticks.push({
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`,
    });
    d.setMonth(d.getMonth() + 1);
  }
  return ticks;
}

export function ThePlan({
  plan,
  role,
  slug,
}: {
  plan: ProjectData["plan"];
  role: PortalRole;
  slug: string;
}) {
  const start = new Date(plan.axisStart + "T00:00:00").getTime();
  const end = new Date(plan.axisEnd + "T00:00:00").getTime();
  const span = end - start;
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const showToday = today.getTime() >= start && today.getTime() <= end;
  const todayLeft = pct(todayISO, start, span);
  const ticks = monthTicks(plan.axisStart, plan.axisEnd);

  return (
    <div>
      <SectionTitle title="The plan" aside={plan.rangeLabel} />
      <Card>
        <div className="overflow-x-auto pt-4">
          <div className="min-w-[640px]">
            {/* Today marker overlays the bar track, offset past the label column */}
            <div className="relative">
              {showToday ? (
                <div
                  className="pointer-events-none absolute z-10 w-px bg-[var(--p-text)]"
                  style={{
                    top: "0.25rem",
                    left: `calc(${LABEL_W}px + (100% - ${LABEL_W}px) * ${todayLeft / 100})`,
                    height: `${plan.phases.length * 44 + 4}px`,
                  }}
                >
                  <span className="absolute -top-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--p-text)] px-2 py-0.5 text-[11px] font-semibold text-[var(--p-surface)]">
                    Today
                  </span>
                </div>
              ) : null}

              <div className="space-y-3 pt-2">
                {plan.phases.map((phase) => {
                  const left = pct(phase.start, start, span);
                  const width = Math.max(pct(phase.end, start, span) - left, 4);
                  const done = phase.state === "done";
                  const now = phase.state === "now";
                  return (
                    <div key={phase.id} className="flex items-center">
                      <div
                        className="flex shrink-0 items-center gap-2 pr-3 text-[13px]"
                        style={{ width: LABEL_W }}
                      >
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                            done
                              ? "bg-[var(--p-accent)]/60"
                              : now
                                ? "bg-[var(--p-accent)]"
                                : "border border-[var(--p-border)] bg-transparent"
                          }`}
                        />
                        <span className={now ? "font-semibold" : ""}>{phase.name}</span>
                      </div>
                      <div className="relative h-8 flex-1 rounded-full bg-[var(--p-surface-2)]">
                        <div
                          className={`absolute inset-y-0 flex items-center rounded-full px-3 text-[12px] font-medium ${
                            done
                              ? "bg-[var(--p-accent)]/25 text-[var(--p-text)]"
                              : now
                                ? "bg-[var(--p-accent)] text-white"
                                : "border border-dashed border-[var(--p-border)] text-[var(--p-text-dim)]"
                          }`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          <span className="truncate">{phase.rangeLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex">
              <div className="shrink-0" style={{ width: LABEL_W }} />
              <div className="relative mt-2 h-4 flex-1 text-[11px] text-[var(--p-text-dim)]">
                {ticks.map((tk) => (
                  <span
                    key={tk.date}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${pct(tk.date, start, span)}%` }}
                  >
                    {tk.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {plan.milestones.length > 0 ? (
          <div className="mt-6 grid gap-4 border-t border-[var(--p-border)] pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {plan.milestones.map((m) => (
              <div key={m.title}>
                <p className="text-[13px] font-semibold">{m.title}</p>
                <p className="mt-0.5 text-[12px] text-[var(--p-text-dim)]">{m.body}</p>
              </div>
            ))}
          </div>
        ) : null}

        {role === "pm" ? (
          <PmAnnotation linkLabel="Edit phases" href={`/portal/console?p=${slug}`}>
            Edit dates in the console. Moving a date asks for a one-line reason, published
            with the change.
          </PmAnnotation>
        ) : null}
      </Card>
    </div>
  );
}
