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

        <div className="mt-4 overflow-hidden rounded-lg border border-[var(--p-border)]">
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
            className="agenda-editor min-h-[10rem] w-full resize-y px-3 py-2 text-[13px] leading-relaxed outline-none [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
          />
        </div>

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
