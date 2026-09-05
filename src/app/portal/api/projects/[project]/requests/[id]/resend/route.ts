import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal/session";
import { backend, BackendError } from "@/lib/portal/backend";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ project: string; id: string }> },
) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { project, id } = await params;

  try {
    await backend.resendRequest(session.apiToken, project, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof BackendError ? err.status : 500;
    const message = err instanceof BackendError ? err.message : "Failed to resend";
    return NextResponse.json({ error: message }, { status });
  }
}
