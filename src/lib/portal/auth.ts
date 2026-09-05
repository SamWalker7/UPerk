import type { PortalRole } from "./types";
import { backend, BackendError } from "./backend";

// Auth is delegated to the backend API (see docs/portal-api-contract.md):
// POST /api/portal/auth/login returns { token, role }. We wrap that upstream
// bearer token in our own signed cookie so middleware (Edge runtime) can
// verify a session without a network round-trip, and route handlers can pull
// the upstream token back out to call the backend on the user's behalf.
//
// Uses Web Crypto (SubtleCrypto) so the same helpers run in middleware (Edge
// runtime) and in route handlers / server components.

export const SESSION_COOKIE = "portal_session";
const SESSION_DAYS = 30;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

function secret(): string {
  return process.env.PORTAL_SESSION_SECRET || "dev-insecure-portal-secret";
}

const enc = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(mac);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type PortalSession = {
  role: PortalRole;
  /** Bearer token issued by the backend API, replayed on every backend call. */
  apiToken: string;
};

/** Calls the backend login endpoint. Returns the session to store, or null. */
export async function login(
  username: string,
  password: string,
): Promise<PortalSession | null> {
  try {
    const { token, role } = await backend.login(username, password);
    if (role !== "client" && role !== "pm") return null;
    return { role, apiToken: token };
  } catch (err) {
    if (err instanceof BackendError && err.status === 401) return null;
    throw err;
  }
}

export async function createSessionToken(session: PortalSession): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ ...session, exp });
  const mac = await sign(payload);
  return `${toBase64Url(enc.encode(payload))}.${mac}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<PortalSession | null> {
  if (!token) return null;
  const [encoded, mac] = token.split(".");
  if (!encoded || !mac) return null;
  let payload: string;
  try {
    payload = fromBase64Url(encoded);
  } catch {
    return null;
  }
  const expected = await sign(payload);
  if (!safeEqual(mac, expected)) return null;

  let parsed: { role?: unknown; apiToken?: unknown; exp?: unknown };
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }
  const { role, apiToken, exp } = parsed;
  if (typeof exp !== "number" || Date.now() > exp) return null;
  if (role !== "client" && role !== "pm") return null;
  if (typeof apiToken !== "string" || !apiToken) return null;
  return { role, apiToken };
}
