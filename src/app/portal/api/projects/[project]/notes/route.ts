import { NextResponse } from "next/server";
import { addNote } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function POST(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let note: Record<string, unknown>;
  try { note = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!note.body || (note.visibility !== "internal" && note.visibility !== "client")) {
    return NextResponse.json({ error: "body and visibility (\"internal\"|\"client\") are required" }, { status: 400 });
  }
  const { project } = await params;
  const result = await addNote(session.apiToken, project, note);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result, { status: 201 });
}
