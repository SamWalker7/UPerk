"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A popup modal for editing the next call's agenda as free-form text.
 * Keeps its own draft state while open so keystrokes don't patch the
 * parent's data on every render; "Save" commits the draft via `onSave`.
 */
export function AgendaDialog({
  open,
  value,
  onSave,
  onClose,
}: {
  open: boolean;
  value: string;
  onSave: (agenda: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset the draft to the current value each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setDraft(value);
    textareaRef.current?.focus();
  }, [open, value]);

  if (!open) return null;

  function save() {
    onSave(draft);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Call agenda"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
        <h2 className="text-[15px] font-bold">Call agenda</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
          Talking points for the next call. Shown to the client as-is.
        </p>

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={8}
          placeholder={"1. Review milestone progress\n2. …"}
          className="mt-4 w-full resize-y rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] leading-relaxed outline-none focus:border-[var(--p-accent)]"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--p-border)] px-3.5 py-2 text-[13px] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[var(--p-accent)] px-3.5 py-2 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Save agenda
          </button>
        </div>
      </div>
    </div>
  );
}
