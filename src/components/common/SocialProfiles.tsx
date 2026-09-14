"use client";

import { useId } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SOCIAL_PLATFORMS, type SocialProfile } from "@/lib/forms";

export default function SocialProfiles({ value, onChange, error }: {
  value: SocialProfile[];
  onChange: (profiles: SocialProfile[]) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="mb-2 text-base font-medium text-gray-900 dark:text-white">Social profiles <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span></legend>
      {value.map((profile, index) => (
        <div key={index} className="grid grid-cols-[1fr_44px] gap-2 sm:grid-cols-[130px_1fr_44px]">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor={`${id}-platform-${index}`} className="sr-only">Platform {index + 1}</label>
            <select id={`${id}-platform-${index}`} className="marketing-input" value={profile.platform} onChange={event => onChange(value.map((item, i) => i === index ? { ...item, platform: event.target.value } : item))}>
              <option value="">Choose platform</option>
              {SOCIAL_PLATFORMS.map(platform => <option key={platform} disabled={value.some((item, i) => i !== index && item.platform === platform)}>{platform}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor={`${id}-handle-${index}`} className="sr-only">Handle or profile URL {index + 1}</label>
            <input id={`${id}-handle-${index}`} className="marketing-input" placeholder="@handle or profile URL" value={profile.handle} maxLength={200} autoCapitalize="none" spellCheck={false} onChange={event => onChange(value.map((item, i) => i === index ? { ...item, handle: event.target.value } : item))} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
          </div>
          <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} title="Remove profile" aria-label={`Remove social profile ${index + 1}`} className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-gray-700 dark:text-gray-300">
            <Trash2 aria-hidden className="h-4 w-4" />
          </button>
        </div>
      ))}
      {value.length < SOCIAL_PLATFORMS.length && (
        <button type="button" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-blue-400" onClick={() => onChange([...value, { platform: "", handle: "" }])}>
          <Plus aria-hidden className="h-4 w-4" /> Add social profile
        </button>
      )}
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </fieldset>
  );
}
