import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal/session";
import { backend, BackendError } from "@/lib/portal/backend";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ project: string; id: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { project, id } = await params;

  let choice = "";
  try {
    const body = await req.json();
    choice = String(body.choice ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!choice) {
    return NextResponse.json({ error: "choice is required" }, { status: 400 });
  }

  try {
    await backend.respondToRequest(session.apiToken, project, id, choice);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof BackendError ? err.status : 500;
    const message = err instanceof BackendError ? err.message : "Failed to respond";
    return NextResponse.json({ error: message }, { status });
  }
}
