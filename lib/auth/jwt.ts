import { jwtVerify, SignJWT } from "jose"
import type { SessionRole } from "./session"

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7 // 7 days

export interface SessionPayload {
  sub: string
  email: string
  name: string
  role: SessionRole
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a random string of at least 32 characters in your .env file.",
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: payload.role as SessionRole,
    }
  } catch {
    return null
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_SECONDS
