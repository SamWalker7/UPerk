import { Section, Card } from "./Section";
import { PmAnnotation } from "./PmAnnotation";
import type { Decision, PortalRole } from "@/lib/portal/types";

export function Decisions({
  decisions,
  intro,
  nextCall,
  role,
}: {
  decisions: Decision[];
  intro?: string;
  nextCall?: { label: string; agendaUrl?: string };
  role: PortalRole;
}) {
  return (
    <Section title="Decisions" aside="What we agreed, and when">
      {intro ? (
        <p className="mb-4 max-w-2xl text-[13px] text-slate-500 dark:text-slate-400">
          {intro}
        </p>
      ) : null}
      <Card className="p-0">
        <ul>
          {decisions.map((d, i) => (
            <li
              key={d.id}
              className={`flex gap-4 p-5 ${
                i < decisions.length - 1
                  ? "border-b border-slate-100 dark:border-slate-800"
                  : ""
              } ${d.supersededBy ? "opacity-50" : ""}`}
            >
              <span className="w-16 shrink-0 text-[13px] font-medium text-blue-700 dark:text-blue-300">
                {d.date}
              </span>
              <div>
                <p className="text-[14px] leading-relaxed">{d.body}</p>
                <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
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

      {role === "pm" ? (
        <PmAnnotation linkLabel="+ Log a decision" href="/portal/console">
          One line, a date, who agreed it, and an optional Figma or doc link. Entries can
          be superseded but never deleted.
        </PmAnnotation>
      ) : null}

      {nextCall ? (
        <p className="mt-4 text-[13px] text-slate-500 dark:text-slate-400">
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
    </Section>
  );
}
