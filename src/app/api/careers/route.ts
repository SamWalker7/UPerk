import { NextResponse } from "next/server";
import { applicationPayload, validateApplication } from "@/lib/careers";
import { INTAKE_ENDPOINT } from "@/lib/forms";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Send a JSON application." }, { status: 415 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    // Bound the body even if Content-Length is missing or incorrect.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Application is empty." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 65536) {
        await reader.cancel();
        return NextResponse.json({ error: "Application is too large." }, { status: 413 });
      }
      chunks.push(value);
    }
    const input: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!input || typeof input !== "object" || Array.isArray(input)) return NextResponse.json({ error: "Invalid application." }, { status: 400 });
    const data = input as Record<string, unknown>;
    if (data.companyWebsite) return NextResponse.json({ error: "Unable to accept this application." }, { status: 400 });
    const { values, socialProfiles, attachments, errors } = validateApplication(data);
    if (Object.keys(errors).length) return NextResponse.json({ error: "Check the highlighted fields.", errors }, { status: 422 });

    const response = await fetch(INTAKE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationPayload(values, socialProfiles, attachments)),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "We could not send your application. Your answers are still here; please try again." }, { status: 502 });
    return NextResponse.json({ message: "Application received." });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid application data." }, { status: 400 });
    return NextResponse.json({ error: "We could not send your application. Please try again shortly." }, { status: 502 });
  }
}
