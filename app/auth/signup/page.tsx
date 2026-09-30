"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { getPasswordStrength } from "@/lib/validation"
import styles from "../auth.module.css"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const strength = getPasswordStrength(password)
  const passwordsMatch = password === confirmPassword && password.length > 0
  const isValid = email && password && passwordsMatch && agreedToTerms && strength.score >= 2

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Signup failed. Try again.")
        return
      }

      // Redirect to OTP verification
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.description}>Join Deafference to enable sign language translation in your organization.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="signup-email" className={styles.label}>
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aya@deafference.com"
              required
              dir="ltr"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-password" className={styles.label}>
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
            {password && (
              <div className={styles.strengthMeter}>
                <div className={styles.strengthBar} data-score={strength.score} />
                <span className={styles.strengthLabel}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-confirm" className={styles.label}>
              Confirm password
            </label>
            <input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
            {confirmPassword && !passwordsMatch && (
              <p className={styles.error}>Passwords don't match.</p>
            )}
          </div>

          <div className={styles.checkbox}>
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          {error && (
            <p className={styles.alert} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={!isValid || isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <a href="/auth/login">Sign in</a>
        </p>
      </div>
    </div>
  )
}
