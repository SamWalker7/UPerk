import { Section, Card } from "./Section";
import { PmAnnotation } from "./PmAnnotation";
import type { PortalData, PortalRole } from "@/lib/portal/types";

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
}: {
  plan: PortalData["plan"];
  role: PortalRole;
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
    <Section title="The plan" aside={plan.rangeLabel}>
      <Card>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Today marker overlays the bar track, offset past the label column */}
            <div className="relative">
              {showToday ? (
                <div
                  className="pointer-events-none absolute top-0 z-10 w-px bg-slate-800 dark:bg-slate-200"
                  style={{
                    left: `calc(${LABEL_W}px + (100% - ${LABEL_W}px) * ${todayLeft / 100})`,
                    height: `${plan.phases.length * 44 + 8}px`,
                  }}
                >
                  <span className="absolute -top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
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
                              ? "bg-sky-300"
                              : now
                                ? "bg-blue-600"
                                : "border border-slate-300 bg-transparent dark:border-slate-600"
                          }`}
                        />
                        <span className={now ? "font-semibold" : ""}>{phase.name}</span>
                      </div>
                      <div className="relative h-8 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`absolute inset-y-0 flex items-center rounded-full px-3 text-[12px] font-medium ${
                            done
                              ? "bg-sky-200 text-sky-900"
                              : now
                                ? "bg-blue-600 text-white"
                                : "border border-dashed border-slate-300 text-slate-400 dark:border-slate-600"
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
              <div className="relative mt-2 h-4 flex-1 text-[11px] text-slate-400">
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

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {plan.milestones.map((m) => (
            <div key={m.title}>
              <p className="text-[13px] font-semibold">{m.title}</p>
              <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                {m.body}
              </p>
            </div>
          ))}
        </div>

        {role === "pm" ? (
          <PmAnnotation linkLabel="Edit phases" href="/portal/console">
            Edit dates in the console. Moving a date asks for a one-line reason, published
            with the change.
          </PmAnnotation>
        ) : null}
      </Card>
    </Section>
  );
}
