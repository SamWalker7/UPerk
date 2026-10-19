"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react";
import { sanitizeAgendaHtml } from "@/lib/portal/sanitizeHtml";

function ToolbarButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      // mousedown + preventDefault keeps focus (and the current selection)
      // in the editable area — a click would blur it first and the
      // execCommand would then have nothing to apply to.
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--p-text-dim)] hover:bg-[var(--p-accent-weak)] hover:text-[var(--p-accent)]"
    >
      {children}
    </button>
  );
}

/**
 * A popup modal for editing the next call's agenda as basic rich text
 * (bold, italic, bullet/numbered lists, links). Keeps its own draft state
 * while open so keystrokes don't patch the parent's data on every render;
 * "Save" sanitizes the draft HTML and commits it via `onSave`.
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
  const editorRef = useRef<HTMLDivElement>(null);

  // Reset the draft to the current value each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setDraft(value);
    if (editorRef.current) editorRef.current.innerHTML = value;
    editorRef.current?.focus();
  }, [open, value]);

  // Esc closes the dialog, like the other console dialogs.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    setDraft(editorRef.current?.innerHTML || "");
  }

  function addLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    exec("createLink", url);
  }

  function save() {
    onSave(sanitizeAgendaHtml(draft));
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#061827]/55 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agenda-dialog-title"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_24px_70px_rgba(6,24,39,.3)] sm:max-w-lg sm:rounded-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--p-border)] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--p-accent)]">
              Next call
            </p>
            <h2 id="agenda-dialog-title" className="mt-1 text-xl font-bold tracking-tight">
              Call agenda
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--p-text-dim)]">
              Talking points for the next call. Shown to the client as-is.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-xl leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)]"
          >
            ×
          </button>
        </header>

        <div className="m-5 sm:mx-6 overflow-hidden rounded-xl border border-[var(--p-border)] focus-within:border-[var(--p-accent)] focus-within:ring-2 focus-within:ring-[var(--p-accent-weak)]">
          <div className="flex items-center gap-1 border-b border-[var(--p-border)] bg-[var(--p-surface-2)] px-2 py-1.5">
            <ToolbarButton label="Bold" onClick={() => exec("bold")}>
              <Bold className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => exec("italic")}>
              <Italic className="h-3.5 w-3.5" />
            </ToolbarButton>
            <span className="mx-1 h-4 w-px bg-[var(--p-border)]" />
            <ToolbarButton label="Bullet list" onClick={() => exec("insertUnorderedList")}>
              <List className="h-3.5 w-3.5" />
            </ToolbarButton>
            <ToolbarButton label="Numbered list" onClick={() => exec("insertOrderedList")}>
              <ListOrdered className="h-3.5 w-3.5" />
            </ToolbarButton>
            <span className="mx-1 h-4 w-px bg-[var(--p-border)]" />
            <ToolbarButton label="Link" onClick={addLink}>
              <LinkIcon className="h-3.5 w-3.5" />
            </ToolbarButton>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setDraft(e.currentTarget.innerHTML)}
            data-placeholder="1. Review milestone progress&#10;2. …"
            className="agenda-editor min-h-[12rem] w-full resize-y px-3.5 py-3 text-[14px] leading-relaxed outline-none [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
          />
        </div>

        <footer className="flex justify-end gap-2 border-t border-[var(--p-border)] bg-[var(--p-surface-2)] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-[13px] font-semibold hover:bg-[var(--p-bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[var(--p-accent)] px-4 py-2.5 text-[13px] font-semibold text-white hover:brightness-95"
          >
            Save agenda
          </button>
        </footer>
      </div>
    </div>
  );
}
