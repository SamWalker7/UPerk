"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";

export function NewProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/portal/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, client }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Could not create the project.");
        setBusy(false);
        return;
      }
      // keep the spinner up through the navigation
      router.push(`/console?p=${body.slug}`);
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="New project"
        className="flex items-center gap-1 rounded-md border border-[var(--p-border)] px-2 py-1 text-[13px] font-medium text-[var(--p-text-dim)] transition-colors hover:bg-[var(--p-surface-2)] hover:text-[var(--p-text)]"
      >
        <span aria-hidden>+</span> New
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={create}
            className="w-full max-w-sm rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"
          >
            <h2 className="text-[15px] font-bold">New project</h2>
            <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">
              Creates an empty project. You&apos;ll fill in the details in the console.
            </p>
            <label className="mt-4 block">
              <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
                Project name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
              />
            </label>
            <label className="mt-3 block">
              <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
                Client
              </span>
              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
              />
            </label>
            {error ? (
              <p className="mt-3 text-[13px] text-[var(--p-risk)]">{error}</p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[var(--p-border)] px-3.5 py-2 text-[13px] font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !name.trim()}
                className="flex items-center gap-2 rounded-lg bg-[var(--p-accent)] px-3.5 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
              >
                {busy ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" />
                    Creating…
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
