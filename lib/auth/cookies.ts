import type { NextResponse } from "next/server"
import { SESSION_COOKIE_NAME } from "./session"
import { SESSION_MAX_AGE_SECONDS, signSessionToken, type SessionPayload } from "./jwt"
export async function attachSessionCookie(response: NextResponse, payload: SessionPayload) { const token = await signSessionToken(payload); response.cookies.set(SESSION_COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_MAX_AGE_SECONDS }); return response }
export function clearSessionCookie(response: NextResponse) { response.cookies.set(SESSION_COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); return response }
