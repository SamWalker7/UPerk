import { NextResponse } from "next/server";
import { updateStatus } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function PATCH(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let changes: Record<string, unknown>;
  try { changes = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { project } = await params;
  const result = await updateStatus(session.apiToken, project, changes);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "read-only" ? 503 : result.status });
  return NextResponse.json({ ok: true });
}
