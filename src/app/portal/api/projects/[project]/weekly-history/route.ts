import { NextResponse } from "next/server";
import { getWeeklyHistory } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function GET(_req: Request, { params }: { params: Promise<{ project: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { project } = await params;
  const result = await getWeeklyHistory(session.apiToken, project);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.reason === "forbidden" ? 403 : 500 });
  return NextResponse.json(result);
}
