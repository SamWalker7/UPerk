"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "../Spinner";

export type DecisionInput = {
  body: string;
  date: string;
  attribution?: string;
};

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function DecisionDialog({
  open,
  superseding,
  onSubmit,
  onClose,
}: {
  open: boolean;
  superseding?: { body: string } | null;
  onSubmit: (input: DecisionInput) => Promise<void>;
  onClose: () => void;
}) {
  const [body, setBody] = useState("");
  const [date, setDate] = useState(today);
  const [attribution, setAttribution] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    setBody("");
    setDate(today());
    setAttribution("");
    setBusy(false);
    setError("");
    window.setTimeout(() => bodyRef.current?.focus(), 0);
  }, [open, superseding]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, busy, onClose]);

  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim() || !date || busy) return;
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        body: body.trim(),
        date,
        ...(attribution.trim() ? { attribution: attribution.trim() } : {}),
      });
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not log the decision.");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061827]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="decision-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <form onSubmit={submit} className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_24px_70px_rgba(6,24,39,.3)]">
        <header className="border-b border-[var(--p-border)] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">Decision log</p>
              <h2 id="decision-dialog-title" className="mt-1 text-xl font-bold tracking-tight">
                {superseding ? "Supersede decision" : "Log a decision"}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
                {superseding ? "Add the replacement decision. The original remains in the audit history." : "Record what was agreed and when the decision was made."}
              </p>
            </div>
            <button type="button" onClick={onClose} disabled={busy} className="rounded-lg p-2 text-xl leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)] disabled:opacity-40" aria-label="Close">×</button>
          </div>
        </header>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          {superseding ? (
            <div className="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--p-text-dim)]">Original decision</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--p-text)]">{superseding.body}</p>
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-[var(--p-text)]">Decision <span className="text-[var(--p-risk)]">*</span></span>
            <textarea ref={bodyRef} value={body} onChange={(event) => setBody(event.target.value)} rows={4} placeholder={superseding ? "What replaces the original decision?" : "What was agreed?"} disabled={busy} className="w-full resize-none rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-3 text-[14px] leading-relaxed outline-none transition focus:border-[var(--p-accent)] focus:ring-2 focus:ring-[var(--p-accent-weak)] disabled:opacity-60" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[var(--p-text)]">Decision date <span className="text-[var(--p-risk)]">*</span></span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required disabled={busy} className="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)] focus:ring-2 focus:ring-[var(--p-accent-weak)] disabled:opacity-60" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[var(--p-text)]">Agreed by <span className="font-normal text-[var(--p-text-dim)]">(optional)</span></span>
              <input value={attribution} onChange={(event) => setAttribution(event.target.value)} placeholder="Client / project team" disabled={busy} className="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--p-accent)] focus:ring-2 focus:ring-[var(--p-accent-weak)] disabled:opacity-60" />
            </label>
          </div>

          {error ? <p className="rounded-lg bg-[var(--p-risk-bg)] px-3 py-2 text-[13px] text-[var(--p-risk)]">{error}</p> : null}
        </div>

        <footer className="flex justify-end gap-2 border-t border-[var(--p-border)] bg-[var(--p-surface-2)] px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-[13px] font-semibold hover:bg-[var(--p-bg)] disabled:opacity-40">Cancel</button>
          <button type="submit" disabled={busy || !body.trim() || !date} className="flex min-w-[126px] items-center justify-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40">
            {busy ? <><Spinner className="h-3.5 w-3.5" />Saving…</> : superseding ? "Save replacement" : "Log decision"}
          </button>
        </footer>
      </form>
    </div>
  );
}
