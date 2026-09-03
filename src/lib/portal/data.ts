import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type {
  ProjectData,
  ProjectIndex,
  ProjectSummary,
  StatusTone,
} from "./types";

// v2: one file per project in src/portal-data/, listed in index.json.
// When the backend from docs/portal-api-contract.md exists, set PORTAL_API_URL
// and replace the bodies of the functions below with fetch() calls —
// nothing in the components changes.

const DATA_DIR = path.join(process.cwd(), "src", "portal-data");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

const SLUG_RE = /^[a-z0-9-]+$/;

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "read-only" | "error"; message: string };

const READ_ONLY: WriteResult = {
  ok: false,
  reason: "read-only",
  message:
    "Saved locally only. Production is read-only until the backend API is connected.",
};

function projectFile(slug: string): string {
  return path.join(DATA_DIR, `${slug}.json`);
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf-8")) as T;
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

/* ---------- read ---------- */

export async function listProjects(): Promise<ProjectSummary[]> {
  try {
    const idx = await readJson<ProjectIndex>(INDEX_FILE);
    return idx.projects ?? [];
  } catch {
    return [];
  }
}

/** Cached per request so the project layout and its tab pages read the file once. */
export const readProject = cache(
  async (slug: string): Promise<ProjectData | null> => {
    if (!SLUG_RE.test(slug)) return null;
    try {
      return await readJson<ProjectData>(projectFile(slug));
    } catch {
      return null;
    }
  },
);

/* ---------- summary ---------- */

export function statusTone(label: string): StatusTone {
  const l = label.toLowerCase();
  if (l.includes("risk") || l.includes("blocked") || l.includes("late")) return "risk";
  if (l.includes("watch") || l.includes("attention") || l.includes("slip")) return "warn";
  return "ok";
}

export function summarize(data: ProjectData): ProjectSummary {
  return {
    slug: data.slug,
    name: data.project.name,
    client: data.project.client,
    currentPhase: data.status.currentPhase,
    statusLabel: data.status.statusLabel,
    statusTone: statusTone(data.status.statusLabel),
    daysToLaunch: data.status.daysToLaunch,
    launchDate: data.status.launchDate,
    screensBuilt: data.status.screensBuilt,
    screensTotal: data.status.screensTotal,
    openRequests: data.requests.filter((r) => r.status === "open").length,
    updatedAt: data.project.updatedAt,
  };
}

async function refreshIndex(data: ProjectData): Promise<void> {
  let idx: ProjectIndex;
  try {
    idx = await readJson<ProjectIndex>(INDEX_FILE);
  } catch {
    idx = { projects: [] };
  }
  const summary = summarize(data);
  const i = idx.projects.findIndex((p) => p.slug === data.slug);
  if (i >= 0) idx.projects[i] = summary;
  else idx.projects.push(summary);
  idx.projects.sort((a, b) => a.name.localeCompare(b.name));
  await writeJson(INDEX_FILE, idx);
}

/* ---------- write ---------- */

export async function writeProject(
  slug: string,
  data: ProjectData,
): Promise<WriteResult> {
  if (process.env.VERCEL) return READ_ONLY;
  if (!SLUG_RE.test(slug)) {
    return { ok: false, reason: "error", message: "Invalid project slug" };
  }
  try {
    const next = { ...data, slug };
    await writeJson(projectFile(slug), next);
    await refreshIndex(next);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err instanceof Error ? err.message : "Failed to write project",
    };
  }
}

/* ---------- create ---------- */

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 48);
}

export function templateProject(name: string, client: string): ProjectData {
  const today = new Date();
  const human = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const plus = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d;
  };
  return {
    slug: "",
    project: { name, client, updatedAt: human, updatedBy: "" },
    status: {
      currentPhase: "Kick-off",
      phaseSubtitle: "Phase 1 of 4",
      daysToLaunch: 90,
      launchDate: plus(90).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      launchNote: "Set at kick-off",
      screensBuilt: 0,
      screensTotal: 0,
      statusLabel: "On track",
      statusBody: "",
      thisWeek: "",
      upNext: "",
      neededFromYou: "",
    },
    steps: [
      { label: "Design", state: "now" },
      { label: "Development", state: "upcoming" },
      { label: "QA & beta", state: "upcoming" },
      { label: "Launch", state: "upcoming" },
    ],
    requests: [],
    build: {
      version: "",
      date: "",
      screensBuilt: 0,
      screensTotal: 0,
      knownIssues: "",
      testedOn: "",
    },
    prototype: {},
    plan: {
      rangeLabel: "",
      axisStart: iso(today),
      axisEnd: iso(plus(120)),
      phases: [
        { id: "design", name: "Design", state: "now", start: iso(today), end: iso(plus(30)) },
        { id: "development", name: "Development", state: "upcoming", start: iso(plus(30)), end: iso(plus(90)) },
        { id: "qa-beta", name: "QA & beta", state: "upcoming", start: iso(plus(90)), end: iso(plus(110)) },
        { id: "launch", name: "Launch", state: "upcoming", start: iso(plus(110)), end: iso(plus(120)) },
      ],
      milestones: [],
    },
    finishedScreens: [],
    decisions: [],
  };
}

export async function createProject(
  name: string,
  client: string,
): Promise<{ ok: true; slug: string } | WriteResult> {
  if (process.env.VERCEL) return READ_ONLY;
  const base = slugify(name) || "project";
  const existing = new Set((await listProjects()).map((p) => p.slug));
  let slug = base;
  let n = 2;
  while (existing.has(slug)) slug = `${base}-${n++}`;

  const data = templateProject(name.trim(), client.trim());
  const result = await writeProject(slug, data);
  if (!result.ok) return result;
  return { ok: true, slug };
}
