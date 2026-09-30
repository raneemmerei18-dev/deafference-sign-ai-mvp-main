"use client"

import { useState } from "react"
import styles from "./auth.module.css"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isValid = email && email.includes("@")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Request failed. Try again.")
        return
      }

      setSuccess(true)
      setEmail("")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.success}>
            <h2 className={styles.successTitle}>Check your email</h2>
            <p className={styles.successBody}>
              If an account exists for that email, we've sent a password reset link. Click the link in the email to create a new password.
            </p>
            <p className={styles.successNote}>Check your spam folder if you don't see it in a few minutes.</p>
            <a href="/auth/login" className="btn btn-secondary">
              Back to sign in
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
          <h1 className={styles.title}>Reset password</h1>
          <p className={styles.description}>Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="forgot-email" className={styles.label}>
              Email
            </label>
            <input
              id="forgot-email"
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

          {error && (
            <p className={styles.alert} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={!isValid || isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className={styles.footer}>
          Remember your password? <a href="/auth/login">Sign in</a>
        </p>
      </div>
    </div>
  )
}
