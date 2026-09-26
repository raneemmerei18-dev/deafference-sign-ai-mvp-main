import { NextResponse } from "next/server"
import { getCurrentSession } from "./current-user"
export async function requireAdmin() { const session = await getCurrentSession(); if (!session) return { session: null, response: NextResponse.json({ error: "Sign in first." }, { status: 401 }) } as const; if (session.role !== "admin") return { session: null, response: NextResponse.json({ error: "Admin access required." }, { status: 403 }) } as const; return { session, response: null } as const }
