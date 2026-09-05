import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ projects: await listProjects(session.apiToken) });
}

export async function POST(req: Request) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") {
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

  const result = await createProject(session.apiToken, name, client);
  if ("slug" in result && result.ok) {
    return NextResponse.json({ ok: true, slug: result.slug }, { status: 201 });
  }
  const status =
    "reason" in result && result.reason === "forbidden"
      ? 403
      : "reason" in result && result.reason === "read-only"
        ? 503
        : 500;
  return NextResponse.json(
    { error: "message" in result ? result.message : "Failed to create project" },
    { status },
  );
}
