import { NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth/current-user"

export async function GET() {
  const session = await getCurrentSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }
  return NextResponse.json({
    user: { name: session.name, email: session.email, role: session.role },
  })
}
