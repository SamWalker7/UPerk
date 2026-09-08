import { NextResponse } from "next/server";
import { deleteScreen, updateScreen } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ project: string; id: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") {
    return NextResponse.json({ error: "PM access required" }, { status: 403 });
  }
  const { project, id } = await params;

  const result = await deleteScreen(session.apiToken, project, id);
  if (!result.ok) {
    const status =
      result.reason === "forbidden" ? 403 : result.reason === "read-only" ? 503 : 500;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ project: string; id: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let screen: Record<string, unknown>;
  try { screen = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { project, id } = await params;
  const result = await updateScreen(session.apiToken, project, id, screen);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.message.includes("(413)") ? 413 : result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json({ ok: true });
}
