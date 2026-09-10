"use client";

import { useMemo, useState } from "react";
import type { ProjectHistoryEntry, ProjectHistorySection } from "@/lib/portal/types";
import { formatDate, formatDateTime } from "@/lib/portal/format";

const TITLES: Record<ProjectHistorySection, string> = {
  requests: "Client request history",
  links: "Links & build history",
  plan: "Plan history",
  screens: "Finished screens history",
};

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const text = (value: unknown, fallback = "—") => typeof value === "string" && value.trim() ? value : fallback;

export function SectionHistoryDrawer({
  history,
  section,
  className,
}: {
  history?: ProjectHistoryEntry[];
  section: ProjectHistorySection;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const entries = useMemo(
    () => (history || []).filter((entry) => entry.section === section),
    [history, section],
  );


  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} aria-haspopup="dialog">
        History{entries.length ? ` (${entries.length})` : ""}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label={TITLES[section]}>
          <div aria-hidden className="absolute inset-0 bg-[#061827]/55 backdrop-blur-[1px]" />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[500px] flex-col bg-[var(--p-surface)] shadow-[-16px_0_42px_rgba(6,24,39,.24)]">
            <header className="flex items-start justify-between gap-4 border-b border-[var(--p-border)] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">Previous versions</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">{TITLES[section]}</h2>
                <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">Saved automatically before this section changes.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-xl leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)]" aria-label="Close history">×</button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              {entries.length ? (
                <div className="space-y-5">
                  {entries.map((entry) => (
                    <article key={entry.id} className="relative border-l border-[var(--p-border)] pl-5">
                      <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--p-accent)] ring-4 ring-[var(--p-surface)]" />
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-bold text-[var(--p-text)]">{formatDate(entry.recordedAt)}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--p-text-dim)]">{formatDateTime(entry.recordedAt)} · {entry.recordedBy}</p>
                        </div>
                        <span className="rounded-full bg-[var(--p-surface-2)] px-2 py-1 text-[10px] font-semibold text-[var(--p-text-dim)]">{entry.summary}</span>
                      </div>
                      <div className="mt-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] p-4">
                        <Snapshot section={section} data={entry.data} />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-2)] p-5 text-center">
                  <p className="text-[14px] font-semibold">No previous versions yet</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--p-text-dim)]">The first snapshot will appear after you change and save this section.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function Snapshot({ section, data }: { section: ProjectHistorySection; data: unknown }) {
  if (section === "requests") {
    const requests = list(data);
    if (!requests.length) return <Empty label="No client requests at this point." />;
    return <div className="space-y-3">{requests.map((item, index) => {
      const request = object(item);
      const actions = list(request.actions).map((action) => text(object(action).label, "")).filter(Boolean);
      const response = object(request.response);
      return <div key={text(request.id, String(index))} className="border-b border-[var(--p-border)] pb-3 last:border-0 last:pb-0">
        <div className="flex items-center justify-between gap-2"><p className="text-[13px] font-semibold">{text(request.title)}</p><span className="text-[10px] font-bold uppercase text-[var(--p-text-dim)]">{text(request.status)}</span></div>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[var(--p-text-dim)]">{text(request.body)}</p>
        {actions.length ? <p className="mt-2 text-[11px] text-[var(--p-accent)]">Buttons: {actions.join(" · ")}</p> : null}
        {response.choice ? <p className="mt-1 text-[11px] font-semibold text-[var(--p-ok)]">Response: {text(response.choice)}</p> : null}
      </div>;
    })}</div>;
  }

  if (section === "links") {
    const snapshot = object(data);
    const build = object(snapshot.build);
    const prototype = object(snapshot.prototype);
    return <div className="space-y-2 text-[12px]"><Row label="Build" value={text(build.version)} /><Row label="Build date" value={text(build.date)} /><Row label="Known issues" value={text(build.knownIssues)} /><Row label="Tested on" value={text(build.testedOn)} /><Row label="Prototype" value={text(prototype.prototypeUrl, "Not set")} /><Row label="Figma" value={text(prototype.figmaUrl, "Not set")} /><Row label="Install" value={text(prototype.installUrl, "Not set")} /></div>;
  }

  if (section === "plan") {
    const plan = object(data);
    const phases = list(plan.phases);
    const milestones = list(plan.milestones);
    return <div><Row label="Plan range" value={text(plan.rangeLabel)} /><p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[var(--p-text-dim)]">Phases</p><div className="mt-2 space-y-2">{phases.map((item, index) => { const phase = object(item); return <div key={text(phase.id, String(index))} className="flex items-center justify-between gap-3 rounded-lg bg-[var(--p-surface)] px-3 py-2"><span className="text-[12px] font-semibold">{text(phase.name)}</span><span className="text-[11px] text-[var(--p-text-dim)]">{text(phase.start)} — {text(phase.end)}</span></div>; })}</div>{milestones.length ? <><p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[var(--p-text-dim)]">Milestones</p><div className="mt-2 space-y-2">{milestones.map((item, index) => { const milestone = object(item); return <div key={`${text(milestone.title, "milestone")}-${index}`}><p className="text-[12px] font-semibold">{text(milestone.title)}</p><p className="text-[11px] text-[var(--p-text-dim)]">{text(milestone.body)}</p></div>; })}</div></> : null}</div>;
  }

  const screens = list(data);
  if (!screens.length) return <Empty label="No finished screens at this point." />;
  return <div className="space-y-2">{screens.map((item, index) => { const screen = object(item); return <div key={text(screen.id, String(index))} className="flex items-center justify-between gap-3 rounded-lg bg-[var(--p-surface)] px-3 py-2"><span className="text-[12px] font-semibold">{text(screen.name)}</span><span className="text-[11px] text-[var(--p-text-dim)]">{formatDate(text(screen.date, ""))}</span></div>; })}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 border-b border-[var(--p-border)] py-1.5 last:border-0"><span className="text-[11px] font-semibold text-[var(--p-text-dim)]">{label}</span><span className="max-w-[65%] break-all text-right text-[12px] text-[var(--p-text)]">{value}</span></div>;
}

function Empty({ label }: { label: string }) {
  return <p className="text-[12px] text-[var(--p-text-dim)]">{label}</p>;
}
