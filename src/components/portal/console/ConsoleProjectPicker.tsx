"use client";

import { useRouter } from "next/navigation";

export function ConsoleProjectPicker({
  projects,
  selected,
}: {
  projects: { slug: string; name: string }[];
  selected?: string;
}) {
  const router = useRouter();
  if (projects.length === 0) return null;
  return (
    <select
      value={selected}
      onChange={(e) => {
        router.push(`/portal/console?p=${e.target.value}`);
        router.refresh();
      }}
      className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 text-[13px]"
    >
      {projects.map((p) => (
        <option key={p.slug} value={p.slug}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
