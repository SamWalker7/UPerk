import type { ProjectData } from "@/lib/portal/types";
import { statusTone } from "@/lib/portal/data";
import { StatusChip } from "./ui";
import { OverviewTab } from "./OverviewTab";
import type { PortalRole } from "@/lib/portal/types";

function Dots({ built, total }: { built: number; total: number }) {
  return (
    <div className="mt-2 flex max-w-[220px] flex-wrap gap-1.5">
      {Array.from({ length: Math.max(total, 0) }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < built ? "bg-[var(--p-accent)]" : "bg-[var(--p-border)]"
          }`}
        />
      ))}
    </div>
  );
}

function Stepper({ steps }: { steps: ProjectData["steps"] }) {
  return (
    <div className="mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="min-w-[420px]">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center last:flex-none">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  s.state === "done"
                    ? "bg-[var(--p-accent)]"
                    : s.state === "now"
                      ? "bg-[var(--p-accent)] ring-4 ring-[var(--p-accent-weak)]"
                      : "border border-[var(--p-border)] bg-transparent"
                }`}
              />
              {i < steps.length - 1 ? (
                <span
                  className={`mx-1 h-px flex-1 ${
                    s.state === "done"
                      ? "bg-[var(--p-accent)]/50"
                      : "bg-[var(--p-border)]"
                  }`}
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 text-[12px] last:flex-none ${
                s.state === "now"
                  ? "font-semibold text-[var(--p-text)]"
                  : "text-[var(--p-text-dim)]"
              } ${i === steps.length - 1 ? "text-right" : ""}`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  sub,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--p-text-dim)]">
        {label}
      </p>
      <p className="mt-1 text-[38px] font-bold leading-none tracking-[-0.035em] sm:text-[44px]">
        {value}
        {suffix ? (
          <span className="ml-2 text-[14px] font-medium tracking-normal text-[var(--p-text-dim)]">
            {suffix}
          </span>
        ) : null}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[12px] text-[var(--p-text-dim)]">{sub}</p>
      ) : null}
    </div>
  );
}

export function StatusHero({ data, role }: { data: ProjectData; role: PortalRole }) {
  const s = data.status;
  return (
    <section id="overview" className="scroll-mt-6 overflow-hidden rounded-2xl bg-[var(--p-hero)] text-[var(--p-hero-text)] shadow-[0_18px_38px_rgba(20,55,86,.16)] [--p-accent:#65b5ee] [--p-accent-weak:#2a577c] [--p-border:#4c7090] [--p-text-dim:var(--p-hero-dim)]">
      <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid flex-1 gap-6 sm:grid-cols-3 sm:gap-10">
          <Stat
            label="Current phase"
            value={s.currentPhase}
            sub={s.phaseSubtitle}
          />
          <Stat
            label="Days to launch"
            value={s.daysToLaunch}
            suffix={s.launchDate}
            sub={s.launchNote}
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--p-text-dim)]">
              Screens built
            </p>
            <p className="mt-1 text-[38px] font-bold leading-none tracking-[-0.035em] sm:text-[44px]">
              {s.screensBuilt}
              <span className="ml-2 text-[14px] font-medium tracking-normal text-[var(--p-text-dim)]">
                of {s.screensTotal}
              </span>
            </p>
            <Dots built={s.screensBuilt} total={s.screensTotal} />
          </div>
        </div>
        <div className="w-full sm:w-auto sm:text-left">
          <StatusChip label={s.statusLabel} tone={statusTone(s.statusLabel)} className="bg-white/10 text-white ring-1 ring-white/20" />
          {s.statusBody ? (
            <p className="mt-3 text-[12px] leading-relaxed text-[var(--p-hero-dim)] sm:max-w-[220px]">
              {s.statusBody}
            </p>
          ) : null}
        </div>
      </div>

      <Stepper steps={data.steps} />
      </div>
      <div className="grid border-t border-white/15 md:grid-cols-3">
        <OverviewTab data={data} role={role} embedded />
      </div>
    </section>
  );
}
