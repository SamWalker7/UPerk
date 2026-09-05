import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken, type PortalSession } from "./auth";
import type { PortalRole } from "./types";

/** Read and verify the full portal session (role + backend bearer token). */
export async function getPortalSession(): Promise<PortalSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Convenience for call sites that only need the role. */
export async function getPortalRole(): Promise<PortalRole | null> {
  return (await getPortalSession())?.role ?? null;
}
