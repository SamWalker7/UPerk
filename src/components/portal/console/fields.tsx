"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
        />
      )}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
      />
    </label>
  );
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5">
      <h2 className="mb-3 text-[14px] font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
