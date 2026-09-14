/**
 * A faint, fixed-size dot grid used behind several sections for a
 * consistent "blueprint / dashboard" texture. Purely decorative —
 * `pointer-events-none` and `aria-hidden` keep it out of the way of
 * interaction and screen readers. Shared between the homepage and other
 * marketing pages (e.g. careers) instead of being redefined per file.
 */
export default function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06] ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}
