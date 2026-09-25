"use client";

import { useState } from "react";
import type { PortalRole, ProjectData } from "@/lib/portal/types";
import { SectionTitle } from "./ui";
import { Spinner } from "./Spinner";
import { formatDate } from "@/lib/portal/format";
import { useProjectData } from "./ProjectDataProvider";

/** PM-only "+ Add note" form, inline on the client-facing page — a shortcut
 *  to the same POST /notes endpoint the console's Notes editor uses. Shared
 *  by ProjectNotes and any other client-facing section that offers the same
 *  "+ Add note" shortcut (e.g. Decisions, next to "Next call"). */
export function AddNoteForm({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { refresh } = useProjectData();
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<"internal" | "client">("client");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/portal/api/projects/${slug}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), visibility }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Could not add note.");
      await refresh();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] p-5"
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        autoFocus
        placeholder="Anything the team or the client should know."
        className="w-full resize-y rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as "internal" | "client")}
          className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
        >
          <option value="client">Client — visible in the portal</option>
          <option value="internal">Internal — team only</option>
        </select>
        <button
          type="submit"
          disabled={saving || !body.trim()}
          className="flex h-9 items-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40"
        >
          {saving ? <Spinner className="h-3.5 w-3.5" /> : null}
          Add note
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="text-[13px] font-medium text-[var(--p-text-dim)] underline underline-offset-2 disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
      {error ? <p className="mt-2 text-[12px] text-[var(--p-risk)]">{error}</p> : null}
    </form>
  );
}

/** The bit before "@" in an email-shaped attribution, title-cased — e.g.
 *  "manager@universalpark.com" -> "Manager". Anything that isn't
 *  email-shaped (a real display name, "PM", etc.) passes through as-is. */
function displayName(attribution: string): string {
  const match = /^([^\s@]+)@[^\s@]+\.[^\s@]+$/.exec(attribution.trim());
  if (!match) return attribution;
  return match[1]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

/** "Project notes" section on the client portal page — always the
 *  client-facing view, for every role. Internal notes never render here,
 *  PM included; the PM previews/manages internal notes in the console's
 *  Notes editor instead. A PM can still add a note without leaving this
 *  page via the "+ Add note" button. */
export function ProjectNotes({
  notes,
  role,
  slug,
}: {
  notes: ProjectData["notes"];
  role: PortalRole;
  slug: string;
}) {
  const [adding, setAdding] = useState(false);
  // Newest first — notes are appended to the end of the stored array as
  // they're added, so the latest one is last.
  const clientNotes = (notes || [])
    .filter((note) => note.visibility === "client")
    .slice()
    .reverse();

  if (clientNotes.length === 0 && role !== "pm") return null;

  return (
    <div>
      <SectionTitle
        title="Project notes"
        aside={clientNotes.length > 0 ? `${clientNotes.length} ${clientNotes.length === 1 ? "note" : "notes"}` : undefined}
      />
      <div className="space-y-3">
        {clientNotes.map((note, i) => (
          <div
            key={note.id}
            className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[12px] font-semibold text-[var(--p-text)]">
                {displayName(note.attribution)}
                {i === 0 ? (
                  <span className="rounded-full bg-[var(--p-accent-weak)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--p-accent)]">
                    Latest
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-[12px] font-medium text-[var(--p-text-dim)]">
                {formatDate(note.date)}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--p-text)]">{note.body}</p>
          </div>
        ))}

        {role === "pm" ? (
          adding ? (
            <AddNoteForm slug={slug} onClose={() => setAdding(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="rounded-lg border border-dashed border-[var(--p-border)] px-3 py-2 text-[13px] font-medium text-[var(--p-accent)] hover:bg-[var(--p-accent-weak)]"
            >
              + Add note
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}
