// Shared data model for the client portal.
// This is the single source of truth for the shape returned by the backend
// API (see docs/portal-api-contract.md, and src/lib/portal/backend.ts for
// the client that talks to it).

export type StepState = "done" | "now" | "upcoming";

export type Phase = {
  id: string;
  name: string;
  state: StepState;
  /** ISO date (YYYY-MM-DD) */
  start: string;
  /** ISO date (YYYY-MM-DD) */
  end: string;
  /** short label rendered on the bar, e.g. "8 Jun — 24 Jul" */
  rangeLabel?: string;
};

export type RequestOption = {
  label: string;
  imageUrl?: string;
};

export type RequestAction = {
  label: string;
  kind: "primary" | "secondary";
};

export type ClientRequest = {
  id: string;
  title: string;
  status: "open" | "done";
  daysOpen: number;
  /** true = blocking work now; false = "not blocking yet" */
  blocking: boolean;
  body: string;
  /** yellow highlighted line, e.g. "Not blocking yet. Needed before beta opens 5 Oct." */
  note?: string;
  /** sub-line under options, e.g. "Holds up the weekly summary build, starting Thursday 3 Sept" */
  subNote?: string;
  options?: RequestOption[];
  /** rendered as buttons; display-only in v1 */
  actions: RequestAction[];
  /** text shown inside the dashed PM annotation box */
  pmNote?: string;
};

export type BuildInfo = {
  version: string;
  /** human date, e.g. "1 Sept" */
  date: string;
  screensBuilt: number;
  screensTotal: number;
  knownIssues: string;
  testedOn: string;
};

export type PrototypeLinks = {
  prototypeUrl?: string;
  installUrl?: string;
  figmaUrl?: string;
  /** src for the embedded <iframe>; falls back to a placeholder box when absent */
  embedUrl?: string;
  /** small caption above the embed, e.g. "Prototype r24 · build 0.9.4 — 1 Sept, 18:40" */
  caption?: string;
  /** label under the phone frame, e.g. "Embedded prototype — Summary screen" */
  frameLabel?: string;
  installLabel?: string;
  pmNote?: string;
};

export type FinishedScreen = {
  id: string;
  name: string;
  /** human date, e.g. "1 Sept" */
  date: string;
  imageUrl?: string;
};

export type Decision = {
  id: string;
  /** human date, e.g. "2 Sept" */
  date: string;
  body: string;
  /** e.g. "Agreed by Kaya and Dr. Renner on the Monday call" */
  attribution: string;
  link?: { label: string; url: string };
  /** id of the decision that replaces this one; never delete */
  supersededBy?: string;
};

export type Milestone = {
  title: string;
  body: string;
};

export type PortalStatus = {
  currentPhase: string;
  /** e.g. "Phase 2 of 4 — ends 2 Oct" */
  phaseSubtitle: string;
  daysToLaunch: number;
  /** e.g. "Fri 6 Nov" */
  launchDate: string;
  /** e.g. "Date unchanged since kick-off" */
  launchNote: string;
  screensBuilt: number;
  screensTotal: number;
  /** e.g. "On track" */
  statusLabel: string;
  /** e.g. "No milestone has moved. One decision is waiting on you." */
  statusBody: string;
  thisWeek: string;
  upNext: string;
  neededFromYou: string;
  neededLinkLabel?: string;
  /** anchor/URL the "Go to it" link points at */
  neededLink?: string;
};

export type ProjectData = {
  /** URL slug; also the data filename (src/portal-data/<slug>.json) */
  slug: string;
  project: {
    name: string;
    /** the client company / team this project belongs to */
    client: string;
    /** human string, e.g. "Wed 2 Sept, 9:14" */
    updatedAt: string;
    updatedBy: string;
  };
  status: PortalStatus;
  steps: { label: string; state: StepState }[];
  requests: ClientRequest[];
  build: BuildInfo;
  prototype: PrototypeLinks;
  plan: {
    /** e.g. "8 June — 6 November" */
    rangeLabel: string;
    /** ISO date bounds of the chart axis */
    axisStart: string;
    axisEnd: string;
    phases: Phase[];
    milestones: Milestone[];
  };
  finishedScreens: FinishedScreen[];
  decisionsIntro?: string;
  decisions: Decision[];
  nextCall?: { label: string; agendaUrl?: string };
};

/** @deprecated use ProjectData */
export type PortalData = ProjectData;

export type StatusTone = "ok" | "warn" | "risk";

/** Card-level summary shown on the projects list, without loading a full ProjectData. */
export type ProjectSummary = {
  slug: string;
  name: string;
  client: string;
  currentPhase: string;
  statusLabel: string;
  statusTone: StatusTone;
  daysToLaunch: number;
  launchDate: string;
  screensBuilt: number;
  screensTotal: number;
  openRequests: number;
  updatedAt: string;
};

export type ProjectIndex = { projects: ProjectSummary[] };

export type PortalRole = "client" | "pm";

/** The five tabs on a project page. */
export const PROJECT_TABS = [
  "overview",
  "requests",
  "prototype",
  "timeline",
  "decisions",
] as const;
export type ProjectTab = (typeof PROJECT_TABS)[number];
