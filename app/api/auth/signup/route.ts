import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/password"
import { attachSessionCookie } from "@/lib/auth/cookies"
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from "@/lib/validation"

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name.").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address.")
    .regex(EMAIL_PATTERN, "Enter a valid email address."),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
})

/** Comma-separated allowlist of emails that get provisioned as admin on signup. */
function resolveRole(email: string): "user" | "admin" {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
  return adminEmails.includes(email) ? "admin" : "user"
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
  }

  const { fullName, email, password } = parsed.data

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const role = resolveRole(email)

    const user = await prisma.user.create({
      data: { email, name: fullName, passwordHash, role },
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
    // Covers a duplicate-email race (two signups landing between the check
    // above and this insert) and any database/connection failure.
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }
    console.error("Signup failed:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
