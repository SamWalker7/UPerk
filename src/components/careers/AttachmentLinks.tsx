"use client";

import { Cloud, HardDrive, Link2, PackageOpen, Plus, Trash2 } from "lucide-react";
import type { ApplicationAttachment } from "@/lib/careers";

export function LinkProvider({ url }: { url: string }) {
  let host = "";
  try { host = new URL(url).hostname; } catch { /* A provider appears once a URL is entered. */ }
  const provider = host === "drive.google.com" || host === "docs.google.com" ? { Icon: HardDrive, name: "Google Drive" }
    : host === "dropbox.com" || host.endsWith(".dropbox.com") ? { Icon: PackageOpen, name: "Dropbox" }
    : host === "1drv.ms" || host === "onedrive.live.com" || host.endsWith(".sharepoint.com") ? { Icon: Cloud, name: "OneDrive" }
    : { Icon: Link2, name: "Shared link" };
  return <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"><provider.Icon aria-hidden className="h-3.5 w-3.5" />{provider.name}</span>;
}

// Shown once at the top of the "Links" step, above every link field, so an
// applicant knows what kind of link to paste before they start typing
// rather than only confirming it after the fact (that per-field
// confirmation still happens via `LinkProvider`, just moved above each URL
// input instead of under it).
export function SupportedProviders() {
  const providers = [
    { Icon: HardDrive, name: "Google Drive" },
    { Icon: PackageOpen, name: "Dropbox" },
    { Icon: Cloud, name: "OneDrive" },
  ];
  return (
    <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400">
      <span>Paste a link from</span>
      {providers.map(({ Icon, name }) => (
        <span key={name} className="inline-flex items-center gap-1.5"><Icon aria-hidden className="h-4 w-4" />{name}</span>
      ))}
    </p>
  );
}

export default function AttachmentLinks({ value, onChange, error }: { value: ApplicationAttachment[]; onChange: (value: ApplicationAttachment[]) => void; error?: string }) {
  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="mb-2 text-base font-medium">Other attachments <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(optional)</span></legend>
      {value.map((attachment, index) => (
        <div key={index} className="grid grid-cols-[1fr_44px] gap-2 border-t border-gray-200 pt-4 dark:border-white/10">
          <div className="min-w-0 space-y-2">
            <label htmlFor={`attachment-title-${index}`} className="sr-only">Attachment title {index + 1}</label>
            <input id={`attachment-title-${index}`} className="marketing-input" value={attachment.label} placeholder="Work sample, certificate, cover letter..." maxLength={100} onChange={event => onChange(value.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} />
            {attachment.url && <LinkProvider url={attachment.url} />}
            <label htmlFor={`attachment-url-${index}`} className="sr-only">Attachment link {index + 1}</label>
            <input id={`attachment-url-${index}`} name="attachments" type="url" className="marketing-input" value={attachment.url} placeholder="https://..." maxLength={1000} aria-invalid={Boolean(error)} aria-describedby={error ? "attachment-error" : undefined} onChange={event => onChange(value.map((item, i) => i === index ? { ...item, url: event.target.value } : item))} />
          </div>
          <button type="button" aria-label={`Remove attachment ${index + 1}`} title="Remove attachment" className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:text-red-600 dark:border-gray-700 dark:text-gray-300" onClick={() => onChange(value.filter((_, i) => i !== index))}><Trash2 aria-hidden className="h-4 w-4" /></button>
        </div>
      ))}
      {value.length < 3 && <button type="button" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2563eb] dark:text-[#2ca2f4]" onClick={() => onChange([...value, { label: "", url: "" }])}><Plus aria-hidden className="h-4 w-4" />Add attachment link</button>}
      {error && <p id="attachment-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </fieldset>
  );
}
