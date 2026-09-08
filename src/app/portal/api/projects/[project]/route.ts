import { NextResponse } from "next/server";
import { deleteProject, patchProject, readProject, writeProject } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";
import type { ProjectData } from "@/lib/portal/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ project: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { project } = await params;
  const data = await readProject(session.apiToken, project);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ project: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") {
    return NextResponse.json({ error: "PM access required" }, { status: 403 });
  }
  const { project } = await params;

  let data: ProjectData;
  try {
    data = (await req.json()) as ProjectData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || !data.project || !data.status) {
    return NextResponse.json({ error: "Malformed project data" }, { status: 400 });
  }

  const result = await writeProject(session.apiToken, project, data);
  if (!result.ok) {
    const status =
      result.reason === "forbidden" ? 403 : result.reason === "read-only" ? 503 : result.message.includes("(413)") ? 413 : 500;
    return NextResponse.json({ error: result.message }, { status });
  }
  // Read the saved record back before reporting success. This lets the console
  // use the API as the source of truth and catches failed/non-persistent saves.
  const persisted = await readProject(session.apiToken, project);
  if (!persisted) return NextResponse.json({ error: "Save could not be verified" }, { status: 502 });
  return NextResponse.json({ ok: true, data: persisted });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ project: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let changes: Record<string, unknown>;
  try { changes = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { project } = await params;
  const result = await patchProject(session.apiToken, project, changes);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : result.message.includes("(413)") ? 413 : 500 });
  const persisted = await readProject(session.apiToken, project);
  if (!persisted) return NextResponse.json({ error: "Save could not be verified" }, { status: 502 });
  return NextResponse.json({ ok: true, data: persisted });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ project: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") {
    return NextResponse.json({ error: "PM access required" }, { status: 403 });
  }
  const { project } = await params;

  const result = await deleteProject(session.apiToken, project);
  if (!result.ok) {
    const status =
      result.reason === "forbidden" ? 403 : result.reason === "read-only" ? 503 : 500;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ ok: true });
}
