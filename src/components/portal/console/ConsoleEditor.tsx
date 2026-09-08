"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ClientRequest,
  Decision,
  FinishedScreen,
  ProjectData,
} from "@/lib/portal/types";
import {
  AddButton,
  CheckField,
  DateField,
  Field,
  Grid,
  ImageField,
  ItemCard,
  NumberField,
  ReadOnlyStat,
  SelectField,
  SmartDateField,
} from "./fields";
import { Section } from "./Section";
import { Spinner } from "../Spinner";
import { ConfirmDialog } from "./ConfirmDialog";
import { formatDateTime } from "@/lib/portal/format";

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

const STATUS_OPTIONS = ["On track", "Watch", "At risk"] as const;

const SECTION_KEYS = [
  "header",
  "status",
  "requests",
  "links",
  "plan",
  "screens",
  "decisions",
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
    requests: true,
    links: false,
    plan: false,
    screens: false,
    decisions: false,
    nextCall: false,
  });
  // Optional display name remembered locally for the updated-by metadata.
  const [pmName, setPmName] = useState("");

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
      requests: !eq(data.requests, saved.requests),
      links:
        !eq(data.prototype, saved.prototype) || !eq(data.build, saved.build),
      plan: !eq(data.plan, saved.plan),
      screens: !eq(data.finishedScreens, saved.finishedScreens),
      // Decisions are committed immediately through the audit-log endpoint.
      decisions: false,
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
      "plan", "finishedScreens", "decisionsIntro", "nextCall",
    ];
    for (const section of sections) {
      if (!same(payload[section], saved[section])) changes[section] = payload[section];
    }

    try {
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

  async function logDecision(supersedes?: string) {
    const body = (window.prompt(supersedes ? "Replacement decision" : "Decision") || "").trim();
    if (!body) return;
    const attribution = (window.prompt("Who agreed this? (optional)") || "").trim();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/portal/api/projects/${slug}/decisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, ...(attribution ? { attribution } : {}), ...(supersedes ? { supersedes } : {}) }),
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
  const blocking = openRequests.filter((r) => r.blocking).length;

  return (
    <div className="mt-6 space-y-3 sm:space-y-4">
      {/* Sticky save bar */}
      <div className="sticky top-14 z-20 -mx-3 border-b border-[var(--p-border)] bg-[var(--p-bg)]/90 px-3 py-2.5 backdrop-blur sm:-mx-4 sm:px-4 sm:py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="flex items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            {saving ? (
              <>
                <Spinner className="h-3.5 w-3.5" />
                Saving…
              </>
            ) : dirty ? (
              "Save changes"
            ) : (
              "Saved"
            )}
          </button>

          <button
            onClick={publish}
            disabled={saving || publishing}
            title="Make the current draft visible in the client portal"
            className="rounded-lg bg-[var(--p-ok)] px-3 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            {publishing ? "Publishing…" : "Publish changes"}
          </button>

          {dirty ? (
            <button
              onClick={discard}
              disabled={saving}
              className="rounded-lg border border-[var(--p-border)] px-3 py-2 text-[13px] font-medium text-[var(--p-text-dim)] hover:bg-[var(--p-surface)] disabled:opacity-40"
            >
              Discard
            </button>
          ) : null}

          <span className="text-[12px] text-[var(--p-text-dim)]">
            {dirty ? (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--p-warn)]" />
                Unsaved changes
              </span>
            ) : (
              "No unsaved changes"
            )}
          </span>

          {message ? (
            <span
              className={
                "text-[13px] " +
                (message.kind === "ok"
                  ? "text-[var(--p-ok)]"
                  : message.kind === "warn"
                    ? "text-[var(--p-warn)]"
                    : "text-[var(--p-risk)]")
              }
            >
              {message.text}
            </span>
          ) : null}

          <span className="ml-auto flex items-center gap-3 text-[12px] text-[var(--p-text-dim)]">
            <button
              onClick={() => setAll(true)}
              className="underline underline-offset-2 hover:text-[var(--p-text)]"
            >
              Expand all
            </button>
            <button
              onClick={() => setAll(false)}
              className="underline underline-offset-2 hover:text-[var(--p-text)]"
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

      {/* ---------- Status hero ---------- */}
      <Section
        title="Status hero"
        dirty={dirtyMap.status}
        open={open.status}
        onToggle={() => toggle("status")}
        summary={`${s.statusLabel} · ${s.daysToLaunch}d to launch`}
      >
        <Grid>
          <SelectField
            label="Current phase"
            value={s.currentPhase}
            options={PHASE_OPTIONS}
            onChange={(v) => patch((d) => (d.status.currentPhase = v))}
          />
          <Field
            label="Phase subtitle"
            value={s.phaseSubtitle}
            onChange={(v) => patch((d) => (d.status.phaseSubtitle = v))}
          />
          <ReadOnlyStat
            label="Days to launch"
            value={`${s.daysToLaunch} days`}
            note="Calculated automatically from the launch date"
          />
          <SmartDateField
            label="Launch date"
            value={s.launchDate}
            onChange={(v) => patch((d) => (d.status.launchDate = v))}
            onIsoChange={(iso) => patch((d) => (d.status.daysToLaunch = daysUntil(iso)))}
            allowFreeText={false}
          />
          <Field
            label="Launch note"
            value={s.launchNote}
            onChange={(v) => patch((d) => (d.status.launchNote = v))}
            textarea
            rows={2}
          />
          <SelectField
            label="Status label"
            value={s.statusLabel}
            options={STATUS_OPTIONS}
            onChange={(v) => patch((d) => (d.status.statusLabel = v))}
          />
          <NumberField
            label="Screens built"
            value={s.screensBuilt}
            min={0}
            onChange={(v) => patch((d) => (d.status.screensBuilt = v))}
          />
          <NumberField
            label="Screens total"
            value={s.screensTotal}
            min={0}
            onChange={(v) => patch((d) => (d.status.screensTotal = v))}
          />
        </Grid>
        <Field
          label="Status body"
          value={s.statusBody}
          onChange={(v) => patch((d) => (d.status.statusBody = v))}
          textarea
          rows={3}
        />
        <Field
          label="This week — shipped"
          value={s.thisWeek}
          onChange={(v) => patch((d) => (d.status.thisWeek = v))}
          textarea
          rows={3}
        />
        <Field
          label="Up next"
          value={s.upNext}
          onChange={(v) => patch((d) => (d.status.upNext = v))}
          textarea
          rows={3}
        />
        <Field
          label="Needed from you"
          value={s.neededFromYou}
          onChange={(v) => patch((d) => (d.status.neededFromYou = v))}
          textarea
          rows={3}
        />
      </Section>

      {/* ---------- Requests ---------- */}
      <Section
        title="Waiting on you — client requests"
        badge={data.requests.length}
        dirty={dirtyMap.requests}
        open={open.requests}
        onToggle={() => toggle("requests")}
        summary={
          openRequests.length === 0
            ? "nothing open"
            : `${openRequests.length} open${blocking ? ` · ${blocking} blocking` : ""}`
        }
      >
        <RequestsEditor
          requests={data.requests}
          onChange={(requests) => patch((d) => (d.requests = requests))}
          isPersisted={(id) => savedRequestIds.has(id)}
          onDelete={deleteRequest}
        />
      </Section>

      {/* ---------- Links & build ---------- */}
      <Section
        title="See it working — links & build"
        dirty={dirtyMap.links}
        open={open.links}
        onToggle={() => toggle("links")}
        summary={`build ${data.build.version}`}
      >
        <Grid>
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
          <SmartDateField
            label="Build date"
            value={data.build.date}
            onChange={(v) => patch((d) => (d.build.date = v))}
          />
          <NumberField
            label="Build screens built"
            value={data.build.screensBuilt}
            min={0}
            onChange={(v) => patch((d) => (d.build.screensBuilt = v))}
          />
          <NumberField
            label="Build screens total"
            value={data.build.screensTotal}
            min={0}
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
        </Grid>
      </Section>

      {/* ---------- Plan ---------- */}
      <Section
        title="The plan — phases & milestones"
        badge={data.plan.phases.length}
        dirty={dirtyMap.plan}
        open={open.plan}
        onToggle={() => toggle("plan")}
        summary={data.plan.rangeLabel}
      >
        <PhasesEditor
          plan={data.plan}
          onChange={(plan) => patch((d) => (d.plan = plan))}
        />
      </Section>

      {/* ---------- Screens ---------- */}
      <Section
        title="Just finished — screens"
        badge={data.finishedScreens.length}
        dirty={dirtyMap.screens}
        open={open.screens}
        onToggle={() => toggle("screens")}
      >
        <ScreensEditor
          screens={data.finishedScreens}
          onChange={(screens) => patch((d) => (d.finishedScreens = screens))}
          isPersisted={(id) => savedScreenIds.has(id)}
          onDelete={deleteScreen}
        />
      </Section>

      {/* ---------- Decisions ---------- */}
      <Section
        title="Decisions"
        badge={data.decisions.length}
        dirty={dirtyMap.decisions}
        open={open.decisions}
        onToggle={() => toggle("decisions")}
      >
        <DecisionsEditor
          decisions={data.decisions}
          onLog={() => logDecision()}
          onSupersede={logDecision}
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

      {/* ---------- Danger zone ---------- */}
      <section className="rounded-2xl border border-[var(--p-risk)]/40 bg-[var(--p-risk-bg)]/40 p-4 sm:p-5">
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
    </div>
  );
}

/* ---------- Requests ---------- */

function RequestsEditor({
  requests,
  onChange,
  isPersisted,
  onDelete,
}: {
  requests: ClientRequest[];
  onChange: (r: ClientRequest[]) => void;
  /** true if this id exists on the backend (needs the DELETE endpoint) */
  isPersisted: (id: string) => boolean;
  onDelete: (id: string) => Promise<void>;
}) {
  const [pendingDelete, setPendingDelete] = useState<ClientRequest | null>(null);

  function update(i: number, fn: (r: ClientRequest) => void) {
    const next = structuredClone(requests);
    fn(next[i]);
    onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const next = structuredClone(requests);
    const j = i + dir;
    [next[i], next[j]] = [next[j], next[i]];
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
    <>
      {requests.map((r, i) => (
        <ItemCard
          key={r.id}
          title={r.title}
          index={i}
          count={requests.length}
          onMove={(dir) => move(i, dir)}
          onRemove={() =>
            isPersisted(r.id)
              ? setPendingDelete(r)
              : onChange(requests.filter((_, j) => j !== i))
          }
        >
          <Grid>
            <Field
              label="Title"
              value={r.title}
              onChange={(v) => update(i, (x) => (x.title = v))}
            />
            <NumberField
              label="Days open"
              value={r.daysOpen}
              min={0}
              onChange={(v) => update(i, (x) => (x.daysOpen = v))}
            />
          </Grid>
          <Field
            label="Body"
            value={r.body}
            onChange={(v) => update(i, (x) => (x.body = v))}
            textarea
          />
          <Grid>
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
          </Grid>
          <Field
            label="PM note (dashed box)"
            value={r.pmNote || ""}
            onChange={(v) => update(i, (x) => (x.pmNote = v || undefined))}
            textarea
          />
          <div className="flex flex-wrap items-center gap-4">
            <CheckField
              label="Blocking now"
              checked={r.blocking}
              onChange={(v) => update(i, (x) => (x.blocking = v))}
            />
            <CheckField
              label="Closed"
              checked={r.status === "done"}
              onChange={(v) =>
                update(i, (x) => (x.status = v ? "done" : "open"))
              }
            />
          </div>
          <Grid>
            <Field
              label="Action button labels"
              hint="comma-separated"
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
              label="Option labels"
              hint="comma-separated, optional"
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
          </Grid>
        </ItemCard>
      ))}
      <AddButton label="+ New client request" onClick={add} />

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
    </>
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
}: {
  screens: FinishedScreen[];
  onChange: (s: FinishedScreen[]) => void;
  isPersisted: (id: string) => boolean;
  onDelete: (id: string) => Promise<void>;
}) {
  const [pendingDelete, setPendingDelete] = useState<FinishedScreen | null>(null);

  function update(i: number, fn: (s: FinishedScreen) => void) {
    const next = structuredClone(screens);
    fn(next[i]);
    onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const next = structuredClone(screens);
    const j = i + dir;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  return (
    <>
      {screens.map((sc, i) => (
        <ItemCard
          key={sc.id}
          title={sc.name}
          index={i}
          count={screens.length}
          onMove={(dir) => move(i, dir)}
          onRemove={() =>
            isPersisted(sc.id)
              ? setPendingDelete(sc)
              : onChange(screens.filter((_, j) => j !== i))
          }
        >
          <Grid>
            <Field
              label="Name"
              value={sc.name}
              onChange={(v) => update(i, (x) => (x.name = v))}
            />
            <SmartDateField
              label="Date"
              value={sc.date}
              onChange={(v) => update(i, (x) => (x.date = v))}
            />
          </Grid>
          <ImageField
            label="Image (optional)"
            hint="link or upload"
            value={sc.imageUrl || ""}
            onChange={(v) => update(i, (x) => (x.imageUrl = v || undefined))}
          />
        </ItemCard>
      ))}
      <AddButton
        label="+ Add screen"
        onClick={() =>
          onChange([{ id: uid("scr"), name: "New screen", date: "" }, ...screens])
        }
      />

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
    </>
  );
}

/* ---------- Decisions ---------- */

function DecisionsEditor({
  decisions,
  onLog,
  onSupersede,
}: {
  decisions: Decision[];
  onLog: () => void;
  onSupersede: (id: string) => void;
}) {
  return (
    <>
      {decisions.map((d) => (
        <div
          key={d.id}
          className="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"
        >
          <p className="text-[13px] text-[var(--p-text-dim)]">{formatDateTime(d.date)}</p>
          <p className="mt-1 text-sm text-[var(--p-text)]">{d.body}</p>
          <p className="mt-1 text-[12px] text-[var(--p-text-dim)]">{d.attribution}</p>
          {d.supersededBy ? <p className="mt-2 text-[12px] text-[var(--p-text-dim)]">Superseded — retained as audit history</p> : <button onClick={() => onSupersede(d.id)} className="mt-3 rounded-md border border-[var(--p-border)] px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--p-bg)]">Supersede decision</button>}
        </div>
      ))}
      <AddButton label="+ Log decision" onClick={onLog} />
    </>
  );
}
