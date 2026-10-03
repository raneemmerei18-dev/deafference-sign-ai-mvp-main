export type SessionRole = "guest" | "user" | "admin"

/** Name of the signed session cookie verified by `middleware.ts` and issued by `/api/auth/*`. */
export const SESSION_COOKIE_NAME = "df-session"

const VALID_ROLES: ReadonlySet<SessionRole> = new Set(["guest", "user", "admin"])

/** Normalizes an arbitrary value into a known role, defaulting to "guest". */
export function parseSessionRole(value: string | undefined | null): SessionRole {
  return value && VALID_ROLES.has(value as SessionRole) ? (value as SessionRole) : "guest"
}

export function isAdminRole(role: SessionRole | undefined | null): role is "admin" {
  return role === "admin"
}
