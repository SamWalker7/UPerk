import { NextResponse } from "next/server";
import { adminBackend, AdminBackendError } from "@/lib/admin/backend";
import { getPortalSession } from "@/lib/portal/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  const { id } = await params;
  try {
    return NextResponse.json(await adminBackend.readBlog(id));
  } catch (err) {
    const status = err instanceof AdminBackendError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Failed to fetch blog";
    return NextResponse.json({ error: message }, { status });
  }
}
