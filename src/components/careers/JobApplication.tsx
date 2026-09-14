"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Cloud, HardDrive, LoaderCircle, PackageOpen } from "lucide-react";
import SocialProfiles from "@/components/common/SocialProfiles";
import AttachmentLinks, { LinkProvider, SupportedProviders } from "./AttachmentLinks";
import { APPLICATION_SECTIONS, validateApplication, type ApplicationAttachment } from "@/lib/careers";
import { trackJobEvent } from "@/lib/analytics";
import type { SocialProfile } from "@/lib/forms";
import type { Job } from "@/lib/jobs";

const STEP_LABELS = ["About you", "Your role", "Experience", "Links", "Review"];

export default function JobApplication({ job, active, onBack }: { job: Job; active: boolean; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({ role: job.role });
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([]);
  const [attachments, setAttachments] = useState<ApplicationAttachment[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || submitted) return;
    trackJobEvent("career_application_step_view", job, { step: step + 1 });
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [active, job, step, submitted]);

  function setField(name: string, value: string) {
    setValues(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: "" }));
  }

  function showErrors(nextErrors: Record<string, string>) {
    setErrors(nextErrors);
    const name = Object.keys(nextErrors)[0];
    let nextStep = APPLICATION_SECTIONS.findIndex(section => section.fields.some(field => field.name === name));
    if (name === "socialProfiles" || name === "attachments") nextStep = 3;
    if (name === "consent") nextStep = 4;
    if (nextStep >= 0) setStep(nextStep);
    window.requestAnimationFrame(() => {
      const target = name === "socialProfiles" ? formRef.current?.querySelector<HTMLElement>('fieldset[data-profiles] button') : formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`);
      target?.focus();
    });
  }

  async function advance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const payload = { ...values, jobId: job.id, socialProfiles, attachments, consent };
    const result = validateApplication(payload);
    setMessage("");
    if (step < 4) {
      const names = APPLICATION_SECTIONS[step].fields.map(field => field.name);
      if (step === 3) names.push("socialProfiles", "attachments");
      const stepErrors = Object.fromEntries(Object.entries(result.errors).filter(([name]) => names.includes(name)));
      if (Object.keys(stepErrors).length) {
        showErrors(stepErrors);
        trackJobEvent("career_application_validation_error", job, { step: step + 1 });
        return;
      }
      setErrors({});
      trackJobEvent("career_application_step_complete", job, { step: step + 1 });
      setStep(step + 1);
      setFurthestStep(previous => Math.max(previous, step + 1));
      return;
    }
    if (Object.keys(result.errors).length) {
      showErrors(result.errors);
      trackJobEvent("career_application_validation_error", job, { step: step + 1 });
      return;
    }
    setErrors({});
    setSending(true);
    trackJobEvent("career_application_submit_attempt", job);
    try {
      const response = await fetch("/api/careers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(25000) });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) showErrors(data.errors);
        setMessage(data.error || "We could not send your application. Please try again.");
        trackJobEvent("career_application_submit_error", job);
        return;
      }
      trackJobEvent("career_application_submit_success", job);
      setSubmitted(true);
      window.requestAnimationFrame(() => confirmationRef.current?.focus());
    } catch {
      setMessage("We could not confirm delivery. Your answers are still here. Please try again.");
      trackJobEvent("career_application_submit_error", job);
    } finally {
      setSending(false);
    }
  }

  return (
    <div hidden={!active}>
      <button type="button" disabled={sending} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#2563eb] dark:text-[#2ca2f4]" onClick={() => { trackJobEvent("career_application_back_to_job", job, { step: step + 1 }); onBack(); }}><ArrowLeft aria-hidden className="h-4 w-4" />Job details</button>
      {submitted ? (
        <div ref={confirmationRef} tabIndex={-1} role="status" className="border-t-2 border-emerald-500 py-8 outline-none">
          <CheckCircle2 aria-hidden className="mb-4 h-9 w-9 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-3xl font-semibold">Application received.</h3>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">Thank you for applying for the {job.title} role. We will review your application and contact you if there is a potential fit.</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={advance} noValidate aria-busy={sending}>
          <ol aria-label="Application steps" className="mb-7 grid grid-cols-5 gap-2">
            {STEP_LABELS.map((label, index) => (
              <li key={label}>
                <button type="button" disabled={index > furthestStep || sending} aria-label={`Go to step ${index + 1}: ${label}`} aria-current={step === index ? "step" : undefined} title={label} className={`flex min-h-11 w-full flex-col items-center gap-2 border-t-2 pt-3 text-sm disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] ${step === index ? "border-[#2563eb] text-[#2563eb] dark:text-[#2ca2f4]" : "border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"}`} onClick={() => { trackJobEvent("career_application_step_click", job, { step: index + 1 }); setStep(index); setMessage(""); }}>
                  {index < step ? <Check aria-hidden className="h-5 w-5" /> : <span className="h-5 font-mono">{index + 1}</span>}
                  <span className="hidden text-xs sm:block">{label}</span>
                </button>
              </li>
            ))}
          </ol>
          <h3 ref={headingRef} tabIndex={-1} className="mb-2 text-2xl font-semibold outline-none">{STEP_LABELS[step]}</h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Step {step + 1} of 5. * Required fields.</p>
          <fieldset disabled={sending} className="min-w-0 space-y-6">
            <div hidden aria-hidden="true"><label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" value={values.companyWebsite || ""} onChange={event => setField("companyWebsite", event.target.value)} /></label></div>
            {step < 4 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* One shared hint at the top of the "Links" step, ahead of
                    every field it applies to — see SupportedProviders. */}
                {step === 3 && <div className="sm:col-span-2"><SupportedProviders /></div>}
                {APPLICATION_SECTIONS[step].fields.map(field => (
                  <div key={field.name} className={field.multiline || step === 3 ? "min-w-0 sm:col-span-2" : "min-w-0"}>
                    <label htmlFor={`application-${field.name}`} className="mb-2 block text-base font-medium">{field.label} {field.required ? <span aria-hidden>*</span> : <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(optional)</span>}</label>
                    {field.name === "role" ? <input id="application-role" name="role" className="marketing-input" value={job.title} readOnly /> : field.options ? (
                      <select id={`application-${field.name}`} name={field.name} className="marketing-input" required={field.required} value={values[field.name] || ""} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} onChange={event => setField(field.name, event.target.value)}><option value="">Select an option</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
                    ) : field.multiline ? (
                      <textarea id={`application-${field.name}`} name={field.name} required={field.required} rows={4} maxLength={3000} className="marketing-input resize-y" placeholder={field.placeholder} value={values[field.name] || ""} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} onChange={event => setField(field.name, event.target.value)} />
                    ) : (
                      <input id={`application-${field.name}`} name={field.name} type={field.type || "text"} autoComplete={field.autoComplete} required={field.required} maxLength={500} className="marketing-input" placeholder={field.placeholder} value={values[field.name] || ""} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} onChange={event => setField(field.name, event.target.value)} />
                    )}
                    {step === 3 && field.type === "url" && <div className="mt-2"><LinkProvider url={values[field.name] || ""} /></div>}
                    {errors[field.name] && <p id={`error-${field.name}`} className="mt-2 text-sm text-red-600 dark:text-red-400">{errors[field.name]}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {APPLICATION_SECTIONS.map(section => (
                  <section key={section.title} className="border-t border-gray-200 pt-4 dark:border-white/10">
                    <h4 className="mb-3 text-base font-semibold">{section.title}</h4>
                    <dl className="space-y-3 text-sm">
                      {section.fields.filter(field => values[field.name]).map(field => <div key={field.name}><dt className="text-gray-500 dark:text-gray-400">{field.label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-base text-gray-900 dark:text-white">{values[field.name]}</dd></div>)}
                    </dl>
                  </section>
                ))}
                {attachments.filter(item => item.url.trim()).length > 0 && <div><h4 className="mb-2 font-semibold">Attachments</h4><ul className="space-y-2 text-sm">{attachments.filter(item => item.url.trim()).map((item, index) => <li className="break-words" key={index}>{item.label || "Attachment"}: {item.url}</li>)}</ul></div>}
                {socialProfiles.filter(item => item.handle.trim()).length > 0 && <div><h4 className="mb-2 font-semibold">Social profiles</h4><ul className="space-y-2 text-sm">{socialProfiles.filter(item => item.handle.trim()).map(item => <li className="break-words" key={item.platform}>{item.platform}: {item.handle}</li>)}</ul></div>}
                <label className="flex items-start gap-3 text-base leading-relaxed text-gray-600 dark:text-gray-400"><input name="consent" type="checkbox" required checked={consent} onChange={event => { setConsent(event.target.checked); setErrors(previous => ({ ...previous, consent: "" })); }} className="mt-1 h-5 w-5 shrink-0 accent-[#2563eb]" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "error-consent" : undefined} /><span>I agree that Universal Perk may review this application and contact me about relevant opportunities. *</span></label>
                {errors.consent && <p id="error-consent" className="text-sm text-red-600 dark:text-red-400">{errors.consent}</p>}
              </div>
            )}
            {step === 3 && <>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400"><span className="inline-flex items-center gap-1.5"><HardDrive aria-hidden className="h-4 w-4" />Google Drive</span><span className="inline-flex items-center gap-1.5"><PackageOpen aria-hidden className="h-4 w-4" />Dropbox</span><span className="inline-flex items-center gap-1.5"><Cloud aria-hidden className="h-4 w-4" />OneDrive</span></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use shareable links that our hiring team can open without requesting access.</p>
              <AttachmentLinks value={attachments} onChange={next => {
                if (next.length !== attachments.length) trackJobEvent(next.length > attachments.length ? "career_attachment_add" : "career_attachment_remove", job);
                setAttachments(next);
                setErrors(previous => ({ ...previous, attachments: "" }));
              }} error={errors.attachments} />
              <fieldset data-profiles className="min-w-0"><SocialProfiles value={socialProfiles} onChange={next => {
                if (next.length !== socialProfiles.length) trackJobEvent(next.length > socialProfiles.length ? "career_social_profile_add" : "career_social_profile_remove", job);
                setSocialProfiles(next);
                setErrors(previous => ({ ...previous, socialProfiles: "" }));
              }} error={errors.socialProfiles} /></fieldset>
            </>}
            {message && <p role="alert" className="text-base text-red-600 dark:text-red-400">{message}</p>}
            <div className="flex justify-between gap-3 border-t border-gray-200 py-4 dark:border-gray-800">
              {step > 0 ? <button type="button" className="marketing-cta marketing-cta-secondary" onClick={() => { trackJobEvent("career_application_back", job, { step: step + 1 }); setStep(step - 1); setMessage(""); }}><ArrowLeft aria-hidden className="h-4 w-4" />Back</button> : <span />}
              <button type="submit" className="marketing-cta disabled:opacity-60">{sending ? <><LoaderCircle aria-hidden className="h-4 w-4 animate-spin motion-reduce:animate-none" />Sending</> : <>{step === 4 ? "Submit application" : step === 3 ? "Review application" : "Continue"}<ArrowRight aria-hidden className="h-4 w-4" /></>}</button>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
}
