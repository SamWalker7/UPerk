import type { ReactNode } from "react";

export function Section({
  id,
  title,
  aside,
  children,
}: {
  id?: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-4 pt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {aside ? (
          <div className="text-[13px] text-slate-500 dark:text-slate-400">{aside}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}
