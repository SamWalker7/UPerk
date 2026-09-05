// Human-friendly date formatting for the portal UI.
//
// Data reaches us in two shapes: freeform human strings the PM typed
// ("1 Sept", "Fri 6 Nov", "Date unchanged since kick-off") and machine
// timestamps from the backend ("2026-09-05T21:09:28.161Z", "2026-09-05").
// We only reformat the machine ones; everything else passes through.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;

/** "5 Sept 2026" for a bare date, "5 Sept 2026, 21:09" when a time is present. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const v = value.trim();
  const hasTime = ISO_DATETIME.test(v);
  if (!hasTime && !ISO_DATE.test(v)) return v; // already human — leave it

  const d = new Date(hasTime ? v : `${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return v;

  const date = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (!hasTime) return date;
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}

/** Date only, never a time — "5 Sept 2026". */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const v = value.trim();
  if (!ISO_DATETIME.test(v) && !ISO_DATE.test(v)) return v;
  const d = new Date(ISO_DATE.test(v) ? `${v}T00:00:00` : v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
