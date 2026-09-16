import { NextResponse } from "next/server";
import { addRequest } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function POST(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let request: Record<string, unknown>;
  try { request = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!request.title || !request.body) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }
  const { project } = await params;
  const result = await addRequest(session.apiToken, project, request);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "read-only" ? 503 : result.status });
  return NextResponse.json(result, { status: 201 });
}
