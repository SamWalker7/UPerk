import { NextResponse } from "next/server";
import { adminBackend, AdminBackendError } from "@/lib/admin/backend";
import { getPortalSession } from "@/lib/portal/session";

export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  try {
    return NextResponse.json(await adminBackend.listContent());
  } catch (err) {
    const status = err instanceof AdminBackendError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Failed to fetch content";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "pm") return NextResponse.json({ error: "PM access required" }, { status: 403 });
  let body: { topic?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  if (!topic) return NextResponse.json({ error: "topic is required" }, { status: 400 });
  try {
    return NextResponse.json(await adminBackend.generateContent(topic));
  } catch (err) {
    const status = err instanceof AdminBackendError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Failed to generate content";
    return NextResponse.json({ error: message }, { status });
  }
}
