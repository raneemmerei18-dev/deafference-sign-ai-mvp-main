import { randomBytes, createHash } from "node:crypto"
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000
export const hashResetToken = (token: string) => createHash("sha256").update(token).digest("hex")
export function generateResetToken() { const token = randomBytes(32).toString("hex"); return { token, hash: hashResetToken(token) } }
