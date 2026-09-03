import { NextResponse } from "next/server";
import { readProject, writeProject } from "@/lib/portal/data";
import { getPortalRole } from "@/lib/portal/session";
import type { ProjectData } from "@/lib/portal/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ project: string }> },
) {
  const role = await getPortalRole();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { project } = await params;
  const data = await readProject(project);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ project: string }> },
) {
  const role = await getPortalRole();
  if (role !== "pm") {
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

  const result = await writeProject(project, data);
  if (!result.ok) {
    const status = result.reason === "read-only" ? 503 : 500;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ ok: true });
}
