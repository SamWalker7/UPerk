import { cleanSocialProfiles, isWebUrl, socialProfilesError, type SocialProfile } from "./forms";
import { JOBS } from "./jobs";

export type ApplicationAttachment = { label: string; url: string };

export const CAREER_ROLES = ["Developer", "UX Designer", "Project Manager", "Business Analyst", "Data Scientist", "ML Engineer", "GenAI Engineer"];

type ApplicationField = {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  options?: string[];
  multiline?: boolean;
  autoComplete?: string;
  placeholder?: string;
};

export const APPLICATION_SECTIONS: { title: string; fields: ApplicationField[] }[] = [
  { title: "About you", fields: [
    { name: "firstName", label: "First name", required: true, autoComplete: "given-name" },
    { name: "lastName", label: "Last name", required: true, autoComplete: "family-name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    { name: "location", label: "Current city and country", required: true, autoComplete: "address-level2" },
    { name: "timezone", label: "Time zone", placeholder: "e.g. Eastern Time (UTC-5 / UTC-4)" },
  ] },
  { title: "Your next role", fields: [
    { name: "role", label: "Role of interest", required: true, options: CAREER_ROLES },
    { name: "workLocation", label: "Preferred work location", required: true, options: ["Tysons, VA", "Remote", "Open to either"] },
    { name: "experience", label: "Relevant experience", required: true, options: ["Less than 1 year", "1-3 years", "4-6 years", "7-9 years", "10+ years"] },
    { name: "availability", label: "When could you start?", required: true, options: ["Immediately", "Within 2 weeks", "Within 1 month", "Within 2-3 months", "Flexible"] },
    { name: "engagement", label: "Employment preference", required: true, options: ["Full-time", "Part-time", "Contract", "Flexible"] },
    { name: "compensation", label: "Compensation expectations", placeholder: "Amount, currency, and annual or hourly" },
  ] },
  { title: "Your experience", fields: [
    { name: "skills", label: "Your skills and tools", required: true, multiline: true, placeholder: "Languages, frameworks, design tools, delivery methods, or other relevant skills." },
    { name: "project", label: "A project you are proud of", required: true, multiline: true, placeholder: "What problem did you solve? Describe your contribution, the decisions you made, and the outcome." },
    { name: "education", label: "Education and certifications", multiline: true, placeholder: "Include relevant degrees, courses, certifications, or self-directed learning." },
    { name: "motivation", label: "Why Universal Perk?", multiline: true, placeholder: "What interests you about the work, and what would you like us to know?" },
  ] },
  { title: "Your work and profiles", fields: [
    { name: "resumeUrl", label: "Resume / CV link", type: "url", placeholder: "https://..." },
    { name: "portfolioUrl", label: "Portfolio or work sample link", type: "url", placeholder: "https://..." },
    { name: "website", label: "Website", type: "url", autoComplete: "url", placeholder: "https://..." },
  ] },
];

// The same rules run in the browser and at the API boundary.
export function validateApplication(input: Record<string, unknown>) {
  const values: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const section of APPLICATION_SECTIONS) {
    for (const field of section.fields) {
      const value = typeof input[field.name] === "string" ? (input[field.name] as string).trim() : "";
      values[field.name] = value;
      if (field.required && !value) errors[field.name] = `${field.label} is required.`;
      else if (value.length > (field.multiline ? 3000 : 500)) errors[field.name] = "Please shorten this answer.";
      else if (value && field.options && !field.options.includes(value)) errors[field.name] = "Choose an available option.";
      else if (value && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.name] = "Enter a valid email address.";
      else if (value && field.type === "url" && !isWebUrl(value)) errors[field.name] = "Enter a full URL starting with https://";
    }
  }
  const profiles: SocialProfile[] = [];
  if (input.socialProfiles !== undefined) {
    if (!Array.isArray(input.socialProfiles) || input.socialProfiles.length > 5) errors.socialProfiles = "Add up to five social profiles.";
    else for (const profile of input.socialProfiles) {
      if (!profile || typeof profile !== "object" || typeof profile.platform !== "string" || typeof profile.handle !== "string") errors.socialProfiles = "Check your social profile details.";
      else profiles.push({ platform: profile.platform, handle: profile.handle });
    }
  }
  const profileError = socialProfilesError(profiles);
  if (profileError) errors.socialProfiles = profileError;
  const attachments: ApplicationAttachment[] = [];
  if (input.attachments !== undefined) {
    if (!Array.isArray(input.attachments) || input.attachments.length > 3) errors.attachments = "Add up to three attachment links.";
    else for (const attachment of input.attachments) {
      if (!attachment || typeof attachment !== "object" || typeof attachment.label !== "string" || typeof attachment.url !== "string") errors.attachments = "Check your attachment links.";
      else {
        const label = attachment.label.trim();
        const url = attachment.url.trim();
        if (!label && !url) continue;
        if (!isWebUrl(url) || url.length > 1000 || label.length > 100) errors.attachments = "Each attachment needs a valid http or https link and a title under 100 characters.";
        else attachments.push({ label: label || "Additional attachment", url });
      }
    }
  }
  if (input.jobId !== undefined) {
    const job = JOBS.find(job => job.id === input.jobId);
    if (!job || job.role !== values.role) errors.role = "Choose a valid opening and apply from its details.";
    else values.jobId = job.id;
  }
  if (input.consent !== true) errors.consent = "Please confirm we may review your application and contact you.";
  return { values, socialProfiles: cleanSocialProfiles(profiles), attachments, errors };
}

export function applicationPayload(values: Record<string, string>, profiles: SocialProfile[], attachments: ApplicationAttachment[] = []) {
  const summary = APPLICATION_SECTIONS.map(section => `${section.title}\n${section.fields.map(field => `${field.label}: ${values[field.name] || "Not provided"}`).join("\n")}`).join("\n\n");
  const job = JOBS.find(job => job.id === values.jobId);
  return {
    projectDetails: {
      projectType: "Career Application",
      projectDescription: `CAREER APPLICATION: ${job?.title || values.role}\nOpening ID: ${job?.id || "General application"}\n\n${summary}\n\nSocial profiles\n${profiles.map(profile => `${profile.platform}: ${profile.handle}`).join("\n") || "Not provided"}\n\nAttachments\n${attachments.map(attachment => `${attachment.label}: ${attachment.url}`).join("\n") || "Not provided"}\n\nApplicant consent: confirmed`,
    },
    timelineAndBudget: { budgetRange: "Not applicable", timeline: values.availability },
    contactInfo: {
      fullName: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phoneNumber: values.phone,
      company: "Career applicant",
      address: values.location,
    },
  };
}
