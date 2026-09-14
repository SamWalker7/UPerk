import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal/session";

// Lets client components discover their own role after a hard refresh or
// direct URL visit — the session cookie is httpOnly, so the browser can't
// read it itself. Never returns the backend bearer token.
export async function GET() {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ role: session.role });
}
