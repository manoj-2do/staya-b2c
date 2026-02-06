import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appConfig } from "@/lib/app.config";
import { getProtectedPaths } from "@/lib/route-definitions";

/**
 * Runs on every request. Uses app config (initial route) and route definitions (middleware options).
 * AuthProvider in layout handles client-side auth context.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Initial route redirect: if app is configured with initialRoute "/home", redirect "/" → "/home"
  if (pathname === "/" && appConfig.initialRoute !== "/") {
    return NextResponse.redirect(new URL(appConfig.initialRoute, request.url));
  }

  // Protected routes: redirect to login when auth required (check cookie or header if you set it)
  const protectedPaths = getProtectedPaths();
  if (
    protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    const token = request.cookies.get("uid")?.value;
    if (!token) {
      const loginUrl = new URL(appConfig.loginPath, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
