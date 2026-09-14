"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, ChevronDown, MapPin, Share2, X } from "lucide-react";
import GridBackdrop from "@/components/common/GridBackdrop";
import Navebar from "@/components/header/Navebar";
import { Footer } from "@/components/footer/Fotter";
import JobApplication from "./JobApplication";
import { JOBS, JOB_TERMS, type Job } from "@/lib/jobs";
import { trackEvent, trackJobEvent } from "@/lib/analytics";

function setJobUrl(jobId: string | null) {
  const url = new URL(window.location.href);
  if (jobId) url.searchParams.set("job", jobId);
  else url.searchParams.delete("job");
  window.history.replaceState(window.history.state, "", url);
}

export default function CareersApplication() {
  const [team, setTeam] = useState("All teams");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Shared job URLs reopen the same details; the browser handles modal focus.
  useEffect(() => {
    const readJob = () => {
      const id = new URL(window.location.href).searchParams.get("job");
      const job = JOBS.find(job => job.id === id) || null;
      setSelectedJob(job);
      setApplying(false);
      if (job) trackJobEvent("career_job_view", job, { source: "shared_link" });
    };
    readJob();
    window.addEventListener("popstate", readJob);
    return () => window.removeEventListener("popstate", readJob);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!selectedJob) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedJob]);

  function openJob(job: Job) {
    setSelectedJob(job);
    setApplying(false);
    setShareMessage("");
    setFallbackLink("");
    setJobUrl(job.id);
    trackJobEvent("career_job_view", job, { source: "job_card" });
  }

  function closeJob() {
    if (selectedJob) trackJobEvent("career_job_close", selectedJob, { view: applying ? "application" : "description" });
    dialogRef.current?.close();
    setSelectedJob(null);
    setApplying(false);
    setJobUrl(null);
  }

  function apply() {
    if (!selectedJob) return;
    trackJobEvent("career_apply_click", selectedJob);
    setApplying(true);
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }

  async function shareJob() {
    if (!selectedJob) return;
    const url = new URL("/careers", window.location.origin);
    url.searchParams.set("job", selectedJob.id);
    const link = url.toString();
    const nativeShare = typeof navigator.share === "function";
    trackJobEvent("career_job_share", selectedJob, { method: nativeShare ? "native" : "copy_link" });
    setShareMessage("");
    setFallbackLink("");
    try {
      if (nativeShare) {
        await navigator.share({ title: `${selectedJob.title} at Universal Perk`, text: selectedJob.summary, url: link });
        setShareMessage("Job shared.");
      } else {
        await navigator.clipboard.writeText(link);
        setShareMessage("Job link copied.");
      }
      trackJobEvent("career_job_share_complete", selectedJob);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setFallbackLink(link);
      setShareMessage("Share this job link:");
    }
  }

  const jobs = JOBS.filter(job => team === "All teams" || job.team === team);

  return (
    <div className="careers-type relative isolate min-h-screen overflow-hidden bg-white text-gray-900 dark:bg-[#060a14] dark:text-white">
      {/* The animated square-grid blueprint texture read as a spec sheet
          rather than a careers page here — replaced with the same quiet
          motif as the homepage hero: a fine dot grid plus one slow-drifting
          brand-blue glow, faded out before the job list so it stays behind
          the header rather than competing with the cards. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black,black_40%,transparent_70%)]">
        <GridBackdrop />
        <div className="animate-drift absolute -top-24 right-0 w-[420px] h-[420px] rounded-full opacity-[0.14] dark:opacity-[0.18] blur-[110px] bg-[radial-gradient(circle,_#2563eb_0%,_#34e5ff_60%,_transparent_100%)]" />
      </div>
      <Navebar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <header className="mb-10 border-b border-gray-200 pb-9 dark:border-white/15">
          <p className="mb-4 flex items-center gap-2 text-base font-medium text-[#2563eb] dark:text-[#2ca2f4]"><MapPin aria-hidden className="h-5 w-5" />Tysons, VA or remote</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">Careers at Universal Perk</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">Bring your craft to projects people depend on. Find the role where you can do your best work.</p>
        </header>
        <section aria-labelledby="open-roles">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="open-roles" className="text-2xl font-semibold">Open opportunities <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">({jobs.length})</span></h2>
            <div className="relative w-full sm:w-52">
              <label htmlFor="career-team" className="sr-only">Filter by team</label>
              <select id="career-team" className="marketing-input appearance-none pr-10" value={team} onChange={event => { setTeam(event.target.value); trackEvent("career_team_filter", { category: "careers", team: event.target.value }); }}>
                {["All teams", ...new Set(JOBS.map(job => job.team))].map(team => <option key={team}>{team}</option>)}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-3.5 h-4 w-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <article key={job.id} className="h-full">
                <button type="button" onClick={() => openJob(job)} aria-label={`View ${job.title} job`} aria-haspopup="dialog" className="group flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-6 text-left transition-colors hover:border-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563eb] dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-[#2ca2f4]">
                  <span className="text-sm font-medium text-[#2563eb] dark:text-[#2ca2f4]">{job.team}</span>
                  <h3 className="mt-3 text-xl font-semibold">{job.title}</h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-gray-600 dark:text-gray-400">{job.summary}</p>
                  <span className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><MapPin aria-hidden className="h-4 w-4 shrink-0" />Tysons, VA or remote</span>
                  <span className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><BriefcaseBusiness aria-hidden className="h-4 w-4 shrink-0" />{JOB_TERMS.type}</span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] dark:text-[#2ca2f4]">View role<ArrowRight aria-hidden className="h-4 w-4" /></span>
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      <dialog ref={dialogRef} aria-labelledby="job-title" onCancel={event => { event.preventDefault(); closeJob(); }} onClick={event => { if (event.target === event.currentTarget) closeJob(); }} className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-white p-0 text-gray-900 backdrop:bg-black/45 sm:max-w-2xl dark:bg-[#0d1220] dark:text-white">
        {selectedJob && <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 px-5 py-5 dark:border-white/10 sm:px-8">
            <div>
              <p className="mb-1 text-sm text-[#2563eb] dark:text-[#2ca2f4]">{selectedJob.team}</p>
              <h2 id="job-title" className="text-2xl font-semibold leading-tight">{selectedJob.title}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{JOB_TERMS.location}</p>
            </div>
            <button type="button" onClick={closeJob} aria-label="Close job details" title="Close job details" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#2563eb] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"><X aria-hidden className="h-5 w-5" /></button>
          </header>
          <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-8">
            <div hidden={applying}>
              <div className="mb-7 flex gap-3">
                <button type="button" onClick={apply} className="marketing-cta flex-1 sm:flex-none">Apply now<ArrowRight aria-hidden className="h-4 w-4" /></button>
                <button type="button" onClick={shareJob} className="marketing-cta marketing-cta-secondary"><Share2 aria-hidden className="h-4 w-4" />Share</button>
              </div>
              <p role="status" aria-live="polite" className={shareMessage ? "mb-4 text-sm text-emerald-700 dark:text-emerald-400" : "sr-only"}>{shareMessage}</p>
              {fallbackLink && <input aria-label="Shareable job link" readOnly value={fallbackLink} onFocus={event => event.target.select()} className="marketing-input mb-6" />}
              <section className="mb-7">
                <h3 className="mb-3 text-lg font-semibold">About the role</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">{selectedJob.summary}</p>
                <dl className="mt-5 space-y-4 border-y border-gray-200 py-5 text-base dark:border-white/10">
                  <div><dt className="font-semibold">Job type</dt><dd className="mt-1 text-gray-600 dark:text-gray-400">{JOB_TERMS.type}</dd></div>
                  <div><dt className="font-semibold">Pay</dt><dd className="mt-1 leading-relaxed text-gray-600 dark:text-gray-400">{JOB_TERMS.pay}</dd></div>
                </dl>
              </section>
              {[
                { title: "What you will do", items: selectedJob.responsibilities },
                { title: "What you bring", items: selectedJob.requirements },
                { title: "Nice to have", items: selectedJob.niceToHave },
                { title: "Benefits and flexibility", items: JOB_TERMS.benefits },
                { title: "What you can expect from us", items: JOB_TERMS.expectations },
                { title: "Our culture", items: JOB_TERMS.culture },
              ].map(section => (
                <section key={section.title} className="mb-7">
                  <h3 className="mb-3 text-lg font-semibold">{section.title}</h3>
                  <ul className="list-disc space-y-3 pl-5 text-base leading-relaxed text-gray-600 marker:text-[#2563eb] dark:text-gray-400">{section.items.map(item => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
              <section className="mb-7">
                <h3 className="mb-3 text-lg font-semibold">Why Universal Perk?</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">Help bring ideas to life across web, mobile, cloud, and AI. You will work close to the people using what we build, collaborate across disciplines, and see your contribution through to a working product.</p>
              </section>
            </div>
            <JobApplication key={selectedJob.id} job={selectedJob} active={applying} onBack={() => { setApplying(false); contentRef.current?.scrollTo({ top: 0, behavior: "instant" }); }} />
          </div>
          {!applying && <div className="shrink-0 border-t border-gray-200 px-5 py-4 dark:border-white/10 sm:px-8"><button type="button" onClick={apply} className="marketing-cta w-full">Apply now<ArrowRight aria-hidden className="h-4 w-4" /></button></div>}
        </div>}
      </dialog>
    </div>
  );
}
