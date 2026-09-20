import { NextResponse } from "next/server";
import { deleteLink, updateLink } from "@/lib/portal/data";
import { getPortalSession } from "@/lib/portal/session";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ project: string; id: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") {
    return NextResponse.json({ error: "PM access required" }, { status: 403 });
  }
  let changes: Record<string, unknown>;
  try {
    changes = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { project, id } = await params;

  const result = await updateLink(session.apiToken, project, id, changes);
  if (!result.ok) {
    const status = result.reason === "read-only" ? 503 : result.status;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ ok: true });
}

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

  const result = await deleteLink(session.apiToken, project, id);
  if (!result.ok) {
    const status = result.reason === "read-only" ? 503 : result.status;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ ok: true });
}
