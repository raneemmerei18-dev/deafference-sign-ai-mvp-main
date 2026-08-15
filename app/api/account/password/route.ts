import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentSession } from "@/lib/auth/current-user"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { MIN_PASSWORD_LENGTH } from "@/lib/validation"

const bodySchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
})

export async function POST(request: Request) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(session.sub) } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 })
    }

    const isValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 })
    }

    const passwordHash = await hashPassword(parsed.data.newPassword)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to update password:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
