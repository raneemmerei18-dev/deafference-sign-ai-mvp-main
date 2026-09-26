export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8
const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const
export function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return { score, label: STRENGTH_LABELS[score] }
}
