import { NextResponse } from "next/server";
import { appendDecision, getDecisions } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function GET(_req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { project } = await params;
  const result = await getDecisions(session.apiToken, project);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result);
}

export async function POST(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let decision: Record<string, unknown>;
  try { decision = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { project } = await params;
  const result = await appendDecision(session.apiToken, project, decision);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result, { status: 201 });
}
