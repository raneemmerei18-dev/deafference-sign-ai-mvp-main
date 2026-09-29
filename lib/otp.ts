/**
 * OTP validation and generation shared by client and server.
 * OTP codes are 6 digits, numeric only.
 */

export const OTP_LENGTH = 6
export const OTP_RESEND_COOLDOWN_SECONDS = 60
export const OTP_EXPIRY_MINUTES = 10

export const OTP_PATTERN = /^\d{6}$/

export function validateOTP(code: string): boolean {
  return OTP_PATTERN.test(code.trim())
}

/**
 * Generate a random 6-digit OTP for testing/demo purposes.
 * In production, this would be generated server-side and stored with expiry.
 */
export function generateOTP(): string {
  return Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join("")
}

/**
 * Format OTP with spaces for display: "123456" → "123 456"
 */
export function formatOTPForDisplay(otp: string): string {
  return otp.slice(0, 3) + " " + otp.slice(3, 6)
}
