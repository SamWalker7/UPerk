"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ClientRequest,
  Decision,
  FinishedScreen,
  ProjectData,
} from "@/lib/portal/types";
import { Field, NumberField, Group } from "./fields";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ConsoleEditor({
  initialData,
  slug,
}: {
  initialData: ProjectData;
  slug: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<ProjectData>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "warn" | "err"; text: string } | null>(
    null,
  );

  function patch(fn: (draft: ProjectData) => void) {
    setData((prev) => {
      const next = structuredClone(prev) as ProjectData;
      fn(next);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/portal/api/projects/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage({ kind: "ok", text: "Saved." });
        router.refresh();
      } else if (res.status === 503) {
        setMessage({ kind: "warn", text: body.error || "Read-only in production." });
      } else {
        setMessage({ kind: "err", text: body.error || "Save failed." });
      }
    } catch {
      setMessage({ kind: "err", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  const s = data.status;

  return (
    <div className="mt-6 space-y-4">
      {/* Sticky save bar */}
      <div className="sticky top-0 z-20 -mx-4 flex items-center gap-3 border-b border-[var(--p-border)] bg-[var(--p-bg)]/90 px-4 py-3 backdrop-blur">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {message ? (
          <span
            className={`text-[13px] ${
              message.kind === "ok"
                ? "text-[var(--p-ok)]"
                : message.kind === "warn"
                  ? "text-[var(--p-warn)]"
                  : "text-[var(--p-risk)]"
            }`}
          >
            {message.text}
          </span>
        ) : null}
      </div>

      <Group title="Header">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Project name"
            value={data.project.name}
            onChange={(v) => patch((d) => (d.project.name = v))}
          />
          <Field
            label="Client"
            value={data.project.client}
            onChange={(v) => patch((d) => (d.project.client = v))}
          />
          <Field
            label="Updated by"
            value={data.project.updatedBy}
            onChange={(v) => patch((d) => (d.project.updatedBy = v))}
          />
          <Field
            label="Updated at"
            value={data.project.updatedAt}
            onChange={(v) => patch((d) => (d.project.updatedAt = v))}
          />
        </div>
      </Group>

      <Group title="Status hero">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Current phase"
            value={s.currentPhase}
            onChange={(v) => patch((d) => (d.status.currentPhase = v))}
          />
          <Field
            label="Phase subtitle"
            value={s.phaseSubtitle}
            onChange={(v) => patch((d) => (d.status.phaseSubtitle = v))}
          />
          <NumberField
            label="Days to launch"
            value={s.daysToLaunch}
            onChange={(v) => patch((d) => (d.status.daysToLaunch = v))}
          />
          <Field
            label="Launch date"
            value={s.launchDate}
            onChange={(v) => patch((d) => (d.status.launchDate = v))}
          />
          <Field
            label="Launch note"
            value={s.launchNote}
            onChange={(v) => patch((d) => (d.status.launchNote = v))}
          />
          <NumberField
            label="Screens built"
            value={s.screensBuilt}
            onChange={(v) => patch((d) => (d.status.screensBuilt = v))}
          />
          <NumberField
            label="Screens total"
            value={s.screensTotal}
            onChange={(v) => patch((d) => (d.status.screensTotal = v))}
          />
          <Field
            label="Status label"
            value={s.statusLabel}
            onChange={(v) => patch((d) => (d.status.statusLabel = v))}
          />
        </div>
        <Field
          label="Status body"
          value={s.statusBody}
          onChange={(v) => patch((d) => (d.status.statusBody = v))}
          textarea
        />
        <Field
          label="This week — shipped"
          value={s.thisWeek}
          onChange={(v) => patch((d) => (d.status.thisWeek = v))}
          textarea
        />
        <Field
          label="Up next"
          value={s.upNext}
          onChange={(v) => patch((d) => (d.status.upNext = v))}
          textarea
        />
        <Field
          label="Needed from you"
          value={s.neededFromYou}
          onChange={(v) => patch((d) => (d.status.neededFromYou = v))}
          textarea
        />
      </Group>

      <RequestsEditor
        requests={data.requests}
        onChange={(requests) => patch((d) => (d.requests = requests))}
      />

      <Group title="See it working — links & build">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Prototype URL"
            value={data.prototype.prototypeUrl || ""}
            onChange={(v) => patch((d) => (d.prototype.prototypeUrl = v))}
            placeholder="https://…"
          />
          <Field
            label="Install URL (TestFlight / Play)"
            value={data.prototype.installUrl || ""}
            onChange={(v) => patch((d) => (d.prototype.installUrl = v))}
            placeholder="https://…"
          />
          <Field
            label="Figma URL"
            value={data.prototype.figmaUrl || ""}
            onChange={(v) => patch((d) => (d.prototype.figmaUrl = v))}
            placeholder="https://…"
          />
          <Field
            label="Embed URL (iframe src)"
            value={data.prototype.embedUrl || ""}
            onChange={(v) => patch((d) => (d.prototype.embedUrl = v))}
            placeholder="https://…"
          />
          <Field
            label="Caption"
            value={data.prototype.caption || ""}
            onChange={(v) => patch((d) => (d.prototype.caption = v))}
          />
          <Field
            label="Install button label"
            value={data.prototype.installLabel || ""}
            onChange={(v) => patch((d) => (d.prototype.installLabel = v))}
          />
          <Field
            label="Build version"
            value={data.build.version}
            onChange={(v) => patch((d) => (d.build.version = v))}
          />
          <Field
            label="Build date"
            value={data.build.date}
            onChange={(v) => patch((d) => (d.build.date = v))}
          />
          <NumberField
            label="Build screens built"
            value={data.build.screensBuilt}
            onChange={(v) => patch((d) => (d.build.screensBuilt = v))}
          />
          <NumberField
            label="Build screens total"
            value={data.build.screensTotal}
            onChange={(v) => patch((d) => (d.build.screensTotal = v))}
          />
          <Field
            label="Known issues"
            value={data.build.knownIssues}
            onChange={(v) => patch((d) => (d.build.knownIssues = v))}
          />
          <Field
            label="Tested on"
            value={data.build.testedOn}
            onChange={(v) => patch((d) => (d.build.testedOn = v))}
          />
        </div>
      </Group>

      <PhasesEditor
        plan={data.plan}
        onChange={(plan) => patch((d) => (d.plan = plan))}
      />

      <ScreensEditor
        screens={data.finishedScreens}
        onChange={(screens) => patch((d) => (d.finishedScreens = screens))}
      />

      <DecisionsEditor
        decisions={data.decisions}
        onChange={(decisions) => patch((d) => (d.decisions = decisions))}
      />

      <Group title="Next call">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Label"
            value={data.nextCall?.label || ""}
            onChange={(v) =>
              patch((d) => (d.nextCall = { ...(d.nextCall || {}), label: v }))
            }
          />
          <Field
            label="Agenda URL"
            value={data.nextCall?.agendaUrl || ""}
            onChange={(v) =>
              patch(
                (d) =>
                  (d.nextCall = { label: d.nextCall?.label || "", agendaUrl: v }),
              )
            }
          />
        </div>
      </Group>
    </div>
  );
}

/* ---------- Requests ---------- */

function RequestsEditor({
  requests,
  onChange,
}: {
  requests: ClientRequest[];
  onChange: (r: ClientRequest[]) => void;
}) {
  function update(i: number, fn: (r: ClientRequest) => void) {
    const next = structuredClone(requests);
    fn(next[i]);
    onChange(next);
  }
  function add() {
    onChange([
      ...requests,
      {
        id: uid("req"),
        title: "New request",
        status: "open",
        daysOpen: 0,
        blocking: false,
        body: "",
        actions: [{ label: "Mark as done", kind: "secondary" }],
      },
    ]);
  }

  return (
    <Group title="Waiting on you — client requests">
      {requests.map((r, i) => (
        <div
          key={r.id}
          className="rounded-xl border border-[var(--p-border)] p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Title"
              value={r.title}
              onChange={(v) => update(i, (x) => (x.title = v))}
            />
            <NumberField
              label="Days open"
              value={r.daysOpen}
              onChange={(v) => update(i, (x) => (x.daysOpen = v))}
            />
          </div>
          <div className="mt-3">
            <Field
              label="Body"
              value={r.body}
              onChange={(v) => update(i, (x) => (x.body = v))}
              textarea
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field
              label="Note (yellow line, optional)"
              value={r.note || ""}
              onChange={(v) => update(i, (x) => (x.note = v || undefined))}
            />
            <Field
              label="Sub-note (optional)"
              value={r.subNote || ""}
              onChange={(v) => update(i, (x) => (x.subNote = v || undefined))}
            />
          </div>
          <div className="mt-3">
            <Field
              label="PM note (dashed box)"
              value={r.pmNote || ""}
              onChange={(v) => update(i, (x) => (x.pmNote = v || undefined))}
              textarea
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={r.blocking}
                onChange={(e) => update(i, (x) => (x.blocking = e.target.checked))}
              />
              Blocking now
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={r.status === "done"}
                onChange={(e) =>
                  update(i, (x) => (x.status = e.target.checked ? "done" : "open"))
                }
              />
              Closed
            </label>
            <Field
              label="Action button labels (comma-separated)"
              value={r.actions.map((a) => a.label).join(", ")}
              onChange={(v) =>
                update(
                  i,
                  (x) =>
                    (x.actions = v
                      .split(",")
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((label, idx) => ({
                        label,
                        kind: idx < 2 ? "primary" : "secondary",
                      }))),
                )
              }
            />
            <Field
              label="Option labels (comma-separated, optional)"
              value={(r.options || []).map((o) => o.label).join(", ")}
              onChange={(v) => {
                const labels = v
                  .split(",")
                  .map((l) => l.trim())
                  .filter(Boolean);
                update(
                  i,
                  (x) =>
                    (x.options = labels.length
                      ? labels.map((label) => ({ label }))
                      : undefined),
                );
              }}
            />
          </div>
          <button
            onClick={() => onChange(requests.filter((_, j) => j !== i))}
            className="mt-3 text-[12px] text-[var(--p-risk)] underline underline-offset-2"
          >
            Remove request
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-[13px] font-medium text-[var(--p-accent)] underline underline-offset-2"
      >
        + New client request
      </button>
    </Group>
  );
}

/* ---------- Phases ---------- */

function PhasesEditor({
  plan,
  onChange,
}: {
  plan: ProjectData["plan"];
  onChange: (p: ProjectData["plan"]) => void;
}) {
  function updatePhase(i: number, fn: (p: ProjectData["plan"]["phases"][number]) => void) {
    const next = structuredClone(plan);
    fn(next.phases[i]);
    onChange(next);
  }
  function updateMilestone(i: number, key: "title" | "body", value: string) {
    const next = structuredClone(plan);
    next.milestones[i][key] = value;
    onChange(next);
  }

  return (
    <Group title="The plan — phases & milestones">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field
          label="Range label"
          value={plan.rangeLabel}
          onChange={(v) => onChange({ ...plan, rangeLabel: v })}
        />
        <Field
          label="Axis start (YYYY-MM-DD)"
          value={plan.axisStart}
          onChange={(v) => onChange({ ...plan, axisStart: v })}
        />
        <Field
          label="Axis end (YYYY-MM-DD)"
          value={plan.axisEnd}
          onChange={(v) => onChange({ ...plan, axisEnd: v })}
        />
      </div>
      {plan.phases.map((p, i) => (
        <div
          key={p.id}
          className="grid gap-3 rounded-xl border border-[var(--p-border)] p-4 sm:grid-cols-2"
        >
          <Field
            label="Name"
            value={p.name}
            onChange={(v) => updatePhase(i, (x) => (x.name = v))}
          />
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
              State
            </span>
            <select
              value={p.state}
              onChange={(e) =>
                updatePhase(
                  i,
                  (x) =>
                    (x.state = e.target.value as "done" | "now" | "upcoming"),
                )
              }
              className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px]"
            >
              <option value="done">done</option>
              <option value="now">now</option>
              <option value="upcoming">upcoming</option>
            </select>
          </label>
          <Field
            label="Start (YYYY-MM-DD)"
            value={p.start}
            onChange={(v) => updatePhase(i, (x) => (x.start = v))}
          />
          <Field
            label="End (YYYY-MM-DD)"
            value={p.end}
            onChange={(v) => updatePhase(i, (x) => (x.end = v))}
          />
          <Field
            label="Bar label"
            value={p.rangeLabel || ""}
            onChange={(v) => updatePhase(i, (x) => (x.rangeLabel = v))}
          />
        </div>
      ))}
      {plan.milestones.map((m, i) => (
        <div key={i} className="grid gap-3 sm:grid-cols-2">
          <Field
            label={`Milestone ${i + 1} title`}
            value={m.title}
            onChange={(v) => updateMilestone(i, "title", v)}
          />
          <Field
            label={`Milestone ${i + 1} body`}
            value={m.body}
            onChange={(v) => updateMilestone(i, "body", v)}
          />
        </div>
      ))}
    </Group>
  );
}

/* ---------- Screens ---------- */

function ScreensEditor({
  screens,
  onChange,
}: {
  screens: FinishedScreen[];
  onChange: (s: FinishedScreen[]) => void;
}) {
  function update(i: number, fn: (s: FinishedScreen) => void) {
    const next = structuredClone(screens);
    fn(next[i]);
    onChange(next);
  }
  return (
    <Group title="Just finished — screens">
      {screens.map((sc, i) => (
        <div key={sc.id} className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Name"
            value={sc.name}
            onChange={(v) => update(i, (x) => (x.name = v))}
          />
          <Field
            label="Date"
            value={sc.date}
            onChange={(v) => update(i, (x) => (x.date = v))}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label="Image URL (optional)"
                value={sc.imageUrl || ""}
                onChange={(v) => update(i, (x) => (x.imageUrl = v || undefined))}
              />
            </div>
            <button
              onClick={() => onChange(screens.filter((_, j) => j !== i))}
              className="pb-2 text-[12px] text-[var(--p-risk)] underline underline-offset-2"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() =>
          onChange([
            { id: uid("scr"), name: "New screen", date: "" },
            ...screens,
          ])
        }
        className="text-[13px] font-medium text-[var(--p-accent)] underline underline-offset-2"
      >
        + Add screen
      </button>
    </Group>
  );
}

/* ---------- Decisions ---------- */

function DecisionsEditor({
  decisions,
  onChange,
}: {
  decisions: Decision[];
  onChange: (d: Decision[]) => void;
}) {
  function update(i: number, fn: (d: Decision) => void) {
    const next = structuredClone(decisions);
    fn(next[i]);
    onChange(next);
  }
  return (
    <Group title="Decisions">
      {decisions.map((d, i) => (
        <div
          key={d.id}
          className="rounded-xl border border-[var(--p-border)] p-4"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Date"
              value={d.date}
              onChange={(v) => update(i, (x) => (x.date = v))}
            />
            <Field
              label="Link label (optional)"
              value={d.link?.label || ""}
              onChange={(v) =>
                update(i, (x) => {
                  x.link = v ? { label: v, url: x.link?.url || "#" } : undefined;
                })
              }
            />
            <Field
              label="Link URL (optional)"
              value={d.link?.url || ""}
              onChange={(v) =>
                update(i, (x) => {
                  if (x.link) x.link.url = v;
                  else if (v) x.link = { label: "Link", url: v };
                })
              }
            />
          </div>
          <div className="mt-3">
            <Field
              label="Decision (one line)"
              value={d.body}
              onChange={(v) => update(i, (x) => (x.body = v))}
              textarea
            />
          </div>
          <div className="mt-3">
            <Field
              label="Attribution"
              value={d.attribution}
              onChange={(v) => update(i, (x) => (x.attribution = v))}
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-[12px]">
            <input
              type="checkbox"
              checked={!!d.supersededBy}
              onChange={(e) =>
                update(i, (x) => (x.supersededBy = e.target.checked ? "superseded" : undefined))
              }
            />
            Superseded (kept, greyed out — never deleted)
          </label>
        </div>
      ))}
      <button
        onClick={() =>
          onChange([
            { id: uid("dec"), date: "", body: "", attribution: "" },
            ...decisions,
          ])
        }
        className="text-[13px] font-medium text-[var(--p-accent)] underline underline-offset-2"
      >
        + Log a decision
      </button>
    </Group>
  );
}
