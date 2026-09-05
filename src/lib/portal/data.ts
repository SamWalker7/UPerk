import { cache } from "react";
import type { ProjectData, ProjectSummary, StatusTone } from "./types";
import { backend, BackendError } from "./backend";

// v3: backed by the API described in docs/portal-api-contract.md (set
// PORTAL_API_URL). Every call needs the caller's session bearer token — no
// component or type changes versus the old file-backed version.

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "read-only" | "error" | "forbidden"; message: string };

function toWriteResult(err: unknown): WriteResult {
  if (err instanceof BackendError) {
    return {
      ok: false,
      reason: err.status === 403 ? "forbidden" : "error",
      message: err.message,
    };
  }
  return {
    ok: false,
    reason: "error",
    message: err instanceof Error ? err.message : "Request failed",
  };
}

/* ---------- read ---------- */

export async function listProjects(token: string): Promise<ProjectSummary[]> {
  try {
    const { projects } = await backend.listProjects(token);
    return (projects ?? []) as ProjectSummary[];
  } catch {
    return [];
  }
}

/** Cached per request so the project layout and its tab pages read it once. */
export const readProject = cache(
  async (token: string, slug: string): Promise<ProjectData | null> => {
    try {
      return (await backend.readProject(token, slug)) as ProjectData;
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

/* ---------- write ---------- */

export async function writeProject(
  token: string,
  slug: string,
  data: ProjectData,
): Promise<WriteResult> {
  try {
    await backend.replaceProject(token, slug, { ...data, slug });
    return { ok: true };
  } catch (err) {
    return toWriteResult(err);
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

export async function createProject(
  token: string,
  name: string,
  client: string,
): Promise<{ ok: true; slug: string } | WriteResult> {
  try {
    const result = await backend.createProject(token, name.trim(), client.trim());
    return { ok: true, slug: result.slug };
  } catch (err) {
    return toWriteResult(err);
  }
}
