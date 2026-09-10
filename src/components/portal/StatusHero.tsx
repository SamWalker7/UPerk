import type { ProjectData } from "@/lib/portal/types";
import { statusTone } from "@/lib/portal/data";
import { StatusChip } from "./ui";
import { OverviewTab } from "./OverviewTab";
import { WeeklyHistoryDrawer } from "./WeeklyHistoryDrawer";
import type { PortalRole } from "@/lib/portal/types";

function Dots({ built, total }: { built: number; total: number }) {
  return (
    <div className="mt-3 flex max-w-[220px] flex-wrap gap-1.5">
      {Array.from({ length: Math.max(total, 0) }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < built ? "bg-[var(--p-accent)]" : "bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}

function Stepper({ steps }: { steps: ProjectData["steps"] }) {
  return (
    <div className="mt-7 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                      : "border border-white/40 bg-transparent"
                }`}
              />
              {i < steps.length - 1 ? (
                <span
                  className={`mx-1 h-px flex-1 ${
                    s.state === "done" ? "bg-[var(--p-accent)]/60" : "bg-white/20"
                  }`}
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 text-[13px] last:flex-none ${
                s.state === "now"
                  ? "font-semibold text-white"
                  : s.state === "done"
                    ? "text-white/80"
                    : "text-white/55"
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

function StatLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">
      {children}
    </p>
  );
}

function Stat({
  label,
  value,
  suffix,
  sub,
  kind = "number",
}: {
  label: string;
  value: string | number;
  suffix?: string;
  sub?: string;
  /** "number" = big numeral; "text" = a word/phrase, sized as a heading */
  kind?: "number" | "text";
}) {
  return (
    <div className="min-w-0">
      <StatLabel>{label}</StatLabel>
      {kind === "text" ? (
        <p className="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
          {value}
        </p>
      ) : (
        <p className="mt-1.5 flex items-baseline gap-2 text-[40px] font-bold leading-none tracking-[-0.03em] text-white sm:text-[44px]">
          {value}
          {suffix ? (
            <span className="text-[14px] font-medium tracking-normal text-white/70">
              {suffix}
            </span>
          ) : null}
        </p>
      )}
      {sub ? (
        <p className="mt-1.5 text-[12px] leading-snug text-white/65">{sub}</p>
      ) : null}
    </div>
  );
}

export function StatusHero({ data, role }: { data: ProjectData; role: PortalRole }) {
  const s = data.status;
  return (
    <section id="overview" className="relative scroll-mt-6 overflow-hidden rounded-2xl bg-[var(--p-hero)] text-[var(--p-hero-text)] shadow-[0_18px_38px_rgba(20,55,86,.16)] [--p-accent:#65b5ee] [--p-accent-weak:#2a577c] [--p-border:#4c7090] [--p-text-dim:var(--p-hero-dim)]">
      <div className="p-5 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="grid flex-1 gap-x-8 gap-y-7 sm:grid-cols-3 sm:gap-x-10">
          <Stat
            kind="text"
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
          <div className="min-w-0">
            <StatLabel>Screens built</StatLabel>
            <p className="mt-1.5 flex items-baseline gap-2 text-[40px] font-bold leading-none tracking-[-0.03em] text-white sm:text-[44px]">
              {s.screensBuilt}
              <span className="text-[14px] font-medium tracking-normal text-white/70">
                of {s.screensTotal}
              </span>
            </p>
            <Dots built={s.screensBuilt} total={s.screensTotal} />
          </div>
        </div>
        <div className="w-full shrink-0 lg:w-[220px]">
          <StatusChip label={s.statusLabel} tone={statusTone(s.statusLabel)} className="bg-white/10 text-white ring-1 ring-white/20" />
          {s.statusBody ? (
            <p className="mt-3 text-[13px] leading-relaxed text-white/75">
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
      <div className="border-t border-white/15 px-5 py-3 text-right sm:px-8">
        <WeeklyHistoryDrawer updates={data.weeklyHistory} className="text-[13px] font-semibold text-[#a9d9fb] underline underline-offset-4 hover:text-white" />
      </div>
    </section>
  );
}
