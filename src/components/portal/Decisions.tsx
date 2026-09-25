"use client";

import { useState } from "react";
import { PmAnnotation } from "./PmAnnotation";
import { AddNoteForm } from "./ProjectNotes";
import { Card, SectionTitle } from "./ui";
import { formatDate, formatTime } from "@/lib/portal/format";
import { sanitizeAgendaHtml } from "@/lib/portal/sanitizeHtml";
import type { Decision, PortalRole } from "@/lib/portal/types";

const PAGE_SIZE = 5;

/**
 * The right-aligned date/time on a decision row. Prefers a real timestamp
 * (from `date` if it carries a time, else `createdAt`) so we can show
 * "8 Sept 2026 · 4:30pm"; falls back to whatever date string we have.
 */
function decisionStamp(d: Decision): string {
  const withTime = /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(d.date)
    ? d.date
    : d.createdAt || "";
  const time = formatTime(withTime);
  const date = formatDate(withTime || d.date);
  return time ? `${date} · ${time}` : date;
}

export function Decisions({
  decisions,
  intro,
  nextCall,
  role,
  slug,
}: {
  decisions: Decision[];
  intro?: string;
  nextCall?: { label: string; date?: string; agendaUrl?: string; agenda?: string };
  role: PortalRole;
  slug: string;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [addingNote, setAddingNote] = useState(false);

  // Decisions are appended to the end of the stored array as they're
  // logged, so the newest one is last — reverse for display so the client
  // sees the latest decision first.
  const ordered = [...decisions].reverse();
  const shown = ordered.slice(0, visible);

  return (
    <div>
      <SectionTitle title="Decisions" aside="What we agreed, and when" />
      {intro ? (
        <p className="mb-4 max-w-2xl text-[13px] text-[var(--p-text-dim)]">{intro}</p>
      ) : null}
      {decisions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--p-border)] p-10 text-center text-[13px] text-[var(--p-text-dim)]">
          No decisions logged yet.
        </div>
      ) : (
        <>
          <Card className="p-0">
            <ul>
              {shown.map((d, i) => (
                <li
                  key={d.id}
                  className={`px-3 py-2.5 ${
                    i < shown.length - 1
                      ? "border-b border-[var(--p-border)]"
                      : ""
                  } ${d.supersededBy ? "opacity-50" : ""}`}
                >
                  <p className="text-[13px] leading-snug">{d.body}</p>
                  <p className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[12px] text-[var(--p-text-dim)]">
                    <span className="min-w-0">
                      {d.attribution}
                      {d.link ? (
                        <>
                          {" — "}
                          <a
                            href={d.link.url}
                            className="underline underline-offset-2"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {d.link.label}
                          </a>
                        </>
                      ) : null}
                      {d.supersededBy ? " · superseded" : ""}
                    </span>
                    {decisionStamp(d) ? (
                      <span className="shrink-0 font-medium text-[var(--p-accent)]">
                        {decisionStamp(d)}
                      </span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
          {ordered.length > visible ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-3 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-2)]"
            >
              Load more ({ordered.length - visible} more)
            </button>
          ) : null}
        </>
      )}

      {role === "pm" ? (
        <PmAnnotation linkLabel="+ Log a decision" href={`/console?p=${slug}`}>
          One line, a date, who agreed it, and an optional Figma or doc link. Entries can
          be superseded but never deleted.
        </PmAnnotation>
      ) : null}

      {nextCall ? (
        <div className="mt-4 text-[13px] text-[var(--p-text-dim)]">
          <p>
            <span className="font-bold text-[var(--p-text)]">{nextCall.label}</span>
            {nextCall.date ? ` — ${formatDate(nextCall.date)}` : ""}{" "}
            {nextCall.agendaUrl ? (
              <a
                href={nextCall.agendaUrl}
                className="underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                See the agenda
              </a>
            ) : null}
          </p>
          {nextCall.agenda ? (
            <div
              className="agenda-content mt-1.5 [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: sanitizeAgendaHtml(nextCall.agenda) }}
            />
          ) : null}
        </div>
      ) : null}

      {role === "pm" ? (
        <div className="mt-4">
          {addingNote ? (
            <AddNoteForm slug={slug} onClose={() => setAddingNote(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setAddingNote(true)}
              className="rounded-lg border border-dashed border-[var(--p-border)] px-3 py-2 text-[13px] font-medium text-[var(--p-accent)] hover:bg-[var(--p-accent-weak)]"
            >
              + Add note
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
