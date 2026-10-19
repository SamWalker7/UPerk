import { CalendarDays, ExternalLink } from "lucide-react";
import { formatDate, relativeDay } from "@/lib/portal/format";
import { sanitizeAgendaHtml } from "@/lib/portal/sanitizeHtml";
import type { ProjectData } from "@/lib/portal/types";

/** Pill colour for the relative-date badge: upcoming reads as accent,
 *  anything already past is muted. */
function badgeClass(relative: string) {
  return relative.endsWith("ago") || relative === "Yesterday"
    ? "bg-[var(--p-surface-2)] text-[var(--p-text-dim)]"
    : "bg-[var(--p-accent-weak)] text-[var(--p-accent)]";
}

/**
 * The client-facing "Next call" card: label, date with a relative badge,
 * the agenda talking points, and a link out to the full agenda doc.
 * Rendered on the portal page and reused as the console's live preview,
 * so what the PM sees there is exactly what the client gets.
 */
export function NextCallCard({
  nextCall,
}: {
  nextCall: NonNullable<ProjectData["nextCall"]>;
}) {
  const relative = relativeDay(nextCall.date);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--p-accent-weak)] text-[var(--p-accent)]">
          <CalendarDays className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">
            Next call
          </p>
          <p className="mt-0.5 text-[15px] font-bold leading-snug text-[var(--p-text)]">
            {nextCall.label || "Call details to be confirmed"}
          </p>
          {nextCall.date ? (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--p-text-dim)]">
              <span>{formatDate(nextCall.date)}</span>
              {relative ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeClass(relative)}`}
                >
                  {relative}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      {nextCall.agenda ? (
        <div className="border-t border-[var(--p-border)] bg-[var(--p-surface-2)] px-4 py-3.5 sm:px-5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--p-text-dim)]">
            Agenda
          </p>
          <div
            className="agenda-content text-[13px] leading-relaxed text-[var(--p-text)] [&_a]:text-[var(--p-accent)] [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:pl-0.5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: sanitizeAgendaHtml(nextCall.agenda) }}
          />
        </div>
      ) : null}

      {nextCall.agendaUrl ? (
        <div className="border-t border-[var(--p-border)] px-4 py-3 sm:px-5">
          <a
            href={nextCall.agendaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--p-accent)] hover:underline hover:underline-offset-2"
          >
            Open the full agenda
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      ) : null}
    </div>
  );
}
