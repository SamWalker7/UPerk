import type { PortalRole } from "./types";

// Env-based shared login. No user accounts. Two passwords:
//   PORTAL_PASSWORD     -> "client" role (both clients share this)
//   PORTAL_PM_PASSWORD  -> "pm" role (unlocks the console + PM annotations)
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

/** Returns the role for a submitted username/password, or null. */
export function checkCredentials(username: string, password: string): PortalRole | null {
  const user = process.env.PORTAL_USER || "";
  const clientPw = process.env.PORTAL_PASSWORD || "";
  const pmPw = process.env.PORTAL_PM_PASSWORD || "";

  if (!user || !safeEqual(username, user)) return null;
  if (pmPw && safeEqual(password, pmPw)) return "pm";
  if (clientPw && safeEqual(password, clientPw)) return "client";
  return null;
}

export async function createSessionToken(role: PortalRole): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${role}.${exp}`;
  const mac = await sign(payload);
  return `${toBase64Url(enc.encode(payload))}.${mac}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<PortalRole | null> {
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
  const [role, expStr] = payload.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  if (role !== "client" && role !== "pm") return null;
  return role;
}
