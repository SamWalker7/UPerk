import Link from "next/link";
import type { PortalData } from "@/lib/portal/types";

function Dots({ built, total }: { built: number; total: number }) {
  return (
    <div className="mt-3 flex max-w-[240px] flex-wrap gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < built ? "bg-sky-400" : "bg-white/25"
          }`}
        />
      ))}
    </div>
  );
}

function Stepper({ steps }: { steps: PortalData["steps"] }) {
  return (
    <div className="mt-8">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <span
              className={`h-3 w-3 shrink-0 rounded-full border-2 ${
                s.state === "done"
                  ? "border-sky-400 bg-sky-400"
                  : s.state === "now"
                    ? "border-white bg-white"
                    : "border-white/40 bg-transparent"
              }`}
            />
            {i < steps.length - 1 ? (
              <span
                className={`mx-1 h-px flex-1 ${
                  steps[i].state === "done" ? "bg-sky-400/70" : "bg-white/25"
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
            className={`flex-1 last:flex-none text-[12px] ${
              s.state === "now" ? "font-semibold text-white" : "text-white/60"
            } ${i === steps.length - 1 ? "text-right" : ""}`}
          >
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusHero({ data }: { data: PortalData }) {
  const s = data.status;
  return (
    <div className="mx-auto mt-6 w-full max-w-6xl px-4">
      <div className="overflow-hidden rounded-2xl bg-[#0a2342] p-8 text-white shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-sky-300">
              Current phase
            </p>
            <p className="mt-1 text-3xl font-bold leading-tight">{s.currentPhase}</p>
            <p className="mt-1 text-[13px] text-white/60">{s.phaseSubtitle}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-sky-300">
              Days to launch
            </p>
            <p className="mt-1 text-3xl font-bold leading-tight">
              {s.daysToLaunch}{" "}
              <span className="text-[15px] font-medium text-white/70">{s.launchDate}</span>
            </p>
            <p className="mt-1 text-[13px] text-white/60">{s.launchNote}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-sky-300">
              Screens built
            </p>
            <p className="mt-1 text-3xl font-bold leading-tight">
              {s.screensBuilt}{" "}
              <span className="text-[15px] font-medium text-white/70">
                of {s.screensTotal}
              </span>
            </p>
            <Dots built={s.screensBuilt} total={s.screensTotal} />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              {s.statusLabel}
            </span>
            <p className="mt-2 text-[13px] text-white/70">{s.statusBody}</p>
          </div>
        </div>

        <Stepper steps={data.steps} />

        <div className="mt-8 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3">
          <div className="bg-[#0a2342] p-5">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              This week — shipped
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/75">{s.thisWeek}</p>
          </div>
          <div className="bg-[#0a2342] p-5">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Up next
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/75">{s.upNext}</p>
          </div>
          <div className="bg-[#12305a] p-5">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Needed from you
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/75">
              {s.neededFromYou}
            </p>
            {s.neededLink && s.neededLinkLabel ? (
              <Link
                href={s.neededLink}
                className="mt-2 inline-block text-[13px] font-semibold text-amber-300 underline underline-offset-2"
              >
                {s.neededLinkLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
