"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from "../auth.module.css"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isValid = email && password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed. Check your email and password.")
        return
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sign in</h1>
          <p className={styles.description}>Enter your email and password to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="login-email" className={styles.label}>
              Email
            </label>
            <input
              id="login-email"
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
            <div className={styles.labelRow}>
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <a href="/auth/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className={styles.alert} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={!isValid || isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account? <a href="/auth/signup">Create one</a>
        </p>
      </div>
    </div>
  )
}
