import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/auth/reset-token"
import { EMAIL_PATTERN } from "@/lib/validation"

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().regex(EMAIL_PATTERN, "Enter a valid email address."),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  // Always respond the same way whether or not the account exists — the
  // response must not reveal which emails are registered.
  const genericResponse = { ok: true, message: "If an account exists for that email, a reset link has been sent." }

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json(genericResponse)
    }

    const { token, hash } = generateResetToken()
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: hash,
        passwordResetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    })

    const resetUrl = `${new URL(request.url).origin}/reset-password?token=${token}`

    // No email provider is configured yet — log server-side so local/dev
    // testing can complete the flow, and hand the link back directly outside
    // production so it isn't just discoverable in a server log.
    console.log(`[password reset] ${parsed.data.email} -> ${resetUrl}`)

    return NextResponse.json(
      process.env.NODE_ENV === "production" ? genericResponse : { ...genericResponse, devResetUrl: resetUrl },
    )
  } catch (err) {
    console.error("Failed to request password reset:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
