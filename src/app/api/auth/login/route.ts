import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth/password"
import { attachSessionCookie } from "@/lib/auth/cookies"

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
})

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password."

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  const email = parsed.data.identifier.trim().toLowerCase()

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    // Same generic message whether the account is missing or the password's
    // wrong — don't let responses leak which emails are registered.
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 })
    }

    const isValid = await verifyPassword(parsed.data.password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 })
    }

    if (user.suspended) {
      return NextResponse.json(
        { error: "This account has been suspended. Contact an administrator for help." },
        { status: 403 },
      )
    }

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
    console.error("Login failed:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
