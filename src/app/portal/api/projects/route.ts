import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/portal/data";
import { getPortalRole } from "@/lib/portal/session";

export async function GET() {
  const role = await getPortalRole();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ projects: await listProjects() });
}

export async function POST(req: Request) {
  const role = await getPortalRole();
  if (role !== "pm") {
    return NextResponse.json({ error: "PM access required" }, { status: 403 });
  }

  let name = "";
  let client = "";
  try {
    const body = await req.json();
    name = String(body.name ?? "").trim();
    client = String(body.client ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }

  const result = await createProject(name, client);
  if ("slug" in result && result.ok) {
    return NextResponse.json({ ok: true, slug: result.slug }, { status: 201 });
  }
  const status = "reason" in result && result.reason === "read-only" ? 503 : 500;
  return NextResponse.json(
    { error: "message" in result ? result.message : "Failed to create project" },
    { status },
  );
}
