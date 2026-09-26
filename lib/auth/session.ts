export type SessionRole = "guest" | "user" | "admin"
export const SESSION_COOKIE_NAME = "df-session"
const VALID_ROLES: ReadonlySet<SessionRole> = new Set(["guest", "user", "admin"])
export function parseSessionRole(value: string | undefined | null): SessionRole { return value && VALID_ROLES.has(value as SessionRole) ? value as SessionRole : "guest" }
export function isAdminRole(role: SessionRole | undefined | null): role is "admin" { return role === "admin" }
