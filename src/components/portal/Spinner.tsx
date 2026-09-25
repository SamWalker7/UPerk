import Image from "next/image";

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/** Full-area centered loading state for route loading.tsx files — a gently
 *  pulsing brand mark instead of a generic spinner, since this is the
 *  slowest, most-seen loading moment in the portal (first paint of a
 *  project or the projects list). */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-[var(--p-text-dim)]">
      <Image
        src="/icons/logo.svg"
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 animate-[portal-loader-pulse_1.4s_ease-in-out_infinite] rounded-[9px] [filter:saturate(1.15)_contrast(1.05)]"
      />
      <span className="text-[13px]">{label}</span>
    </div>
  );
}
