import { Section } from "./Section";
import { PmAnnotation } from "./PmAnnotation";
import type { ClientRequest, PortalRole } from "@/lib/portal/types";

function ActionButton({ label, kind }: { label: string; kind: string }) {
  // Display-only in v1.
  const base =
    "cursor-default rounded-lg px-4 py-2 text-[13px] font-semibold transition-opacity";
  return (
    <button
      type="button"
      disabled
      title="Available after launch"
      className={
        kind === "primary"
          ? `${base} bg-blue-700 text-white opacity-90`
          : `${base} border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200`
      }
    >
      {label}
    </button>
  );
}

function RequestCard({
  req,
  role,
}: {
  req: ClientRequest;
  role: PortalRole;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold">
          <span
            className={`h-2 w-2 rounded-full ${
              req.blocking ? "bg-blue-500" : "bg-amber-500"
            }`}
          />
          {req.title}
        </h3>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {req.daysOpen}
          </p>
          <p className="text-[11px] text-slate-400">days open</p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
        {req.body}
      </p>

      {req.options && req.options.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {req.options.map((opt) => (
            <div
              key={opt.label}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-slate-50 text-[12px] text-slate-400 dark:bg-slate-800">
                {opt.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={opt.imageUrl}
                    alt={opt.label}
                    className="h-full w-full rounded-lg object-contain"
                  />
                ) : (
                  "preview"
                )}
              </div>
              <p className="mt-2 text-[12px] font-medium text-slate-600 dark:text-slate-300">
                {opt.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {req.note ? (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-[13px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500 align-middle" />
          {req.note}
        </div>
      ) : null}

      {req.subNote ? (
        <p className="mt-3 flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          {req.subNote}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {req.actions.map((a) => (
          <ActionButton key={a.label} label={a.label} kind={a.kind} />
        ))}
      </div>

      {role === "pm" && req.pmNote ? (
        <PmAnnotation linkLabel="Edit request" href="/portal/console">
          {req.pmNote}
        </PmAnnotation>
      ) : null}
    </div>
  );
}

export function WaitingOnYou({
  requests,
  role,
}: {
  requests: ClientRequest[];
  role: PortalRole;
}) {
  const open = requests.filter((r) => r.status === "open");
  if (open.length === 0) return null;

  return (
    <Section
      id="waiting-on-you"
      title="Waiting on you"
      aside={`${open.length} open — both answerable in a minute`}
    >
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {open.map((req) => (
          <RequestCard key={req.id} req={req} role={role} />
        ))}
      </div>
      {role === "pm" ? (
        <PmAnnotation linkLabel="+ New client request" href="/portal/console">
          Raise a request, set assignee and due date, and choose what the client&apos;s
          buttons say (two options, one acknowledgement, or an action + fallback).
        </PmAnnotation>
      ) : null}
    </Section>
  );
}
