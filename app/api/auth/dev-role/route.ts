import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentSession } from "@/lib/auth/current-user"
import { attachSessionCookie } from "@/lib/auth/cookies"

const bodySchema = z.object({ role: z.enum(["user", "admin"]) })

/**
 * Dev-only: flips the signed-in account's own role so RBAC (route guards,
 * conditional nav) can be exercised without a second real admin account.
 * Requires an existing session — there is no guest→role escalation here.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 403 })
  }

  const session = await getCurrentSession()
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 })
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(session.sub) },
      data: { role: parsed.data.role },
    })

    const response = NextResponse.json({
      user: { name: user.name, email: user.email, role: user.role },
    })
    return attachSessionCookie(response, {
      sub: String(user.id),
      email: user.email,
      name: user.name ?? "",
      role: user.role,
    })
  } catch (err) {
    console.error("Dev role switch failed:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
