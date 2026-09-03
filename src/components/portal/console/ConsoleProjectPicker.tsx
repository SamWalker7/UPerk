"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../Spinner";

export function ConsoleProjectPicker({
  projects,
  selected,
}: {
  projects: { slug: string; name: string }[];
  selected?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  if (projects.length === 0) return null;
  return (
    <span className="flex items-center gap-2">
      <select
        value={selected}
        disabled={pending}
        onChange={(e) => {
          const p = e.target.value;
          startTransition(() => {
            router.push(`/console?p=${p}`);
            router.refresh();
          });
        }}
        className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[13px] disabled:opacity-50"
      >
        {projects.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      {pending ? <Spinner className="h-4 w-4 text-[var(--p-text-dim)]" /> : null}
    </span>
  );
}
