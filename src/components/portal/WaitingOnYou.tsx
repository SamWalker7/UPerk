import { PmAnnotation } from "./PmAnnotation";
import { SectionTitle } from "./ui";
import type { ClientRequest, PortalRole } from "@/lib/portal/types";

function ActionButton({ label, kind }: { label: string; kind: string }) {
  // Display-only until the backend is wired.
  const base =
    "cursor-default rounded-lg px-4 py-2 text-[13px] font-semibold";
  return (
    <button
      type="button"
      disabled
      title="Available after launch"
      className={
        kind === "primary"
          ? `${base} bg-[var(--p-accent)] text-white opacity-90`
          : `${base} border border-[var(--p-border)] text-[var(--p-text)]`
      }
    >
      {label}
    </button>
  );
}

function RequestCard({
  req,
  role,
  slug,
}: {
  req: ClientRequest;
  role: PortalRole;
  slug: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold">
          <span
            className={`h-2 w-2 rounded-full ${
              req.blocking ? "bg-[var(--p-accent)]" : "bg-[var(--p-warn)]"
            }`}
          />
          {req.title}
        </h3>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-[var(--p-accent)]">{req.daysOpen}</p>
          <p className="text-[11px] text-[var(--p-text-dim)]">days open</p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
        {req.body}
      </p>

      {req.options && req.options.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {req.options.map((opt) => (
            <div
              key={opt.label}
              className="rounded-xl border border-[var(--p-border)] p-4"
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-[var(--p-surface-2)] text-[12px] text-[var(--p-text-dim)]">
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
              <p className="mt-2 text-[12px] font-medium text-[var(--p-text)]">
                {opt.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {req.note ? (
        <div className="mt-4 rounded-lg bg-[var(--p-warn-bg)] px-4 py-3 text-[13px] text-[var(--p-warn)]">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-current align-middle" />
          {req.note}
        </div>
      ) : null}

      {req.subNote ? (
        <p className="mt-3 flex items-center gap-2 text-[12px] text-[var(--p-text-dim)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--p-accent)]" />
          {req.subNote}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {req.actions.map((a) => (
          <ActionButton key={a.label} label={a.label} kind={a.kind} />
        ))}
      </div>

      {role === "pm" && req.pmNote ? (
        <PmAnnotation linkLabel="Edit request" href={`/console?p=${slug}`}>
          {req.pmNote}
        </PmAnnotation>
      ) : null}
    </div>
  );
}

export function WaitingOnYou({
  requests,
  role,
  slug,
}: {
  requests: ClientRequest[];
  role: PortalRole;
  slug: string;
}) {
  const open = requests.filter((r) => r.status === "open");

  return (
    <div>
      <SectionTitle
        title="Waiting on you"
        aside={open.length === 0 ? "Nothing open" : `${open.length} open`}
      />
      {open.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--p-border)] p-10 text-center text-[13px] text-[var(--p-text-dim)]">
          You&apos;re all caught up.
        </div>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {open.map((req) => (
            <RequestCard key={req.id} req={req} role={role} slug={slug} />
          ))}
        </div>
      )}
      {role === "pm" ? (
        <PmAnnotation
          linkLabel="+ New client request"
          href={`/console?p=${slug}`}
        >
          Raise a request, set assignee and due date, and choose what the client&apos;s
          buttons say (two options, one acknowledgement, or an action + fallback).
        </PmAnnotation>
      ) : null}
    </div>
  );
}
