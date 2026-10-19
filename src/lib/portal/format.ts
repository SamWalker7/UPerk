// Human-friendly date formatting for the portal UI.
//
// Data reaches us in two shapes: freeform human strings the PM typed
// ("1 Sept", "Fri 6 Nov", "Date unchanged since kick-off") and machine
// timestamps from the backend ("2026-09-05T21:09:28.161Z", "2026-09-05").
// We only reformat the machine ones; everything else passes through.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;

/** "Sept 5, 2026" for a bare date, "Sept 5, 2026, 21:09" when a time is present. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const v = value.trim();
  const hasTime = ISO_DATETIME.test(v);
  if (!hasTime && !ISO_DATE.test(v)) return v; // already human — leave it

  const d = new Date(hasTime ? v : `${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return v;

  const date = d.toLocaleDateString("en-US", {
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

/** Time only — "4:30pm". Empty string if the value has no time component. */
export function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  const v = value.trim();
  if (!ISO_DATETIME.test(v)) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s/g, "")
    .toLowerCase();
}

/** "Today", "Tomorrow", "In 5 days", "3 days ago" for a bare ISO date.
 *  Empty string for anything that isn't an ISO date. */
export function relativeDay(value: string | null | undefined): string {
  const v = value?.trim() || "";
  if (!ISO_DATE.test(v)) return "";
  const target = new Date(`${v}T00:00:00`);
  if (Number.isNaN(target.getTime())) return "";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return days > 0 ? `In ${days} days` : `${-days} days ago`;
}

/** Date only, never a time — "Jan 25, 2026". */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const v = value.trim();
  if (!ISO_DATETIME.test(v) && !ISO_DATE.test(v)) return v;
  const d = new Date(ISO_DATE.test(v) ? `${v}T00:00:00` : v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
