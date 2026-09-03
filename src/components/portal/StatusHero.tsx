import type { ProjectData } from "@/lib/portal/types";
import { statusTone } from "@/lib/portal/data";
import { StatusChip } from "./ui";

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
    <div className="mt-6">
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
      <p className="mt-1 text-2xl font-bold leading-tight">
        {value}
        {suffix ? (
          <span className="ml-1 text-[14px] font-medium text-[var(--p-text-dim)]">
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

export function StatusHero({ data }: { data: ProjectData }) {
  const s = data.status;
  return (
    <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-hero)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid flex-1 gap-6 sm:grid-cols-3">
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
            <p className="mt-1 text-2xl font-bold leading-tight">
              {s.screensBuilt}
              <span className="ml-1 text-[14px] font-medium text-[var(--p-text-dim)]">
                of {s.screensTotal}
              </span>
            </p>
            <Dots built={s.screensBuilt} total={s.screensTotal} />
          </div>
        </div>
        <div className="text-right">
          <StatusChip label={s.statusLabel} tone={statusTone(s.statusLabel)} />
          {s.statusBody ? (
            <p className="mt-2 max-w-[240px] text-[12px] text-[var(--p-text-dim)]">
              {s.statusBody}
            </p>
          ) : null}
        </div>
      </div>

      <Stepper steps={data.steps} />
    </div>
  );
}
