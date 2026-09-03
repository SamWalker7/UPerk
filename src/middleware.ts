import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/portal/auth";

// Gate the client portal. Unauthenticated -> /portal/login.
// /portal/console/** additionally requires the "pm" role.

export const config = {
  matcher: ["/portal/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public within the portal: the login page and its API route.
  if (pathname === "/portal/login" || pathname === "/portal/api/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const role = await verifySessionToken(token);

  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Console pages are PM-only. The PUT /portal/api/data handler re-checks the
  // role itself, so guarding the console UI here is enough.
  const isConsole =
    pathname === "/portal/console" || pathname.startsWith("/portal/console/");
  if (role !== "pm" && isConsole) {
    const url = req.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
