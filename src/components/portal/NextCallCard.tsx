import { CalendarDays, ExternalLink, FileText } from "lucide-react";
import { formatDate, relativeDay } from "@/lib/portal/format";
import { sanitizeAgendaHtml } from "@/lib/portal/sanitizeHtml";
import type { ProjectData } from "@/lib/portal/types";

const CARD =
  "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 sm:p-5";

/** Pill colour for the relative-date badge: upcoming reads as accent,
 *  anything already past is muted. */
function badgeClass(relative: string) {
  return relative.endsWith("ago") || relative === "Yesterday"
    ? "bg-[var(--p-surface-2)] text-[var(--p-text-dim)]"
    : "bg-[var(--p-accent-weak)] text-[var(--p-accent)]";
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--p-accent-weak)] text-[var(--p-accent)]">
      {children}
    </span>
  );
}

/**
 * The client-facing "Next call", as a stack of separate cards: the call
 * itself (label + date), the agenda talking points, and a link out to the
 * full agenda doc. Each card only renders when it has content. Shown on the
 * portal page and reused as the console's live preview, so what the PM sees
 * there is exactly what the client gets.
 */
export function NextCallCard({
  nextCall,
}: {
  nextCall: NonNullable<ProjectData["nextCall"]>;
}) {
  const relative = relativeDay(nextCall.date);

  return (
    <div className="space-y-3">
      {/* Call — label + date */}
      <div className={`${CARD} flex items-start gap-3`}>
        <IconTile>
          <CalendarDays className="h-5 w-5" aria-hidden />
        </IconTile>
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

      {/* Agenda — talking points */}
      {nextCall.agenda ? (
        <div className={CARD}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-text-dim)]">
            Agenda
          </p>
          <div
            className="agenda-content text-[13px] leading-relaxed text-[var(--p-text)] [&_a]:text-[var(--p-accent)] [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:pl-0.5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{
              __html: sanitizeAgendaHtml(nextCall.agenda),
            }}
          />
        </div>
      ) : null}

      {/* Full agenda — the whole card is the link */}
      {nextCall.agendaUrl ? (
        <a
          href={nextCall.agendaUrl}
          target="_blank"
          rel="noreferrer"
          className={`${CARD} group flex items-center gap-3 transition-colors hover:border-[var(--p-accent)] hover:bg-[var(--p-accent-weak)]`}
        >
          <IconTile>
            <FileText className="h-5 w-5" aria-hidden />
          </IconTile>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-bold text-[var(--p-text)]">
              Full agenda
            </span>
            <span className="block text-[12px] text-[var(--p-text-dim)]">
              Opens in a new tab
            </span>
          </span>
          <ExternalLink
            className="h-4 w-4 shrink-0 text-[var(--p-text-dim)] group-hover:text-[var(--p-accent)]"
            aria-hidden
          />
        </a>
      ) : null}
    </div>
  );
}
