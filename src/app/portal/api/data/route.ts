import { NextResponse } from "next/server";
import { readPortalData, writePortalData } from "@/lib/portal/data";
import { getPortalRole } from "@/lib/portal/session";
import type { PortalData } from "@/lib/portal/types";

export async function GET() {
  const role = await getPortalRole();
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await readPortalData();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const role = await getPortalRole();
  if (role !== "pm") {
    return NextResponse.json({ error: "PM access required" }, { status: 403 });
  }

  let data: PortalData;
  try {
    data = (await req.json()) as PortalData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!data || typeof data !== "object" || !data.project || !data.status) {
    return NextResponse.json({ error: "Malformed portal data" }, { status: 400 });
  }

  const result = await writePortalData(data);
  if (!result.ok) {
    const status = result.reason === "read-only" ? 503 : 500;
    return NextResponse.json({ error: result.message }, { status });
  }
  return NextResponse.json({ ok: true });
}
