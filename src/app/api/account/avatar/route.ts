import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentSession } from "@/lib/auth/current-user"

// Small profile pictures only — this stores the image inline as a data URL
// rather than pulling in an object-storage dependency for an MVP avatar field.
const MAX_DATA_URL_LENGTH = 700_000 // ~500KB image, base64-inflated
const DATA_URL_PATTERN = /^data:image\/(png|jpeg);base64,/

const bodySchema = z.object({
  dataUrl: z
    .string()
    .max(MAX_DATA_URL_LENGTH, "Image is too large. Please choose a smaller picture.")
    .regex(DATA_URL_PATTERN, "Please upload a PNG or JPEG image."),
})

export async function POST(request: Request) {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid image." }, { status: 400 })
  }

  try {
    await prisma.user.update({
      where: { id: Number(session.sub) },
      data: { avatarUrl: parsed.data.dataUrl },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to save avatar:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function DELETE() {
  const session = await getCurrentSession()
  if (!session) return NextResponse.json({ error: "Sign in first." }, { status: 401 })

  try {
    await prisma.user.update({ where: { id: Number(session.sub) }, data: { avatarUrl: null } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to remove avatar:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
