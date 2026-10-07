import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/require-admin"

const patchSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  suspended: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin()
  if (response) return response

  const { id } = await params
  const targetId = Number(id)
  if (!Number.isInteger(targetId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || (parsed.data.role === undefined && parsed.data.suspended === undefined)) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 })
  }

  if (targetId === Number(session!.sub) && (parsed.data.role === "user" || parsed.data.suspended === true)) {
    return NextResponse.json({ error: "You can't revoke your own admin access or suspend yourself." }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({ where: { id: targetId }, data: parsed.data })
    return NextResponse.json({
      user: {
        id: String(user.id),
        name: user.name ?? user.email,
        email: user.email,
        role: user.role,
        suspended: user.suspended,
        joinedDate: user.createdAt.toISOString(),
      },
    })
  } catch (err) {
    console.error("Failed to update user:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin()
  if (response) return response

  const { id } = await params
  const targetId = Number(id)
  if (!Number.isInteger(targetId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 })
  }

  if (targetId === Number(session!.sub)) {
    return NextResponse.json({ error: "You can't delete your own account from here." }, { status: 400 })
  }

  try {
    await prisma.user.delete({ where: { id: targetId } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Failed to delete user:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
