import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";

// Optimistic gate for admin routes. Every admin page and API handler also
// re-checks the session server-side.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Logout must stay reachable when the session has already expired — that is
  // exactly when the stale cookie needs clearing.
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  )
    return NextResponse.next();

  const ok = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
