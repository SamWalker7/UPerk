import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import type { PortalRole } from "./types";

/** Read and verify the portal session from the request cookies. */
export async function getPortalRole(): Promise<PortalRole | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
