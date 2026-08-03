import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parseSessionRole, SESSION_COOKIE_NAME } from "@/lib/auth/session"

export function middleware(request: NextRequest) {
  const role = parseSessionRole(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (role === "guest") {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    loginUrl.searchParams.set("reason", "auth-required")
    return NextResponse.redirect(loginUrl)
  }

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
