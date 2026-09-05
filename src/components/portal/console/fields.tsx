"use client";

import { useId, useState, type ReactNode } from "react";

/* ---------- text / textarea ---------- */

export function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  placeholder,
  hint,
  type = "text",
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  /** visible rows for a textarea; the box is capped at this height (no free grow) */
  rows?: number;
  placeholder?: string;
  hint?: string;
  type?: string;
  invalid?: boolean;
}) {
  const id = useId();
  const control =
    "w-full rounded-lg border bg-transparent px-3 py-2 text-[13px] outline-none transition-colors focus:border-[var(--p-accent)] " +
    (invalid
      ? "border-[var(--p-risk)]"
      : "border-[var(--p-border)]");
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
        {hint ? (
          <span className="font-normal text-[var(--p-text-dim)]/80">{hint}</span>
        ) : null}
      </span>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={control + " resize-y overflow-auto"}
          style={{ maxHeight: `${rows * 1.5 + 1}rem` }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={control}
        />
      )}
    </label>
  );
}

/* ---------- number ---------- */

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
      </span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          let n = Number(e.target.value);
          if (!Number.isFinite(n)) n = 0;
          if (min != null) n = Math.max(min, n);
          if (max != null) n = Math.min(max, n);
          onChange(n);
        }}
        className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
      />
    </label>
  );
}

/* ---------- select ---------- */

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: readonly T[] | readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  hint?: string;
}) {
  const id = useId();
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  // Keep an off-list stored value selectable rather than silently snapping it.
  const hasCurrent = opts.some((o) => o.value === value);
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
        {hint ? (
          <span className="font-normal text-[var(--p-text-dim)]/80">{hint}</span>
        ) : null}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
      >
        {!hasCurrent && value ? (
          <option value={value}>{value} (current)</option>
        ) : null}
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------- dates ---------- */

/** Strict ISO date (YYYY-MM-DD) — native calendar, no free-text. */
export function DateField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
        {hint ? (
          <span className="font-normal text-[var(--p-text-dim)]/80">{hint}</span>
        ) : null}
      </span>
      <input
        id={id}
        type="date"
        value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
      />
    </label>
  );
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "1 Sept", "6 Nov" — the human style already used across the portal. */
function formatHumanDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const month = MONTHS_SHORT[Number(m[2]) - 1];
  const label = month === "Sep" ? "Sept" : month;
  return `${Number(m[3])} ${label}`;
}

/** Best-effort parse of a stored human date back to ISO for the calendar. */
function humanDateToIso(value: string): string {
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  // "1 Sept", "1 September", "Fri 6 Nov", "6 Nov 2025"
  const m = /(\d{1,2})\s+([A-Za-z]{3,})|([A-Za-z]{3,})\s+(\d{1,2})/.exec(v);
  if (!m) return "";
  const day = Number(m[1] ?? m[4]);
  const monRaw = (m[2] ?? m[3] ?? "").slice(0, 3).toLowerCase();
  const monIdx = MONTHS_SHORT.findIndex((x) => x.toLowerCase() === monRaw);
  if (!day || monIdx < 0) return "";
  const yearMatch = /\b(20\d{2})\b/.exec(v);
  const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
  return `${year}-${String(monIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * A date that is stored as a human string (e.g. "1 Sept"). Calendar picker by
 * default; a toggle drops to free text for ranges and notes like
 * "8 Jun — 24 Jul" or "Date unchanged since kick-off".
 */
export function SmartDateField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  const parsedIso = humanDateToIso(value);
  // If we can't parse it to a single date and it's non-empty, it's a range/note.
  const [freeText, setFreeText] = useState(value.trim() !== "" && !parsedIso);

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
        <button
          type="button"
          onClick={() => setFreeText((f) => !f)}
          className="font-normal text-[var(--p-accent)] underline underline-offset-2"
        >
          {freeText ? "pick a date" : "type it instead"}
        </button>
      </span>
      {freeText ? (
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder ?? "e.g. 8 Jun — 24 Jul"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
        />
      ) : (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="date"
            value={parsedIso}
            onChange={(e) =>
              onChange(e.target.value ? formatHumanDate(e.target.value) : "")
            }
            className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
          />
          {value && !parsedIso ? (
            <span className="shrink-0 text-[11px] text-[var(--p-warn)]">
              “{value}”
            </span>
          ) : null}
        </div>
      )}
      {hint ? (
        <span className="mt-1 block text-[11px] font-normal text-[var(--p-text-dim)]/80">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/* ---------- image (URL or uploaded file → base64 data URI) ---------- */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/**
 * An image slot: paste a URL or upload a file (stored as a base64 data URI in
 * the same string field). Always shows a preview of whatever is set — including
 * values that came back from the API.
 */
export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useId();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isData = value.startsWith("data:");

  async function pick(file: File | undefined) {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn’t an image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(
        `Image is ${(file.size / 1024 / 1024).toFixed(1)} MB — max 5 MB.`,
      );
      return;
    }
    setBusy(true);
    try {
      onChange(await readFileAsDataUrl(file));
    } catch {
      setError("Couldn’t read that file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="block">
      <span className="mb-1 flex items-center justify-between gap-2 text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
        {hint ? (
          <span className="font-normal text-[var(--p-text-dim)]/80">{hint}</span>
        ) : null}
      </span>

      <div className="flex items-start gap-3">
        {/* Preview */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-2)] text-[var(--p-text-dim)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setError("Preview failed to load.")}
            />
          ) : (
            <span className="text-lg">🖼️</span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            type="text"
            value={isData ? "" : value}
            placeholder={isData ? "Uploaded image (embedded)" : "https://…"}
            disabled={isData}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)] disabled:opacity-60"
          />
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <label className="cursor-pointer rounded-md border border-[var(--p-border)] px-2 py-1 font-medium text-[var(--p-text-dim)] hover:bg-[var(--p-surface-2)] hover:text-[var(--p-text)]">
              {busy ? "Reading…" : "Upload file"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0])}
              />
            </label>
            {value ? (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setError("");
                }}
                className="text-[var(--p-risk)] underline underline-offset-2"
              >
                Remove
              </button>
            ) : null}
            {isData ? (
              <span className="text-[var(--p-text-dim)]">
                embedded ·{" "}
                {Math.round((value.length * 0.75) / 1024).toLocaleString()} KB
              </span>
            ) : null}
          </div>
          {error ? (
            <p className="text-[11px] text-[var(--p-risk)]">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------- read-only display ---------- */

export function ReadOnlyStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <span className="mb-1 block text-[12px] font-medium text-[var(--p-text-dim)]">
        {label}
      </span>
      <p className="text-[13px] text-[var(--p-text)]">{value}</p>
      {note ? (
        <p className="mt-0.5 text-[11px] text-[var(--p-text-dim)]">{note}</p>
      ) : null}
    </div>
  );
}

/* ---------- checkbox ---------- */

export function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[12px] text-[var(--p-text)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-[var(--p-border)] accent-[var(--p-accent)]"
      />
      {label}
    </label>
  );
}

/* ---------- layout ---------- */

export function Grid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "grid gap-3 " + (cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")
      }
    >
      {children}
    </div>
  );
}

/** A bordered sub-card for one item in a repeatable list, with reorder + remove controls. */
export function ItemCard({
  title,
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  count: number;
  onMove?: (dir: -1 | 1) => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)]/40 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-[12px] font-semibold text-[var(--p-text)]">
          {title || "Untitled"}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {onMove ? (
            <>
              <IconBtn
                label="Move up"
                disabled={index === 0}
                onClick={() => onMove(-1)}
              >
                ↑
              </IconBtn>
              <IconBtn
                label="Move down"
                disabled={index === count - 1}
                onClick={() => onMove(1)}
              >
                ↓
              </IconBtn>
            </>
          ) : null}
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2 py-1 text-[11px] font-medium text-[var(--p-risk)] hover:bg-[var(--p-risk-bg)]"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function IconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--p-border)] text-[12px] leading-none text-[var(--p-text-dim)] hover:bg-[var(--p-surface)] disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-dashed border-[var(--p-border)] px-3 py-2 text-[13px] font-medium text-[var(--p-accent)] hover:bg-[var(--p-accent-weak)]"
    >
      {label}
    </button>
  );
}

/** @deprecated kept for any external callers; prefer <Section> in the accordion. */
export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5">
      <h2 className="mb-3 text-[14px] font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
