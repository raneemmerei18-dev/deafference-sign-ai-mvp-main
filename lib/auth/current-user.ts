import { cookies } from "next/headers"
import { SESSION_COOKIE_NAME } from "./session"
import { verifySessionToken, type SessionPayload } from "./jwt"

/** Reads and verifies the session cookie for use in server components / route handlers. */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)
}
