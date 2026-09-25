"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Routes where a 401 is an expected, normal response — not a sign that a
// session expired mid-visit — so they must never trigger the redirect below:
// /portal/api/session is polled to check for an existing session (401 =
// "not logged in yet"), and /portal/api/login returns 401 for a wrong
// username/password, which LoginForm needs to show as a form error.
const EXEMPT = ["/portal/api/session", "/portal/api/login"];

/** Mounted once near the root of every portal route except /portal/login.
 *  Patches window.fetch so any 401 from this app's own /portal/api/* routes
 *  — a session that expired mid-visit — redirects to the login page, no
 *  matter which of the many ad-hoc fetch() calls across the portal
 *  components triggered it. */
export function PortalAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/portal/login")) return;

    const original = window.fetch;
    window.fetch = async (...args) => {
      const res = await original(...args);
      if (res.status === 401) {
        const url = typeof args[0] === "string" ? args[0] : args[0] instanceof Request ? args[0].url : String(args[0]);
        if (url.includes("/portal/api/") && !EXEMPT.some((p) => url.includes(p))) {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          router.replace(`/portal/login?next=${next}`);
        }
      }
      return res;
    };
    return () => {
      window.fetch = original;
    };
  }, [router, pathname]);

  return null;
}
