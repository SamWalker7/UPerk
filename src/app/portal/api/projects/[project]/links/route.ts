import { NextResponse } from "next/server";
import { addLink } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

const LINK_TYPES = ["figma", "playstore", "testflight", "other"];

export async function POST(req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let link: Record<string, unknown>;
  try { link = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!link.url || typeof link.url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }
  if (!link.type || !LINK_TYPES.includes(link.type as string)) {
    return NextResponse.json({ error: `type must be one of ${LINK_TYPES.join(", ")}` }, { status: 400 });
  }
  const { project } = await params;
  const result = await addLink(session.apiToken, project, link);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "read-only" ? 503 : result.status });
  return NextResponse.json(result, { status: 201 });
}
