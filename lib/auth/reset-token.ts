import { randomBytes, createHash } from "node:crypto"

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

/** Random tokens already carry full entropy, so a fast deterministic hash (not bcrypt) is fine — and lets us look up by exact match. */
export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function generateResetToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("hex")
  return { token, hash: hashResetToken(token) }
}
