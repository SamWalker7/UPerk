import { NextResponse } from "next/server";
import { adminBackend, AdminBackendError } from "@/lib/admin/backend";
import { getPortalSession } from "@/lib/portal/session";

// Gated by the same PM session as the client portal console — the app has
// no separate admin auth model.
export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  try {
    return NextResponse.json(await adminBackend.listBlogs());
  } catch (err) {
    const status = err instanceof AdminBackendError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Failed to fetch blogs";
    return NextResponse.json({ error: message }, { status });
  }
}
