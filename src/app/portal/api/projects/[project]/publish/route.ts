import { NextResponse } from "next/server";
import { publishProject } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function POST(_req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  const { project } = await params;
  const result = await publishProject(session.apiToken, project);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result);
}
