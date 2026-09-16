import type { PortalRole, ProjectData } from "@/lib/portal/types";
import { SectionTitle } from "./ui";
import { formatDate } from "@/lib/portal/format";

/** Read-only "Project notes" section on the client portal page. Renders the
 *  PM's client-visible notes (visibility: "client") in one place — until
 *  now this list existed in OverviewTab but was only ever mounted
 *  `embedded` (inside the sticky hero), so it never actually rendered
 *  anywhere. Internal notes never reach here: the API strips them for
 *  client sessions, and this filters again as defense in depth. */
export function ProjectNotes({
  notes,
  role,
}: {
  notes: ProjectData["notes"];
  role: PortalRole;
}) {
  const clientNotes = role === "client"
    ? (notes || []).filter((note) => note.visibility === "client")
    : (notes || []);

  if (clientNotes.length === 0) return null;

  return (
    <div>
      <SectionTitle title="Project notes" aside={`${clientNotes.length} ${clientNotes.length === 1 ? "note" : "notes"}`} />
      <div className="space-y-3">
        {clientNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5"
          >
            <p className="text-[13px] leading-relaxed text-[var(--p-text)]">{note.body}</p>
            <p className="mt-2 text-[12px] text-[var(--p-text-dim)]">
              {note.attribution} · {formatDate(note.date)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
