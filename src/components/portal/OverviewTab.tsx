import type { ProjectData, PortalRole } from "@/lib/portal/types";
import { PmAnnotation } from "./PmAnnotation";

function Panel({
  tone,
  label,
  body,
  children,
}: {
  tone: "ok" | "accent" | "warn";
  label: string;
  body: string;
  children?: React.ReactNode;
}) {
  const dot =
    tone === "ok"
      ? "bg-[var(--p-ok)]"
      : tone === "warn"
        ? "bg-[var(--p-warn)]"
        : "bg-[var(--p-accent)]";
  return (
    <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5">
      <p className="flex items-center gap-2 text-[13px] font-semibold">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
        {body || "—"}
      </p>
      {children}
    </div>
  );
}

export function OverviewTab({
  data,
  role,
}: {
  data: ProjectData;
  role: PortalRole;
}) {
  const s = data.status;
  const open = data.requests.filter((r) => r.status === "open").length;
  // The API strips internal notes for client sessions. Keep this filter as a
  // defense in depth should a future data source bypass that API boundary.
  const clientNotes = role === "client"
    ? (data.notes || []).filter((note) => note.visibility === "client")
    : [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Panel tone="ok" label="This week — shipped" body={s.thisWeek} />
        <Panel tone="accent" label="Up next" body={s.upNext} />
        <Panel tone="warn" label="Needed from you" body={s.neededFromYou}>
          {open > 0 ? (
            <a
              href="#requests"
              className="mt-3 inline-block cursor-pointer text-[13px] font-semibold text-[var(--p-warn)] underline underline-offset-2"
            >
              {open} waiting on you →
            </a>
          ) : null}
        </Panel>
      </div>

      {clientNotes.length ? (
        <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5">
          <p className="text-[13px] font-semibold">Project notes</p>
          <ul className="mt-3 space-y-3">
            {clientNotes.map((note) => (
              <li key={note.id} className="text-[13px] leading-relaxed text-[var(--p-text-dim)]">
                {note.body}
                <span className="ml-2 text-[12px]">— {note.attribution}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {role === "pm" ? (
        <PmAnnotation
          linkLabel="Edit the weekly update"
          href={`/console?p=${data.slug}`}
        >
          This week / Up next / Needed from you are typed once per push in the console,
          along with the status line and phase.
        </PmAnnotation>
      ) : null}
    </div>
  );
}
