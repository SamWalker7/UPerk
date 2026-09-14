import { NextResponse } from "next/server";
import { getProjectHistory } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function GET(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  const { project } = await params;
  const section = new URL(req.url).searchParams.get("section") ?? undefined;
  const result = await getProjectHistory(session.apiToken, project, section ?? undefined);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result);
}
