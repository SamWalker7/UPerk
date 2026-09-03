import { PmAnnotation } from "./PmAnnotation";
import { Card, SectionTitle } from "./ui";
import type { Decision, PortalRole } from "@/lib/portal/types";

export function Decisions({
  decisions,
  intro,
  nextCall,
  role,
  slug,
}: {
  decisions: Decision[];
  intro?: string;
  nextCall?: { label: string; agendaUrl?: string };
  role: PortalRole;
  slug: string;
}) {
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
        <Card className="p-0">
          <ul>
            {decisions.map((d, i) => (
              <li
                key={d.id}
                className={`flex gap-4 p-5 ${
                  i < decisions.length - 1
                    ? "border-b border-[var(--p-border)]"
                    : ""
                } ${d.supersededBy ? "opacity-50" : ""}`}
              >
                <span className="w-16 shrink-0 text-[13px] font-medium text-[var(--p-accent)]">
                  {d.date}
                </span>
                <div>
                  <p className="text-[14px] leading-relaxed">{d.body}</p>
                  <p className="mt-1 text-[12px] text-[var(--p-text-dim)]">
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
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {role === "pm" ? (
        <PmAnnotation linkLabel="+ Log a decision" href={`/portal/console?p=${slug}`}>
          One line, a date, who agreed it, and an optional Figma or doc link. Entries can
          be superseded but never deleted.
        </PmAnnotation>
      ) : null}

      {nextCall ? (
        <p className="mt-4 text-[13px] text-[var(--p-text-dim)]">
          {nextCall.label}{" "}
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
      ) : null}
    </div>
  );
}
