import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  login,
} from "@/lib/portal/auth";
import { BackendError } from "@/lib/portal/backend";

export async function POST(req: Request) {
  let username = "";
  let password = "";
  let next = "/portal";

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    username = String(body.username ?? "");
    password = String(body.password ?? "");
    if (body.next) next = String(body.next);
  } else {
    const form = await req.formData();
    username = String(form.get("username") ?? "");
    password = String(form.get("password") ?? "");
    if (form.get("next")) next = String(form.get("next"));
  }

  let session;
  try {
    session = await login(username, password);
  } catch (err) {
    const status = err instanceof BackendError ? err.status : 502;
    const message =
      err instanceof BackendError ? err.message : "Could not reach the portal API.";
    return NextResponse.json({ error: message }, { status });
  }

  if (!session) {
    return NextResponse.json(
      { error: "Wrong username or password." },
      { status: 401 },
    );
  }

  if (!next.startsWith("/portal") && !next.startsWith("/console")) {
    next = "/portal";
  }
  // A client who was heading to the console lands on the projects list instead.
  if (session.role !== "pm" && next.startsWith("/console")) next = "/portal";

  const token = await createSessionToken(session);
  const res = NextResponse.json({ ok: true, role: session.role, next });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
