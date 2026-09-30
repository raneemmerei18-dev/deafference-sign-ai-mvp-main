"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { getPasswordStrength } from "@/lib/validation"
import styles from "./auth.module.css"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const strength = getPasswordStrength(password)
  const passwordsMatch = password === confirmPassword && password.length > 0
  const isValid = password && passwordsMatch && strength.score >= 2 && token

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Password reset failed. The link may have expired.")
        return
      }

      // Redirect to login on success
      router.push("/auth/login?reset=success")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.error}>
            <h2>Invalid reset link</h2>
            <p>The password reset link is missing or invalid. Request a new one from the login page.</p>
            <a href="/auth/forgot-password" className="btn btn-secondary">
              Request new link
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create new password</h1>
          <p className={styles.description}>Enter a strong password to regain access to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="reset-password" className={styles.label}>
              New password
            </label>
            <input
              id="reset-password"
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
            <label htmlFor="reset-confirm" className={styles.label}>
              Confirm password
            </label>
            <input
              id="reset-confirm"
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

          {error && (
            <p className={styles.alert} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={!isValid || isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className={styles.footer}>
          <a href="/auth/login">Back to sign in</a>
        </p>
      </div>
    </div>
  )
}
