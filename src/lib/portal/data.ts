import { promises as fs } from "fs";
import path from "path";
import type { PortalData } from "./types";

// v1: the portal reads a single committed JSON file. When the backend from
// docs/portal-api-contract.md exists, set PORTAL_API_URL and replace the bodies
// of readPortalData / writePortalData with fetch() calls — nothing else changes.

const DATA_FILE = path.join(process.cwd(), "src", "portal-data", "portal.json");

export async function readPortalData(): Promise<PortalData> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as PortalData;
}

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "read-only" | "error"; message: string };

export async function writePortalData(data: PortalData): Promise<WriteResult> {
  // Vercel's runtime filesystem is read-only. Console edits work in local dev;
  // in production this is a no-op until the backend is wired.
  if (process.env.VERCEL) {
    return {
      ok: false,
      reason: "read-only",
      message:
        "Saved locally only. Production is read-only until the backend API is connected.",
    };
  }
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      message: err instanceof Error ? err.message : "Failed to write portal data",
    };
  }
}
