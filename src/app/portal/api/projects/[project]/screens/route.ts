import { NextResponse } from "next/server";
import { addScreen } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function POST(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let screen: Record<string, unknown>;
  try { screen = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { project } = await params;
  const result = await addScreen(session.apiToken, project, screen);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.message.includes("(413)") ? 413 : result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result, { status: 201 });
}
