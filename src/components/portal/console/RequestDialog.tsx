"use client";

import { useEffect, useRef, useState } from "react";
import type { ClientRequest, RequestAction } from "@/lib/portal/types";

export type NewRequestInput = Omit<ClientRequest, "id" | "status">;

export function RequestDialog({
  open,
  onSubmit,
  onClose,
}: {
  open: boolean;
  onSubmit: (request: NewRequestInput) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [daysOpen, setDaysOpen] = useState(0);
  const [note, setNote] = useState("");
  const [subNote, setSubNote] = useState("");
  const [pmNote, setPmNote] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [actions, setActions] = useState("");
  const [options, setOptions] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setBody("");
    setDaysOpen(0);
    setNote("");
    setSubNote("");
    setPmNote("");
    setBlocking(false);
    setActions("");
    setOptions("");
    window.setTimeout(() => titleRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const actionLabels = actions.split(",").map((label) => label.trim()).filter(Boolean);
    const actionsValid = actionLabels.length > 0;
    if (!title.trim() || !body.trim() || !actionsValid) return;
    const optionLabels = options.split(",").map((label) => label.trim()).filter(Boolean);
    const requestActions: RequestAction[] = actionLabels.map((label, index) => ({
      label,
      kind: index < 2 ? "primary" : "secondary",
      intent: label.toLowerCase().includes("approve")
        ? "approve"
        : label.toLowerCase().includes("decline") || label.toLowerCase().includes("reject")
          ? "decline"
          : label.toLowerCase().includes("discuss")
            ? "discuss"
            : "choice",
    }));
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      daysOpen,
      blocking,
      actions: requestActions,
      ...(note.trim() ? { note: note.trim() } : {}),
      ...(subNote.trim() ? { subNote: subNote.trim() } : {}),
      ...(pmNote.trim() ? { pmNote: pmNote.trim() } : {}),
      ...(optionLabels.length ? { options: optionLabels.map((label) => ({ label })) } : {}),
    });
    onClose();
  }

  const inputClass = "w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2.5 text-[13px] outline-none transition focus:border-[var(--p-accent)] focus:ring-2 focus:ring-[var(--p-accent-weak)]";
  const labelClass = "mb-1.5 block text-[12px] font-semibold text-[var(--p-text)]";
  const actionCount = actions.split(",").map((label) => label.trim()).filter(Boolean).length;
  const actionsValid = actionCount > 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061827]/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form onSubmit={submit} className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_24px_70px_rgba(6,24,39,.3)]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--p-border)] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">Client request</p>
            <h2 id="request-dialog-title" className="mt-1 text-xl font-bold tracking-tight">New client request</h2>
            <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">Add everything the client needs to understand and respond.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-xl leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)]" aria-label="Close">×</button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
            <label>
              <span className={labelClass}>Title <span className="text-[var(--p-risk)]">*</span></span>
              <input ref={titleRef} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you need from the client?" className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>Days open</span>
              <input type="number" min={0} value={daysOpen} onFocus={(event) => event.currentTarget.select()} onChange={(event) => setDaysOpen(Math.max(0, Number(event.target.value) || 0))} className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Description <span className="text-[var(--p-risk)]">*</span></span>
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} placeholder="Explain the request and why it matters." className={inputClass + " resize-none leading-relaxed"} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Client note <span className="font-normal text-[var(--p-text-dim)]">(optional)</span></span>
              <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Highlighted note" className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>Sub-note <span className="font-normal text-[var(--p-text-dim)]">(optional)</span></span>
              <input value={subNote} onChange={(event) => setSubNote(event.target.value)} placeholder="Timing or dependency" className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>PM note <span className="font-normal text-[var(--p-text-dim)]">(optional)</span></span>
            <textarea value={pmNote} onChange={(event) => setPmNote(event.target.value)} rows={2} placeholder="Internal guidance for the project team" className={inputClass + " resize-none"} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Client button labels <span className="text-[var(--p-risk)]">*</span></span>
              <input value={actions} onChange={(event) => setActions(event.target.value)} placeholder="Approve, Decline — or Choose A, Choose B, Discuss Friday" className={inputClass} />
              <span className="mt-1 block text-[11px] text-[var(--p-text-dim)]">Write any labels you want. Separate each client button with a comma.</span>
              {!actionsValid ? <span className="mt-1 block text-[11px] text-[var(--p-risk)]">Add at least one client button label.</span> : null}
            </label>
            <label>
              <span className={labelClass}>Option labels <span className="font-normal text-[var(--p-text-dim)]">(optional)</span></span>
              <input value={options} onChange={(event) => setOptions(event.target.value)} placeholder="Option A, Option B" className={inputClass} />
              <span className="mt-1 block text-[11px] text-[var(--p-text-dim)]">Separate multiple options with commas.</span>
            </label>
          </div>

          <label className="flex w-fit items-center gap-2 rounded-lg border border-[var(--p-border)] px-3 py-2.5 text-[13px] font-medium">
            <input type="checkbox" checked={blocking} onChange={(event) => setBlocking(event.target.checked)} className="h-4 w-4 accent-[var(--p-accent)]" />
            Blocking work now
          </label>
        </div>

        <footer className="flex justify-end gap-2 border-t border-[var(--p-border)] bg-[var(--p-surface-2)] px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-[13px] font-semibold hover:bg-[var(--p-bg)]">Cancel</button>
          <button type="submit" disabled={!title.trim() || !body.trim() || !actionsValid} className="rounded-lg bg-[var(--p-accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:brightness-95 disabled:opacity-40">Add request</button>
        </footer>
      </form>
    </div>
  );
}
