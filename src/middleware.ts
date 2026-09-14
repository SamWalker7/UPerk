import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/portal/auth";

// Gate the client portal, the PM console, and the PM admin tools.
// Unauthenticated -> /portal/login. /console/** and /admin/** additionally
// require the "pm" role.

export const config = {
  matcher: ["/portal/:path*", "/console/:path*", "/console", "/admin/:path*", "/admin"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public within the portal: the login page and its API route.
  if (pathname === "/portal/login" || pathname === "/portal/api/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Console and admin pages are PM-only. The route handlers re-check the
  // role themselves for writes, so guarding the UI here is enough.
  const isConsole =
    pathname === "/console" || pathname.startsWith("/console/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (session.role !== "pm" && (isConsole || isAdmin)) {
    const url = req.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
