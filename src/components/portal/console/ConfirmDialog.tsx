"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "../Spinner";

/**
 * A blocking confirmation modal for destructive actions. `onConfirm` runs the
 * work; the dialog keeps a spinner up while it's in flight and shows the thrown
 * message on failure. Resolve/throw from `onConfirm` to close/keep it open.
 *
 * For an extra guard, pass `confirmPhrase` — the confirm button stays disabled
 * until the user types it exactly (used for deleting a whole project).
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  confirmPhrase,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  confirmPhrase?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [typed, setTyped] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Reset transient state each time it opens; focus Cancel (the safe default).
  useEffect(() => {
    if (!open) return;
    setBusy(false);
    setError("");
    setTyped("");
    cancelRef.current?.focus();
  }, [open]);

  // Esc to cancel (ignored while the action is running).
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, busy, onClose]);

  if (!open) return null;

  const phraseOk = !confirmPhrase || typed.trim() === confirmPhrase;

  async function confirm() {
    if (busy || !phraseOk) return;
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={() => !busy && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"
      >
        <h2 className="text-[15px] font-bold">{title}</h2>
        <div className="mt-1.5 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
          {body}
        </div>

        {confirmPhrase ? (
          <label className="mt-4 block">
            <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
              Type{" "}
              <span className="font-semibold text-[var(--p-text)]">
                {confirmPhrase}
              </span>{" "}
              to confirm
            </span>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              disabled={busy}
              className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-risk)]"
            />
          </label>
        ) : null}

        {error ? (
          <p className="mt-3 text-[13px] text-[var(--p-risk)]">{error}</p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-[var(--p-border)] px-3.5 py-2 text-[13px] font-medium disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy || !phraseOk}
            className="flex items-center gap-2 rounded-lg bg-[var(--p-risk)] px-3.5 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            {busy ? (
              <>
                <Spinner className="h-3.5 w-3.5" />
                Deleting…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
