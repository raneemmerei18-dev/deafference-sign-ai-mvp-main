export type SessionRole = "guest" | "user" | "admin"

/**
 * Name of the mock session cookie read by `middleware.ts` and written by
 * `AuthProvider`/`useAuth()`. There is no real backend session yet, so this
 * is a development-only stand-in — before shipping, replace it with a
 * server-issued, httpOnly, signed session (JWT or database-backed session
 * id) that middleware verifies, rather than trusting a client-writable
 * cookie value directly.
 */
export const SESSION_COOKIE_NAME = "df-mock-role"

const VALID_ROLES: ReadonlySet<SessionRole> = new Set(["guest", "user", "admin"])

/** Normalizes an arbitrary cookie value into a known role, defaulting to "guest". */
export function parseSessionRole(value: string | undefined | null): SessionRole {
  return value && VALID_ROLES.has(value as SessionRole) ? (value as SessionRole) : "guest"
}

export function isAdminRole(role: SessionRole | undefined | null): role is "admin" {
  return role === "admin"
}
