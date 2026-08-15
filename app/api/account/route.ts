import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentSession } from "@/lib/auth/current-user"
import { attachSessionCookie, clearSessionCookie } from "@/lib/auth/cookies"
import { EMAIL_PATTERN } from "@/lib/validation"

const patchSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name.").max(120).optional(),
  email: z.string().trim().toLowerCase().regex(EMAIL_PATTERN, "Enter a valid email address.").optional(),
  signLanguage: z.string().max(20).optional(),
})

export async function GET() {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: Number(session.sub) } })
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 })

  return NextResponse.json({
    user: {
      name: user.name ?? "",
      email: user.email,
      role: user.role,
      signLanguage: user.signLanguage ?? "",
      avatarUrl: user.avatarUrl,
    },
  })
}

export async function PATCH(request: Request) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 })

  const parsed = patchSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  const { fullName, email, signLanguage } = parsed.data
  if (fullName === undefined && email === undefined && signLanguage === undefined) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 })
  }

  try {
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing && existing.id !== Number(session.sub)) {
        return NextResponse.json({ error: "That email is already in use." }, { status: 409 })
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(session.sub) },
      data: {
        ...(fullName !== undefined ? { name: fullName } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(signLanguage !== undefined ? { signLanguage } : {}),
      },
    })

    const response = NextResponse.json({
      user: {
        name: user.name ?? "",
        email: user.email,
        role: user.role,
        signLanguage: user.signLanguage ?? "",
        avatarUrl: user.avatarUrl,
      },
    })
    // Re-issue the session cookie so /api/auth/me (and the nav) reflect a
    // changed name/email immediately instead of waiting for the old token to expire.
    return attachSessionCookie(response, {
      sub: String(user.id),
      email: user.email,
      name: user.name ?? "",
      role: user.role,
    })
  } catch (err) {
    console.error("Failed to update account:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function DELETE() {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 })

  try {
    await prisma.user.delete({ where: { id: Number(session.sub) } })
    return clearSessionCookie(NextResponse.json({ ok: true }))
  } catch (err) {
    console.error("Failed to delete account:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
