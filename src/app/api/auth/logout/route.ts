import { NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/auth/cookies"

export async function POST() {
  return clearSessionCookie(NextResponse.json({ ok: true }))
}
