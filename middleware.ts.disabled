import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME } from "@/lib/auth/session"
import { verifySessionToken } from "@/lib/auth/jwt"

export async function middleware(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)
  const role = session?.role ?? "guest"

  if (role === "guest") return NextResponse.json({ error: "Sign in first." }, { status: 401 })
  if (role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 })

  return NextResponse.next()
}

// Defense in depth: /api/admin/* routes also self-check via requireAdmin(),
// but gating them here too means a future route can't accidentally ship
// without that check. Page routes (e.g. an /admin UI) should handle 401/403
// from the API themselves rather than being redirected here.
export const config = {
  matcher: ["/api/admin/:path*"],
}
