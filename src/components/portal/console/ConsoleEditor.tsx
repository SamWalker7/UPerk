"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ClientRequest,
  Decision,
  FinishedScreen,
  ProjectData,
  RequestAction,
} from "@/lib/portal/types";
import {
  AddButton,
  CheckField,
  DateField,
  Field,
  Grid,
  ItemCard,
  NumberField,
  ReadOnlyStat,
  SelectField,
} from "./fields";
import { Section } from "./Section";
import { Spinner } from "../Spinner";
import { ConfirmDialog } from "./ConfirmDialog";
import { DecisionDialog, type DecisionInput } from "./DecisionDialog";
import { type NewRequestInput } from "./RequestDialog";
import { DecisionHistoryDrawer } from "./DecisionHistoryDrawer";
import { SectionHistoryDrawer } from "./SectionHistoryDrawer";
import { formatDate, formatDateTime } from "@/lib/portal/format";
import { WeeklyHistoryDrawer } from "../WeeklyHistoryDrawer";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/** ISO timestamp; the portal formats it for display via formatDateTime(). */
function nowStamp() {
  return new Date().toISOString();
}

/** Calendar-day difference, clamped to zero for launch dates in the past. */
function daysUntil(isoDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return 0;
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const [year, month, day] = isoDate.split("-").map(Number);
  return Math.max(0, Math.round((Date.UTC(year, month - 1, day) - todayUtc) / 86_400_000));
}

const UPDATED_BY_KEY = "uperk.console.updatedBy";

const PHASE_OPTIONS = [
  "Discovery",
  "Design",
  "Build",
  "Beta",
  "Launch",
  "Support",
] as const;

type StatusLabel = "On track" | "Watch" | "At risk";

const SECTION_KEYS = [
  "header",
  "status",
  "statusMeta",
  "requests",
  "links",
  "plan",
  "screens",
  "decisions",
  "notes",
  "nextCall",
] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

export default function ConsoleEditor({
  initialData,
  slug,
}: {
  initialData: ProjectData;
  slug: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState<ProjectData>(initialData);
  const [data, setData] = useState<ProjectData>(initialData);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "warn" | "err";
    text: string;
  } | null>(null);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    header: true,
    status: true,
    statusMeta: true,
    requests: true,
    links: true,
    plan: true,
    screens: true,
    decisions: true,
    notes: true,
    nextCall: true,
  });
  // Optional display name remembered locally for the updated-by metadata.
  const [pmName, setPmName] = useState("");
  const [decisionDialog, setDecisionDialog] = useState<{ supersedes?: string } | null>(null);

  // Field-level dirtiness, per section, via JSON compare of the relevant slice.
  // "Updated by / at" are stamped on save, not user-edited, so they don't
  // count toward the Header section being dirty.
  const dirtyMap = useMemo(() => {
    const eq = (a: unknown, b: unknown) =>
      JSON.stringify(a) === JSON.stringify(b);
    const headerFields = (p: ProjectData["project"]) => ({
      name: p.name,
      client: p.client,
    });
    return {
      header: !eq(headerFields(data.project), headerFields(saved.project)),
      status: !eq(data.status, saved.status),
      statusMeta: !eq(data.status, saved.status),
      requests: !eq(data.requests, saved.requests),
      links:
        !eq(data.prototype, saved.prototype) || !eq(data.build, saved.build),
      plan: !eq(data.plan, saved.plan),
      screens: !eq(data.finishedScreens, saved.finishedScreens),
      // Decisions are committed immediately through the audit-log endpoint.
      decisions: false,
      notes: !eq(data.notes, saved.notes),
      nextCall: !eq(data.nextCall, saved.nextCall),
    } as Record<SectionKey, boolean>;
  }, [data, saved]);

  const dirty = Object.values(dirtyMap).some(Boolean);

  // Warn on tab close / hard nav with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Restore the PM's remembered name.
  useEffect(() => {
    try {
      const remembered = localStorage.getItem(UPDATED_BY_KEY);
      if (remembered) setPmName(remembered);
    } catch {
      /* ignore */
    }
  }, []);

  const patch = useCallback((fn: (draft: ProjectData) => void) => {
    setData((prev) => {
      const next = structuredClone(prev) as ProjectData;
      fn(next);
      return next;
    });
    setMessage(null);
  }, []);

  const savingRef = useRef(false);
  async function save() {
    if (savingRef.current) return;

    // The backend stamps the authenticated PM identity. A remembered display
    // name is optional and must never prevent a project save.
    const who = pmName;

    savingRef.current = true;
    setSaving(true);
    setMessage(null);

    const payload = structuredClone(data) as ProjectData;
    payload.project.updatedAt = nowStamp();
    payload.project.updatedBy = who || payload.project.updatedBy || "PM";
    // Send only changed sections. In particular, this prevents an unchanged
    // uploaded screen image from making an ordinary text save exceed the API
    // gateway request-size limit.
    const changes: Record<string, unknown> = {};
    const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
    const sections: Array<keyof ProjectData> = [
      "project", "status", "steps", "requests", "build", "prototype",
      "plan", "decisionsIntro", "nextCall", "notes",
    ];
    for (const section of sections) {
      if (!same(payload[section], saved[section])) changes[section] = payload[section];
    }

    try {
      // Screens are saved one at a time so projects with many images never
      // combine them into one request that exceeds the 1 MB gateway limit.
      const oldScreens = new Map(saved.finishedScreens.map((screen) => [screen.id, screen]));
      for (const screen of payload.finishedScreens) {
        const old = oldScreens.get(screen.id);
        const endpoint = old
          ? `/portal/api/projects/${slug}/screens/${screen.id}`
          : `/portal/api/projects/${slug}/screens`;
        if (!old || !same(screen, old)) {
          const screenRes = await fetch(endpoint, {
            method: old ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(screen),
          });
          if (!screenRes.ok) {
            const screenBody = await screenRes.json().catch(() => ({}));
            throw new Error(screenRes.status === 413 ? "This screen image is too large. Choose a smaller image or use an image URL." : screenBody.error || "Could not save screen.");
          }
        }
      }
      const res = await fetch(`/portal/api/projects/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.data) {
        const persisted = body.data as ProjectData;
        setData(persisted);
        setSaved(persisted);
        setMessage({ kind: "ok", text: "Saved as a draft. Publish when ready for the client." });
        router.refresh();
      } else if (res.ok) {
        setMessage({ kind: "err", text: "Save could not be verified. Please try again." });
      } else if (res.status === 503) {
        setMessage({
          kind: "warn",
          text: body.error || "Read-only in production.",
        });
      } else {
        setMessage({ kind: "err", text: res.status === 413 ? "An image is too large to save. Use a smaller image, let the portal compress it, or paste an image URL." : body.error || "Save failed." });
      }
    } catch {
      setMessage({ kind: "err", text: "Network error." });
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }

  function discard() {
    if (!dirty) return;
    if (!confirm("Discard all unsaved changes?")) return;
    setData(saved);
    setMessage(null);
  }

  async function logDecision(input: DecisionInput, supersedes?: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/portal/api/projects/${slug}/decisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, ...(supersedes ? { supersedes } : {}) }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Could not log decision.");
      const decision = result.decision as Decision;
      const apply = (project: ProjectData) => {
        if (supersedes) {
          const prior = project.decisions.find((item) => item.id === supersedes);
          if (prior) prior.supersededBy = result.id;
        }
        project.decisions.push(decision);
      };
      setData((previous) => { const next = structuredClone(previous) as ProjectData; apply(next); return next; });
      setSaved((previous) => { const next = structuredClone(previous) as ProjectData; apply(next); return next; });
      setMessage({ kind: "ok", text: supersedes ? "Replacement decision logged." : "Decision logged." });
      router.refresh();
    } catch (error) {
      setMessage({ kind: "err", text: error instanceof Error ? error.message : "Could not log decision." });
      throw error;
    } finally { setSaving(false); }
  }

  async function publish() {
    if (dirty) { setMessage({ kind: "warn", text: "Save or discard your edits before publishing." }); return; }
    setPublishing(true); setMessage(null);
    try {
      const res = await fetch(`/portal/api/projects/${slug}/publish`, { method: "POST" });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Could not publish changes.");
      setData((previous) => ({ ...previous, publication: result.publication }));
      setSaved((previous) => ({ ...previous, publication: result.publication }));
      setMessage({ kind: "ok", text: "Published to the client portal." });
      router.refresh();
    } catch (error) {
      setMessage({ kind: "err", text: error instanceof Error ? error.message : "Could not publish changes." });
    } finally { setPublishing(false); }
  }

  // ---- Destructive deletes (dedicated PM-only endpoints, modal-confirmed) ----

  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false);

  async function deleteProject() {
    const res = await fetch(`/portal/api/projects/${slug}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Could not delete the project.");
    }
    // Leave the console for the projects list — this project is gone.
    router.push("/console");
    router.refresh();
  }

  /** DELETE a persisted list item, then drop it from both draft and saved state. */
  async function deleteItem(
    path: string,
    apply: (d: ProjectData) => void,
    label: string,
  ) {
    const res = await fetch(path, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Could not delete ${label}.`);
    }
    setData((prev) => {
      const next = structuredClone(prev) as ProjectData;
      apply(next);
      return next;
    });
    setSaved((prev) => {
      const next = structuredClone(prev) as ProjectData;
      apply(next);
      return next;
    });
    setMessage({ kind: "ok", text: `${label} deleted.` });
    router.refresh();
  }

  const deleteRequest = (id: string) =>
    deleteItem(
      `/portal/api/projects/${slug}/requests/${id}`,
      (d) => (d.requests = d.requests.filter((r) => r.id !== id)),
      "Request",
    );

  const deleteScreen = (id: string) =>
    deleteItem(
      `/portal/api/projects/${slug}/screens/${id}`,
      (d) =>
        (d.finishedScreens = d.finishedScreens.filter((sc) => sc.id !== id)),
      "Screen",
    );

  // An id that exists in the last-saved data is persisted on the backend and
  // must go through the DELETE endpoint; anything else is a local-only draft
  // row that we can just drop.
  const savedRequestIds = useMemo(
    () => new Set(saved.requests.map((r) => r.id)),
    [saved.requests],
  );
  const savedScreenIds = useMemo(
    () => new Set(saved.finishedScreens.map((sc) => sc.id)),
    [saved.finishedScreens],
  );

  // Cmd/Ctrl+S to save.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, saving, data, pmName]);

  const toggle = (k: SectionKey) =>
    setOpen((o) => ({ ...o, [k]: !o[k] }));
  const setAll = (v: boolean) =>
    setOpen(
      Object.fromEntries(SECTION_KEYS.map((k) => [k, v])) as Record<
        SectionKey,
        boolean
      >,
    );

  const s = data.status;
  const openRequests = data.requests.filter((r) => r.status === "open");

  // Count of pending, not-yet-published changes: the backend's own tally plus
  // any local unsaved section edits it hasn't seen.
  const localDirtyCount = Object.values(dirtyMap).filter(Boolean).length;
  const unpublishedCount =
    (data.publication?.unpublishedChanges ?? 0) + localDirtyCount;
  const lastPublished = data.publication?.lastPublishedAt;
  const clientNames = data.project.client || "the client";

  return (
    <div className="console-editor mt-0 grid gap-x-8 gap-y-8 pb-12 lg:grid-cols-2">
      {/* Publish state */}
      <div className="console-publish rounded-2xl bg-[#10395a] px-6 py-5 text-white shadow-[0_18px_38px_rgba(20,55,86,.16)] lg:col-span-2">
        <div className="flex flex-col gap-x-10 gap-y-5 lg:flex-row lg:items-start">
          <div className="min-w-[220px] shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#63afe7]">
              Publish state
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-[24px] font-bold leading-none tracking-[-0.02em]">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  unpublishedCount > 0 ? "bg-[#efa72f]" : "bg-[#3fbf7f]"
                }`}
              />
              {unpublishedCount > 0
                ? `${unpublishedCount} unpublished`
                : "All published"}
            </p>
            <p className="mt-2 text-[12px] text-[#b8d0e5]">
              {lastPublished
                ? `Last published ${formatDateTime(lastPublished)}`
                : "Nothing published yet"}
            </p>
          </div>

          <p className="max-w-[320px] text-[13px] leading-relaxed text-[#d5e5f3]">
            Edits stay in draft until you publish. Publishing sends one digest
            email to{" "}
            <span className="font-semibold text-white">{clientNames}</span> —
            never one per edit.
          </p>

          <div className="flex flex-col gap-2 lg:ml-auto lg:items-end">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={publish}
                disabled={saving || publishing || unpublishedCount === 0}
                title="Send the current draft to the client portal"
                className="flex h-10 items-center gap-2 rounded-lg bg-[#0b86d9] px-4 text-[13px] font-semibold text-white hover:bg-[#0876c2] disabled:opacity-40"
              >
                {publishing ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" />
                    Publishing…
                  </>
                ) : unpublishedCount > 0 ? (
                  `Publish ${unpublishedCount} change${unpublishedCount === 1 ? "" : "s"}`
                ) : (
                  "Publish changes"
                )}
              </button>
              <a
                href={`/portal/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center rounded-lg border border-white/25 px-3 text-[13px] font-semibold text-white hover:bg-white/10"
              >
                Preview as client
              </a>
            </div>
            {message ? (
              <span
                className={
                  "text-[12px] " +
                  (message.kind === "ok"
                    ? "text-[#7fd9a8]"
                    : message.kind === "warn"
                      ? "text-[#f6c667]"
                      : "text-[#f4a3a3]")
                }
              >
                {message.text}
              </span>
            ) : null}
          </div>

          <div className="hidden shrink-0 text-[12px] leading-relaxed text-[#b8d0e5] xl:block xl:max-w-[220px]">
            <span className="font-semibold text-white">Admin</span> full access ·{" "}
            <span className="font-semibold text-white">PM</span> all but billing
            and roles ·{" "}
            <span className="font-semibold text-white">Client</span> read plus
            replies
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/12 pt-3 text-[12px] text-[#9fbdd6]">
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="rounded-md px-2 py-1 font-semibold text-white underline underline-offset-2 hover:bg-white/10 disabled:opacity-40 disabled:no-underline"
          >
            {saving ? "Saving…" : dirty ? "Save draft" : "Saved"}
          </button>
          {dirty ? (
            <button
              onClick={discard}
              disabled={saving}
              className="rounded-md px-2 py-1 hover:bg-white/10 disabled:opacity-40"
            >
              Discard edits
            </button>
          ) : null}
          <span className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setAll(true)}
              className="underline underline-offset-2 hover:text-white"
            >
              Expand all
            </button>
            <button
              onClick={() => setAll(false)}
              className="underline underline-offset-2 hover:text-white"
            >
              Collapse all
            </button>
          </span>
        </div>
      </div>

      {/* ---------- Header ---------- */}
      <Section
        title="Header"
        dirty={dirtyMap.header}
        open={open.header}
        onToggle={() => toggle("header")}
        summary={data.project.name}
      >
        <Grid>
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
        </Grid>
        <div className="grid gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)]/40 p-4 sm:grid-cols-2">
          <ReadOnlyStat
            label="Updated by"
            value={saved.project.updatedBy || "—"}
            note={pmName ? undefined : "asked once on first save"}
          />
          <ReadOnlyStat
            label="Updated at"
            value={formatDateTime(saved.project.updatedAt) || "—"}
            note="stamped automatically on save"
          />
        </div>
        {pmName ? (
          <p className="text-[12px] text-[var(--p-text-dim)]">
            Saving as <span className="font-medium text-[var(--p-text)]">{pmName}</span>.{" "}
            <button
              type="button"
              onClick={() => {
                const next = (
                  window.prompt("Your name (shown as “Updated by”)", pmName) || ""
                ).trim();
                if (!next) return;
                setPmName(next);
                try {
                  localStorage.setItem(UPDATED_BY_KEY, next);
                } catch {
                  /* ignore */
                }
              }}
              className="underline underline-offset-2 hover:text-[var(--p-text)]"
            >
              Change
            </button>
          </p>
        ) : null}
      </Section>

      {/* ---------- This week (weekly update composer) ---------- */}
      <Section
        title="This week"
        dirty={dirtyMap.status}
        open={open.status}
        onToggle={() => toggle("status")}
        summary="Draft — shows in the client header"
        headerAction={
          <WeeklyHistoryDrawer
            updates={data.weeklyHistory}
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--p-accent)] shadow-sm hover:bg-[var(--p-accent-weak)]"
          />
        }
      >
        <ThisWeekComposer
          status={s}
          lastWeek={data.weeklyHistory?.[0]}
          onChange={(fn) => patch((d) => fn(d.status))}
          onSave={save}
          saving={saving}
          dirty={dirtyMap.status}
          updatedBy={saved.project.updatedBy}
          updatedAt={saved.project.updatedAt}
        />
      </Section>

      {/* ---------- Phases & status ---------- */}
      <Section
        title="Phases & status"
        dirty={dirtyMap.status}
        open={open.statusMeta}
        onToggle={() => toggle("statusMeta")}
        summary="Drives the client header and plan chart"
      >
        <PhasesStatusEditor
          status={s}
          savedStatus={saved.status}
          onChange={(fn) => patch((d) => fn(d.status))}
          onSave={save}
          onRevert={discard}
          saving={saving}
          dirty={dirtyMap.status}
        />
      </Section>

      {/* ---------- Client requests ---------- */}
      <Section
        title="Client requests"
        dirty={dirtyMap.requests}
        open={open.requests}
        onToggle={() => toggle("requests")}
        headerAction={
          <SectionHistoryDrawer
            history={data.projectHistory}
            section="requests"
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--p-accent)] shadow-sm hover:bg-[var(--p-accent-weak)]"
          />
        }
        summary={`${openRequests.length} open · ${data.requests.length - openRequests.length} closed`}
      >
        <RequestsEditor
          requests={data.requests}
          onChange={(requests) => patch((d) => (d.requests = requests))}
          isPersisted={(id) => savedRequestIds.has(id)}
          onDelete={deleteRequest}
          onSave={save}
          saving={saving}
        />
      </Section>

      {/* ---------- Preview & build links ---------- */}
      <Section
        title="Preview & build links"
        dirty={dirtyMap.links}
        open={open.links}
        onToggle={() => toggle("links")}
        summary={'Feeds "See it working"'}
        headerAction={
          <SectionHistoryDrawer
            history={data.projectHistory}
            section="links"
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--p-accent)] shadow-sm hover:bg-[var(--p-accent-weak)]"
          />
        }
      >
        <LinksEditor
          prototype={data.prototype}
          build={data.build}
          onChange={(fn) =>
            patch((d) => fn(d.prototype, d.build))
          }
          onSave={save}
          saving={saving}
          dirty={dirtyMap.links}
        />
      </Section>

      {/* ---------- Plan ---------- */}
      <Section
        title="The plan — phases & milestones"
        badge={data.plan.phases.length}
        dirty={dirtyMap.plan}
        open={open.plan}
        onToggle={() => toggle("plan")}
        summary={data.plan.rangeLabel}
        headerAction={
          <SectionHistoryDrawer
            history={data.projectHistory}
            section="plan"
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--p-accent)] shadow-sm hover:bg-[var(--p-accent-weak)]"
          />
        }
      >
        <PhasesEditor
          plan={data.plan}
          onChange={(plan) => patch((d) => (d.plan = plan))}
        />
      </Section>

      {/* ---------- Finished screens ---------- */}
      <Section
        title="Finished screens"
        dirty={dirtyMap.screens}
        open={open.screens}
        onToggle={() => toggle("screens")}
        summary={'Feeds "Just finished"'}
        headerAction={
          <SectionHistoryDrawer
            history={data.projectHistory}
            section="screens"
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--p-accent)] shadow-sm hover:bg-[var(--p-accent-weak)]"
          />
        }
      >
        <ScreensEditor
          screens={data.finishedScreens}
          onChange={(screens) => patch((d) => (d.finishedScreens = screens))}
          isPersisted={(id) => savedScreenIds.has(id)}
          onDelete={deleteScreen}
          onSave={save}
          saving={saving}
          dirty={dirtyMap.screens}
        />
      </Section>

      {/* ---------- Notes ---------- */}
      <Section
        title="Notes"
        dirty={dirtyMap.notes}
        open={open.notes}
        onToggle={() => toggle("notes")}
        summary="Choose who sees each note"
      >
        <NotesEditor
          notes={data.notes || []}
          onChange={(notes) => patch((d) => (d.notes = notes))}
          onSave={save}
          saving={saving}
        />
      </Section>

      {/* ---------- Log a decision ---------- */}
      <Section
        title="Log a decision"
        dirty={false}
        open={open.decisions}
        onToggle={() => toggle("decisions")}
        summary={`Append-only · ${data.decisions.length} ${data.decisions.length === 1 ? "entry" : "entries"}`}
        headerAction={
          <DecisionHistoryDrawer
            decisions={data.decisions}
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--p-accent)] shadow-sm hover:bg-[var(--p-accent-weak)]"
          />
        }
      >
        <DecisionComposer
          decisions={data.decisions}
          onLog={(input) => logDecision(input)}
          onSupersede={(id) => setDecisionDialog({ supersedes: id })}
          busy={saving}
        />
      </Section>

      {/* ---------- Next call ---------- */}
      <Section
        title="Next call"
        dirty={dirtyMap.nextCall}
        open={open.nextCall}
        onToggle={() => toggle("nextCall")}
        summary={data.nextCall?.label || "not set"}
      >
        <Grid>
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
            placeholder="https://…"
          />
        </Grid>
      </Section>

      {/* ---------- Who can do what ---------- */}
      <section className="console-editor__perms">
        <h2 className="pb-3 text-[18px] font-bold tracking-tight">
          Who can do what
        </h2>
        <PermissionsTable />
      </section>

      {/* ---------- Danger zone ---------- */}
      <section className="console-editor__danger rounded-2xl border border-[var(--p-risk)]/40 bg-[var(--p-risk-bg)]/40 p-4 sm:p-5">
        <h2 className="text-[14px] font-bold text-[var(--p-risk)]">Danger zone</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[var(--p-text)]">
              Delete this project
            </p>
            <p className="text-[12px] text-[var(--p-text-dim)]">
              Removes {saved.project.name} and everything in it. This cannot be
              undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDeleteProject(true)}
            className="shrink-0 rounded-lg border border-[var(--p-risk)] px-3.5 py-2 text-[13px] font-semibold text-[var(--p-risk)] hover:bg-[var(--p-risk)] hover:text-white"
          >
            Delete project
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={confirmDeleteProject}
        title="Delete this project?"
        body={
          <>
            <span className="font-medium text-[var(--p-text)]">
              {saved.project.name}
            </span>{" "}
            and all of its requests, screens, decisions and plan will be
            permanently deleted. This cannot be undone.
          </>
        }
        confirmLabel="Delete project"
        confirmPhrase={saved.slug}
        onConfirm={deleteProject}
        onClose={() => setConfirmDeleteProject(false)}
      />
      <DecisionDialog
        open={decisionDialog !== null}
        superseding={decisionDialog?.supersedes ? data.decisions.find((decision) => decision.id === decisionDialog.supersedes) : null}
        onSubmit={(input) => logDecision(input, decisionDialog?.supersedes)}
        onClose={() => setDecisionDialog(null)}
      />
    </div>
  );
}

/* ---------- This week composer ---------- */

function relTime(iso: string | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  return formatDate(iso);
}

function ThisWeekComposer({
  status,
  lastWeek,
  onChange,
  onSave,
  saving,
  dirty,
  updatedBy,
  updatedAt,
}: {
  status: ProjectData["status"];
  lastWeek?: { thisWeek: string; upNext: string; neededFromYou: string };
  onChange: (fn: (s: ProjectData["status"]) => void) => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  updatedBy: string;
  updatedAt: string;
}) {
  const fields: Array<{
    key: "thisWeek" | "upNext" | "neededFromYou";
    label: string;
    hint: string;
    placeholder: string;
  }> = [
    {
      key: "thisWeek",
      label: "Shipped",
      hint: "Plain language. No ticket numbers, no framework names.",
      placeholder: "What went out this week?",
    },
    {
      key: "upNext",
      label: "Up next",
      hint: "One or two concrete things the client will see next.",
      placeholder: "What's next?",
    },
    {
      key: "neededFromYou",
      label: "Needed from the client",
      hint: "Linked to the open request below, so the client sees one ask in two places, not two asks.",
      placeholder: "What do you need from them, if anything?",
    },
  ];

  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <div key={f.key}>
          <Field
            label={f.label}
            value={status[f.key]}
            onChange={(v) => onChange((s) => (s[f.key] = v))}
            textarea
            rows={3}
            placeholder={f.placeholder}
          />
          <p className="mt-1.5 text-[12px] text-[var(--p-text-dim)]">{f.hint}</p>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--p-border)] pt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
        >
          {saving ? (
            <>
              <Spinner className="h-3.5 w-3.5" />
              Saving…
            </>
          ) : (
            "Save draft"
          )}
        </button>
        {lastWeek ? (
          <button
            type="button"
            onClick={() => {
              onChange((s) => {
                s.thisWeek = lastWeek.thisWeek;
                s.upNext = lastWeek.upNext;
                s.neededFromYou = lastWeek.neededFromYou;
              });
            }}
            className="h-9 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 text-[13px] font-medium hover:bg-[var(--p-surface-2)]"
          >
            Copy last week&apos;s
          </button>
        ) : null}
        {updatedBy ? (
          <span className="ml-auto text-[12px] text-[var(--p-text-dim)]">
            Edited by {updatedBy}
            {relTime(updatedAt) ? `, ${relTime(updatedAt)}` : ""}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Phases & status ---------- */

const STATUS_RADIO: Array<{ value: StatusLabel; dot: string }> = [
  { value: "On track", dot: "bg-[var(--p-ok)]" },
  { value: "Watch", dot: "bg-[var(--p-warn)]" },
  { value: "At risk", dot: "bg-[var(--p-risk)]" },
];

function PhasesStatusEditor({
  status,
  savedStatus,
  onChange,
  onSave,
  onRevert,
  saving,
  dirty,
}: {
  status: ProjectData["status"];
  savedStatus: ProjectData["status"];
  onChange: (fn: (s: ProjectData["status"]) => void) => void;
  onSave: () => void;
  onRevert: () => void;
  saving: boolean;
  dirty: boolean;
}) {
  const [screensText, setScreensText] = useState(
    `${status.screensBuilt} / ${status.screensTotal}`,
  );
  useEffect(() => {
    setScreensText(`${status.screensBuilt} / ${status.screensTotal}`);
  }, [status.screensBuilt, status.screensTotal]);

  // A reason is required when the launch date or the status label changes.
  const rank = (l: string) =>
    l === "On track" ? 0 : l === "Watch" ? 1 : 2;
  const needsReason =
    status.launchDate !== savedStatus.launchDate ||
    rank(status.statusLabel) > rank(savedStatus.statusLabel);

  return (
    <div className="space-y-4">
      <Grid>
        <SelectField
          label="Current phase"
          value={status.currentPhase}
          options={PHASE_OPTIONS}
          onChange={(v) => onChange((s) => (s.currentPhase = v))}
        />
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
            Launch date
          </span>
          <input
            type="date"
            value={
              /^\d{4}-\d{2}-\d{2}$/.test(status.launchDate)
                ? status.launchDate
                : ""
            }
            onChange={(e) =>
              onChange((s) => {
                s.launchDate = e.target.value;
                s.daysToLaunch = daysUntil(e.target.value);
              })
            }
            className="w-full rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)]"
          />
        </label>
      </Grid>

      <label className="block">
        <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
          Screens built / total
        </span>
        <input
          value={screensText}
          onChange={(e) => setScreensText(e.target.value)}
          onBlur={() => {
            const m = screensText.match(/(\d+)\s*\/\s*(\d+)/);
            if (m) {
              onChange((s) => {
                s.screensBuilt = Number(m[1]);
                s.screensTotal = Number(m[2]);
              });
            }
          }}
          placeholder="11 / 18"
          className="w-full rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)] sm:max-w-[280px]"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-[12px] font-medium text-[var(--p-text-dim)]">
          Status shown to the client
        </span>
        <div className="flex flex-wrap gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-2)]/60 p-1">
          {STATUS_RADIO.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-[13px] ${
                status.statusLabel === o.value
                  ? "bg-[var(--p-surface)] font-semibold shadow-sm"
                  : "text-[var(--p-text-dim)]"
              }`}
            >
              <input
                type="radio"
                name="status-label"
                checked={status.statusLabel === o.value}
                onChange={() => onChange((s) => (s.statusLabel = o.value))}
                className="sr-only"
              />
              <span className={`h-1.5 w-1.5 rounded-full ${o.dot}`} />
              {o.value === "At risk" ? "Off track" : o.value}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-[var(--p-warn-bg)] px-4 py-3 text-[13px] leading-relaxed text-[var(--p-warn)]">
        <span className="mr-1 inline-block h-2 w-2 rounded-full bg-current align-middle" />
        Moving a date or dropping the status below On track requires a one-line
        reason. It publishes with the change so the client always sees why, not
        just what.
      </div>

      <Field
        label="Reason for this change"
        value={status.launchNote}
        onChange={(v) => onChange((s) => (s.launchNote = v))}
        placeholder="Required only when a date or status changes"
        invalid={needsReason && !status.launchNote.trim()}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--p-border)] pt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={
            saving ||
            !dirty ||
            (needsReason && !status.launchNote.trim())
          }
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
        >
          {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
          Save phase changes
        </button>
        {dirty ? (
          <button
            type="button"
            onClick={onRevert}
            className="h-9 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 text-[13px] font-medium hover:bg-[var(--p-surface-2)]"
          >
            Revert to published
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Who can do what ---------- */

function PermissionsTable() {
  const rows: Array<[string, string, string, string]> = [
    ["Edit “this week”, phases, dates", "Yes", "Yes", "No"],
    ["Log or supersede a decision", "Yes", "Yes", "Comment only"],
    ["Add Figma and build links, screenshots", "Yes", "Yes", "No"],
    ["Publish to clients", "Yes", "Yes", "—"],
    ["Answer a request, reply to a note", "Yes", "Yes", "Yes"],
    ["Change roles, billing", "Yes", "No", "No"],
  ];
  const cell = (v: string) =>
    v === "Yes" ? (
      <span className="text-[var(--p-text)]">Yes</span>
    ) : (
      <span className="text-[var(--p-text-dim)]">{v}</span>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[var(--p-border)] bg-[var(--p-surface-2)]/50 text-left">
            <th className="px-4 py-3 font-semibold">Action</th>
            <th className="px-4 py-3 font-semibold">Admin</th>
            <th className="px-4 py-3 font-semibold">PM</th>
            <th className="px-4 py-3 font-semibold">Client</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([action, admin, pm, client], i) => (
            <tr
              key={action}
              className={
                i < rows.length - 1 ? "border-b border-[var(--p-border)]" : ""
              }
            >
              <td className="px-4 py-3">{action}</td>
              <td className="px-4 py-3">{cell(admin)}</td>
              <td className="px-4 py-3">{cell(pm)}</td>
              <td className="px-4 py-3">{cell(client)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Client requests ---------- */

function RequestsEditor({
  requests,
  onChange,
  isPersisted,
  onDelete,
  onSave,
  saving,
}: {
  requests: ClientRequest[];
  onChange: (r: ClientRequest[]) => void;
  isPersisted: (id: string) => boolean;
  onDelete: (id: string) => Promise<void>;
  onSave: () => void;
  saving: boolean;
}) {
  const [pendingDelete, setPendingDelete] = useState<ClientRequest | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  function update(id: string, fn: (r: ClientRequest) => void) {
    onChange(
      requests.map((r) => {
        if (r.id !== id) return r;
        const copy = structuredClone(r);
        fn(copy);
        return copy;
      }),
    );
  }

  function add(input: NewRequestInput) {
    const created: ClientRequest = { id: uid("req"), status: "open", ...input };
    onChange([...requests, created]);
    setEditing(created.id);
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <RequestRow
          key={r.id}
          request={r}
          expanded={editing === r.id}
          onToggleEdit={() => setEditing(editing === r.id ? null : r.id)}
          onClose={() => update(r.id, (x) => (x.status = "done"))}
          onReopen={() => update(r.id, (x) => (x.status = "open"))}
          onChange={(fn) => update(r.id, fn)}
          onDelete={() =>
            isPersisted(r.id)
              ? setPendingDelete(r)
              : onChange(requests.filter((x) => x.id !== r.id))
          }
        />
      ))}

      <NewRequestForm onAdd={add} onSave={onSave} saving={saving} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this request?"
        body={
          <>
            <span className="font-medium text-[var(--p-text)]">
              {pendingDelete?.title}
            </span>{" "}
            will be permanently removed from the client&apos;s portal. This
            cannot be undone.
          </>
        }
        confirmLabel="Delete request"
        onConfirm={async () => {
          if (pendingDelete) await onDelete(pendingDelete.id);
          setPendingDelete(null);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

function RequestRow({
  request: r,
  expanded,
  onToggleEdit,
  onClose,
  onReopen,
  onChange,
  onDelete,
}: {
  request: ClientRequest;
  expanded: boolean;
  onToggleEdit: () => void;
  onClose: () => void;
  onReopen: () => void;
  onChange: (fn: (r: ClientRequest) => void) => void;
  onDelete: () => void;
}) {
  const closed = r.status === "done";
  const meta = [
    r.attributionShort,
    r.dueLabel && `due ${r.dueLabel}`,
    r.blocking ? "blocking now" : `open ${r.daysOpen} day${r.daysOpen === 1 ? "" : "s"}`,
    r.nudgesSent ? `${r.nudgesSent} nudge${r.nudgesSent === 1 ? "" : "s"} sent` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={`rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 ${
        closed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[14px] font-bold tracking-[-0.01em]">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                r.blocking ? "bg-[var(--p-accent)]" : "bg-[var(--p-warn)]"
              }`}
            />
            {r.title}
          </p>
          {meta ? (
            <p className="mt-1 text-[12px] text-[var(--p-text-dim)]">{meta}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={onToggleEdit}
            className="rounded-md border border-[var(--p-border)] px-2.5 py-1 text-[12px] font-medium hover:bg-[var(--p-surface-2)]"
          >
            {expanded ? "Done" : "Edit"}
          </button>
          <button
            type="button"
            onClick={closed ? onReopen : onClose}
            className="rounded-md border border-[var(--p-border)] px-2.5 py-1 text-[12px] font-medium hover:bg-[var(--p-surface-2)]"
          >
            {closed ? "Reopen" : "Close"}
          </button>
        </div>
      </div>

      {!expanded ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[var(--p-text-dim)]">
            Buttons the client sees:
          </span>
          {r.actions.map((a) => (
            <span
              key={a.label}
              className="rounded-md border border-[var(--p-border)] px-2.5 py-1 text-[12px] font-medium"
            >
              {a.label}
            </span>
          ))}
          <button
            type="button"
            onClick={onToggleEdit}
            className="rounded-md border border-[var(--p-border)] px-2.5 py-1 text-[12px] font-medium text-[var(--p-accent)] hover:bg-[var(--p-accent-weak)]"
          >
            Edit buttons
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-3 border-t border-[var(--p-border)] pt-4">
          <Grid>
            <Field
              label="Title"
              value={r.title}
              onChange={(v) => onChange((x) => (x.title = v))}
            />
            <NumberField
              label="Days open"
              value={r.daysOpen}
              min={0}
              onChange={(v) => onChange((x) => (x.daysOpen = v))}
            />
          </Grid>
          <Field
            label="Body"
            value={r.body}
            onChange={(v) => onChange((x) => (x.body = v))}
            textarea
          />
          <Grid>
            <Field
              label="Note (yellow line, optional)"
              value={r.note || ""}
              onChange={(v) => onChange((x) => (x.note = v || undefined))}
            />
            <Field
              label="Sub-note (optional)"
              value={r.subNote || ""}
              onChange={(v) => onChange((x) => (x.subNote = v || undefined))}
            />
          </Grid>
          <Field
            label="PM note (dashed box)"
            value={r.pmNote || ""}
            onChange={(v) => onChange((x) => (x.pmNote = v || undefined))}
            textarea
          />
          <CheckField
            label="Blocking now"
            checked={r.blocking}
            onChange={(v) => onChange((x) => (x.blocking = v))}
          />
          <Field
            label="Client button labels"
            hint="comma-separated — the client's exact words"
            value={r.actions.map((a) => a.label).join(", ")}
            onChange={(v) =>
              onChange((x) => {
                x.actions = v
                  .split(",")
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((label, idx) => ({
                    label,
                    kind: idx < 2 ? "primary" : "secondary",
                    intent: intentFor(label),
                  }));
              })
            }
            placeholder="Choose A, Choose B, Discuss Friday"
          />
          <button
            type="button"
            onClick={onDelete}
            className="text-[12px] font-medium text-[var(--p-risk)] underline underline-offset-2"
          >
            Delete this request
          </button>
        </div>
      )}
    </div>
  );
}

function intentFor(label: string): RequestAction["intent"] {
  const l = label.toLowerCase();
  if (l.includes("approve")) return "approve";
  if (l.includes("decline") || l.includes("reject")) return "decline";
  if (l.includes("discuss")) return "discuss";
  return "choice";
}

const RESPOND_MODES = [
  { value: "two", label: "Pick one of two options" },
  { value: "ack", label: "One acknowledgement" },
  { value: "action", label: "An action + fallback" },
] as const;

function NewRequestForm({
  onAdd,
  onSave,
  saving,
}: {
  onAdd: (input: NewRequestInput) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueBy, setDueBy] = useState("");
  const [holdsUp, setHoldsUp] = useState("");
  const [mode, setMode] = useState<(typeof RESPOND_MODES)[number]["value"]>("two");
  const [btn1, setBtn1] = useState("Choose A");
  const [btn2, setBtn2] = useState("Choose B");
  const [secondary, setSecondary] = useState("");
  const [nudge, setNudge] = useState(false);

  function submit() {
    if (!title.trim()) return;
    const labels =
      mode === "ack"
        ? [btn1.trim() || "Got it"]
        : mode === "action"
          ? [btn1.trim() || "Do it", secondary.trim() || "Discuss first"]
          : [btn1.trim(), btn2.trim(), secondary.trim()].filter(Boolean);
    onAdd({
      title: title.trim(),
      body: "",
      daysOpen: 0,
      blocking: false,
      actions: labels.map((label, idx) => ({
        label,
        kind: idx < 2 ? "primary" : "secondary",
        intent: intentFor(label),
      })),
      ...(assignee.trim() ? { attributionShort: assignee.trim() } : {}),
      ...(holdsUp.trim() ? { subNote: holdsUp.trim() } : {}),
      ...(nudge ? { nudgeSchedule: [3, 7] } : {}),
    });
    setTitle("");
    setHoldsUp("");
    setSecondary("");
  }

  return (
    <div className="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)]/50 p-4">
      <p className="text-[13px] font-bold">New request</p>
      <div className="mt-3 space-y-3">
        <Grid>
          <Field
            label="What do you need?"
            value={title}
            onChange={setTitle}
            placeholder="Confirm the invite screen wording"
          />
          <Field
            label="Assigned to"
            value={assignee}
            onChange={setAssignee}
            placeholder="Kaya Alvarez"
          />
        </Grid>
        <Grid>
          <label className="block">
            <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
              Needed by
            </span>
            <input
              type="date"
              value={dueBy}
              onChange={(e) => setDueBy(e.target.value)}
              className="w-full rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)]"
            />
          </label>
          <Field
            label="What it holds up"
            value={holdsUp}
            onChange={setHoldsUp}
            placeholder="Invite screen build, 9 Sept"
          />
        </Grid>
        <SelectField
          label="How should the client respond?"
          value={mode}
          options={RESPOND_MODES}
          onChange={(v) => setMode(v)}
        />
        <Grid>
          <Field
            label={mode === "ack" ? "Button label" : "Button 1 label"}
            value={btn1}
            onChange={setBtn1}
          />
          {mode === "two" ? (
            <Field label="Button 2 label" value={btn2} onChange={setBtn2} />
          ) : (
            <Field
              label={mode === "action" ? "Fallback label" : "Secondary link (optional)"}
              value={secondary}
              onChange={setSecondary}
            />
          )}
        </Grid>
        {mode === "two" ? (
          <Field
            label="Secondary link (optional)"
            value={secondary}
            onChange={setSecondary}
            placeholder="Discuss Friday"
          />
        ) : null}
        <p className="text-[12px] text-[var(--p-text-dim)]">
          Button labels are the client&apos;s exact words — write them the way
          you&apos;d say it on a call, not as a status (&ldquo;Choose A&rdquo;,
          not &ldquo;Option 1 selected&rdquo;).
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              submit();
              onSave();
            }}
            disabled={saving || !title.trim()}
            className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
          >
            {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
            Add request
          </button>
          <CheckField
            label="Nudge at 3 and 7 days"
            checked={nudge}
            onChange={setNudge}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Preview & build links ---------- */

const OPEN_ON_SCREENS = [
  "Summary",
  "Home",
  "Log",
  "Recipes",
  "Settings",
] as const;

function LinksEditor({
  prototype,
  build,
  onChange,
  onSave,
  saving,
  dirty,
}: {
  prototype: ProjectData["prototype"];
  build: ProjectData["build"];
  onChange: (
    fn: (p: ProjectData["prototype"], b: ProjectData["build"]) => void,
  ) => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
}) {
  return (
    <div className="space-y-4">
      <Field
        label="Figma prototype URL"
        value={prototype.figmaUrl || ""}
        onChange={(v) => onChange((p) => (p.figmaUrl = v))}
        placeholder="https://figma.com/proto/forkthis/r24"
      />
      <Field
        label="TestFlight / Play link"
        value={prototype.installUrl || ""}
        onChange={(v) => onChange((p) => (p.installUrl = v))}
        placeholder="https://testflight.apple.com/join/…"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field
          label="Build number"
          value={build.version}
          onChange={(v) => onChange((_p, b) => (b.version = v))}
          placeholder="0.9.4"
        />
        <Field
          label="Known issues"
          value={build.knownIssues}
          onChange={(v) => onChange((_p, b) => (b.knownIssues = v))}
          placeholder="3 minor, none blocking"
        />
        <SelectField
          label="Open on screen"
          value={
            (OPEN_ON_SCREENS.find(
              (o) => o === (prototype.frameLabel || "Summary"),
            ) as (typeof OPEN_ON_SCREENS)[number]) || "Summary"
          }
          options={OPEN_ON_SCREENS}
          onChange={(v) => onChange((p) => (p.frameLabel = v))}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--p-border)] pt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
        >
          {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
          Save links
        </button>
        <a
          href={
            toEmbeddable(prototype.embedUrl || prototype.figmaUrl) || undefined
          }
          target="_blank"
          rel="noreferrer"
          className={`h-9 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 text-[13px] font-medium leading-9 hover:bg-[var(--p-surface-2)] ${
            prototype.figmaUrl || prototype.embedUrl
              ? ""
              : "pointer-events-none opacity-40"
          }`}
        >
          Test the embed
        </a>
      </div>
    </div>
  );
}

function toEmbeddable(url: string | undefined): string | null {
  const u = (url || "").trim();
  if (!u) return null;
  if (/figma\.com/.test(u) && !/\/embed/.test(u)) {
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(u)}`;
  }
  return u;
}

/* ---------- Notes ---------- */

type NoteItem = NonNullable<ProjectData["notes"]>[number];

function NotesEditor({
  notes,
  onChange,
  onSave,
  saving,
}: {
  notes: NoteItem[];
  onChange: (n: NoteItem[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [visibility, setVisibility] = useState<NoteItem["visibility"]>("internal");

  function update(id: string, fn: (n: NoteItem) => void) {
    onChange(
      notes.map((n) => {
        if (n.id !== id) return n;
        const copy = structuredClone(n);
        fn(copy);
        return copy;
      }),
    );
  }

  function add() {
    if (!draft.trim()) return;
    onChange([
      {
        id: uid("note"),
        body: draft.trim(),
        visibility,
        date: nowStamp(),
        attribution: "PM",
      },
      ...notes,
    ]);
    setDraft("");
    onSave();
  }

  return (
    <div className="space-y-4">
      <div>
        <Field
          label="Note"
          value={draft}
          onChange={setDraft}
          textarea
          rows={2}
          placeholder="Anything the team or the client should know."
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <SelectField
            label=""
            value={visibility}
            options={[
              { value: "internal", label: "Internal — team only" },
              { value: "client", label: "Client — visible in the portal" },
            ]}
            onChange={(v) => setVisibility(v)}
          />
          <button
            type="button"
            onClick={add}
            disabled={saving || !draft.trim()}
            className="flex h-9 items-center gap-2 self-end rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
          >
            {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
            Add note
          </button>
        </div>
      </div>

      {notes.length > 0 ? (
        <ul className="space-y-2 border-t border-[var(--p-border)] pt-4">
          {notes.map((n) => (
            <li
              key={n.id}
              className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-2)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] leading-relaxed text-[var(--p-text)]">
                  {n.body}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(notes.filter((x) => x.id !== n.id));
                    onSave();
                  }}
                  className="shrink-0 text-[12px] font-medium text-[var(--p-risk)] underline underline-offset-2"
                >
                  Remove
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[var(--p-text-dim)]">
                <button
                  type="button"
                  onClick={() =>
                    update(n.id, (x) => {
                      x.visibility =
                        x.visibility === "client" ? "internal" : "client";
                    })
                  }
                  className={`rounded-full px-2 py-0.5 font-semibold ${
                    n.visibility === "client"
                      ? "bg-[var(--p-accent-weak)] text-[var(--p-accent)]"
                      : "bg-[var(--p-surface)] text-[var(--p-text-dim)]"
                  }`}
                >
                  {n.visibility === "client" ? "Client-visible" : "Internal"}
                </button>
                <span>{formatDate(n.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
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
  function updatePhase(
    i: number,
    fn: (p: ProjectData["plan"]["phases"][number]) => void,
  ) {
    const next = structuredClone(plan);
    fn(next.phases[i]);
    onChange(next);
  }
  function movePhase(i: number, dir: -1 | 1) {
    const next = structuredClone(plan);
    const j = i + dir;
    [next.phases[i], next.phases[j]] = [next.phases[j], next.phases[i]];
    onChange(next);
  }
  function updateMilestone(i: number, key: "title" | "body", value: string) {
    const next = structuredClone(plan);
    next.milestones[i][key] = value;
    onChange(next);
  }
  function addPhase() {
    onChange({
      ...plan,
      phases: [
        ...plan.phases,
        {
          id: uid("phase"),
          name: "New phase",
          state: "upcoming",
          start: "",
          end: "",
        },
      ],
    });
  }

  return (
    <>
      <Grid cols={3}>
        <Field
          label="Range label"
          value={plan.rangeLabel}
          onChange={(v) => onChange({ ...plan, rangeLabel: v })}
        />
        <DateField
          label="Axis start"
          value={plan.axisStart}
          onChange={(v) => onChange({ ...plan, axisStart: v })}
        />
        <DateField
          label="Axis end"
          value={plan.axisEnd}
          onChange={(v) => onChange({ ...plan, axisEnd: v })}
        />
      </Grid>

      {plan.phases.map((p, i) => (
        <ItemCard
          key={p.id}
          title={p.name}
          index={i}
          count={plan.phases.length}
          onMove={(dir) => movePhase(i, dir)}
          onRemove={() =>
            onChange({
              ...plan,
              phases: plan.phases.filter((_, j) => j !== i),
            })
          }
        >
          <Grid>
            <Field
              label="Name"
              value={p.name}
              onChange={(v) => updatePhase(i, (x) => (x.name = v))}
            />
            <SelectField
              label="State"
              value={p.state}
              options={["done", "now", "upcoming"] as const}
              onChange={(v) => updatePhase(i, (x) => (x.state = v))}
            />
            <DateField
              label="Start"
              value={p.start}
              onChange={(v) => updatePhase(i, (x) => (x.start = v))}
            />
            <DateField
              label="End"
              value={p.end}
              onChange={(v) => updatePhase(i, (x) => (x.end = v))}
            />
          </Grid>
          <Field
            label="Bar label"
            hint="e.g. 8 Jun — 24 Jul"
            value={p.rangeLabel || ""}
            onChange={(v) => updatePhase(i, (x) => (x.rangeLabel = v))}
          />
        </ItemCard>
      ))}
      <AddButton label="+ Add phase" onClick={addPhase} />

      {plan.milestones.length > 0 ? (
        <div className="mt-2 space-y-3 border-t border-[var(--p-border)] pt-4">
          <p className="text-[12px] font-semibold text-[var(--p-text-dim)]">
            Milestones
          </p>
          {plan.milestones.map((m, i) => (
            <Grid key={i}>
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
            </Grid>
          ))}
        </div>
      ) : null}
    </>
  );
}

/* ---------- Screens ---------- */

function ScreensEditor({
  screens,
  onChange,
  isPersisted,
  onDelete,
  onSave,
  saving,
}: {
  screens: FinishedScreen[];
  onChange: (s: FinishedScreen[]) => void;
  isPersisted: (id: string) => boolean;
  onDelete: (id: string) => Promise<void>;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
}) {
  const [pendingDelete, setPendingDelete] = useState<FinishedScreen | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [reordering, setReordering] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function update(id: string, fn: (s: FinishedScreen) => void) {
    onChange(
      screens.map((sc) => {
        if (sc.id !== id) return sc;
        const copy = structuredClone(sc);
        fn(copy);
        return copy;
      }),
    );
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= screens.length) return;
    const next = [...screens];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  async function pickFiles(files: FileList | null) {
    if (!files?.length) return;
    const added: FinishedScreen[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
      });
      added.push({
        id: uid("scr"),
        name: file.name.replace(/\.[^.]+$/, ""),
        date: "",
        imageUrl: dataUrl,
      });
    }
    if (added.length) onChange([...added, ...screens]);
  }

  function addManual() {
    if (!name.trim()) return;
    onChange([
      {
        id: uid("scr"),
        name: name.trim(),
        date,
        ...(image.trim() ? { imageUrl: image.trim() } : {}),
      },
      ...screens,
    ]);
    setName("");
    setDate("");
    setImage("");
    onSave();
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pickFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--p-accent)]/50 bg-[var(--p-accent-weak)]/50 px-6 py-8 text-center text-[13px] leading-relaxed text-[var(--p-text-dim)] hover:bg-[var(--p-accent-weak)]"
      >
        <span>
          Drop screenshots here, or{" "}
          <span className="font-semibold text-[var(--p-accent)] underline underline-offset-2">
            choose files
          </span>
          . Phone screenshots are cropped to the frame automatically.
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => pickFiles(e.target.files)}
        />
      </label>

      <Grid>
        <Field
          label="Screen name"
          value={name}
          onChange={setName}
          placeholder="Meal log, offline"
        />
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
            Finished on
          </span>
          <input
            type="date"
            value={/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : ""}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)]"
          />
        </label>
      </Grid>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--p-border)] pt-4">
        <button
          type="button"
          onClick={addManual}
          disabled={saving || !name.trim()}
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
        >
          {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
          Add screen
        </button>
        {screens.length > 1 ? (
          <button
            type="button"
            onClick={() => setReordering((v) => !v)}
            className="h-9 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 text-[13px] font-medium hover:bg-[var(--p-surface-2)]"
          >
            {reordering ? "Done reordering" : "Reorder"}
          </button>
        ) : null}
      </div>

      {screens.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {screens.map((sc, i) => (
            <li
              key={sc.id}
              className="flex gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"
            >
              <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-2)] text-[var(--p-text-dim)]">
                {sc.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sc.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg">🖼️</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <input
                  value={sc.name}
                  onChange={(e) => update(sc.id, (x) => (x.name = e.target.value))}
                  className="w-full bg-transparent text-[13px] font-semibold outline-none"
                />
                <p className="mt-0.5 text-[12px] text-[var(--p-text-dim)]">
                  {formatDate(sc.date) || "no date"}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[12px]">
                  {reordering ? (
                    <>
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded border border-[var(--p-border)] px-1.5 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === screens.length - 1}
                        className="rounded border border-[var(--p-border)] px-1.5 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={() =>
                      isPersisted(sc.id)
                        ? setPendingDelete(sc)
                        : onChange(screens.filter((x) => x.id !== sc.id))
                    }
                    className="text-[var(--p-risk)] underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this screen?"
        body={
          <>
            <span className="font-medium text-[var(--p-text)]">
              {pendingDelete?.name}
            </span>{" "}
            will be permanently removed from the client&apos;s portal. This
            cannot be undone.
          </>
        }
        confirmLabel="Delete screen"
        onConfirm={async () => {
          if (pendingDelete) await onDelete(pendingDelete.id);
          setPendingDelete(null);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}

/* ---------- Decisions ---------- */

const DECISION_WHERE: Array<{
  value: NonNullable<DecisionInput["where"]>;
  label: string;
}> = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "portal-reply", label: "Portal reply" },
  { value: "workshop", label: "Workshop" },
  { value: "other", label: "Other" },
];

function todayIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function DecisionComposer({
  decisions,
  onLog,
  onSupersede,
  busy,
}: {
  decisions: Decision[];
  onLog: (input: DecisionInput) => Promise<void>;
  onSupersede: (id: string) => void;
  busy: boolean;
}) {
  const [body, setBody] = useState("");
  const [date, setDate] = useState(todayIso);
  const [agreedBy, setAgreedBy] = useState("");
  const [where, setWhere] = useState<DecisionInput["where"]>("call");
  const [swatch, setSwatch] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [supersedeId, setSupersedeId] = useState("");

  const live = decisions.filter((d) => !d.supersededBy);

  async function submit() {
    if (!body.trim() || busy) return;
    setError("");
    try {
      await onLog({
        body: body.trim(),
        date,
        ...(agreedBy.trim() ? { attribution: agreedBy.trim() } : {}),
        ...(where ? { where } : {}),
        ...(link.trim()
          ? { link: { label: "Reference", url: link.trim() } }
          : {}),
      });
      setBody("");
      setAgreedBy("");
      setSwatch("");
      setLink("");
      setDate(todayIso());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not log the decision.");
    }
  }

  return (
    <div className="space-y-4">
      <Field
        label="The decision, in one sentence"
        value={body}
        onChange={setBody}
        textarea
        rows={2}
        placeholder="Primary colour set to #0B7FD4, used for actions only."
      />

      <Grid>
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
            Date agreed
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)]"
          />
        </label>
        <Field label="Agreed by" value={agreedBy} onChange={setAgreedBy} placeholder="Kaya Alvarez, Dr. M. Renner" />
      </Grid>

      <Grid>
        <SelectField
          label="Where"
          value={where ?? "call"}
          options={DECISION_WHERE}
          onChange={(v) => setWhere(v)}
        />
        <Field
          label="Swatch (optional)"
          value={swatch}
          onChange={setSwatch}
          placeholder="#0B7FD4"
        />
      </Grid>

      <div>
        <Field
          label="Figma or document link"
          value={link}
          onChange={setLink}
          placeholder="https://figma.com/file/…"
        />
        <p className="mt-1.5 text-[12px] text-[var(--p-text-dim)]">
          Figma links render as a named link, not a raw URL. Restricted files are
          flagged before publishing.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-[var(--p-risk-bg)] px-3 py-2 text-[13px] text-[var(--p-risk)]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--p-border)] pt-4">
        <button
          type="button"
          onClick={submit}
          disabled={busy || !body.trim()}
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
        >
          {busy ? (
            <>
              <Spinner className="h-3.5 w-3.5" />
              Saving…
            </>
          ) : (
            "Add to log"
          )}
        </button>

        <div className="flex items-center gap-2">
          <select
            value={supersedeId}
            onChange={(e) => setSupersedeId(e.target.value)}
            className="h-9 max-w-[160px] truncate rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
          >
            <option value="">Supersede an entry…</option>
            {live.map((d) => (
              <option key={d.id} value={d.id}>
                {d.body.slice(0, 48)}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!supersedeId}
            onClick={() => {
              onSupersede(supersedeId);
              setSupersedeId("");
            }}
            className="h-9 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 text-[13px] font-medium hover:bg-[var(--p-surface-2)] disabled:opacity-40"
          >
            Supersede
          </button>
        </div>

        <span className="ml-auto text-[12px] text-[var(--p-text-dim)]">
          Superseded, never deleted
        </span>
      </div>

      {live.length > 0 ? (
        <ul className="space-y-2 border-t border-[var(--p-border)] pt-4">
          {live.slice(0, 4).map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-2)] px-3 py-2 text-[12px]"
            >
              <p className="text-[var(--p-text)]">{d.body}</p>
              <p className="mt-0.5 text-[var(--p-text-dim)]">
                {formatDate(d.date)}
                {d.attribution ? ` · ${d.attribution}` : ""}
              </p>
            </li>
          ))}
          {live.length > 4 ? (
            <li className="text-[12px] text-[var(--p-text-dim)]">
              + {live.length - 4} more in history
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
