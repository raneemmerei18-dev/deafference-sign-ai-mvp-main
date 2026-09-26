import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME } from "@/lib/auth/session"
import { verifySessionToken } from "@/lib/auth/jwt"

export async function middleware(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)
  const role = session?.role ?? "guest"
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/")

  if (role === "guest") {
    if (isApiRoute) return NextResponse.json({ error: "Sign in first." }, { status: 401 })
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    loginUrl.searchParams.set("reason", "auth-required")
    return NextResponse.redirect(loginUrl)
  }

  if (role !== "admin") {
    if (isApiRoute) return NextResponse.json({ error: "Admin access required." }, { status: 403 })
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  return NextResponse.next()
}

// Defense in depth: /api/admin/* routes also self-check via requireAdmin(),
// but gating them here too means a future route can't accidentally ship
// without that check.
export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
}
