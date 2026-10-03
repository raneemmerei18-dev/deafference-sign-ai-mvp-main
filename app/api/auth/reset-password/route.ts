import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/password"
import { hashResetToken } from "@/lib/auth/reset-token"
import { MIN_PASSWORD_LENGTH } from "@/lib/validation"

const bodySchema = z.object({
  token: z.string().min(1, "Missing reset token."),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
})

const INVALID_TOKEN_MESSAGE = "This reset link is invalid or has expired. Request a new one."

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  try {
    const hash = hashResetToken(parsed.data.token)
    const user = await prisma.user.findFirst({ where: { passwordResetTokenHash: hash } })

    if (!user || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt < new Date()) {
      return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 })
    }

    const passwordHash = await hashPassword(parsed.data.password)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, passwordResetTokenHash: null, passwordResetTokenExpiresAt: null },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to reset password:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
