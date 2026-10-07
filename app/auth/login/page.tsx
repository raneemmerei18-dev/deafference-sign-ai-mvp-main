"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ErrorAlert } from "@/components/auth/error-alert"
import { FieldError } from "@/components/auth/field-error"
import { LockIcon, MailIcon } from "@/components/landing/icons"
import styles from "../auth.module.css"

interface LoginError {
  email?: string
  password?: string
  form?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<LoginError>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isValid = email && password

  const validateFields = () => {
    const newErrors: LoginError = {}

    if (!email) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateFields()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({
            form: "Invalid email or password. Please check and try again.",
          })
        } else if (response.status === 429) {
          setErrors({
            form: "Too many login attempts. Please try again in a few minutes.",
          })
        } else {
          setErrors({
            form: data.error || "Login failed. Please try again.",
          })
        }
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setErrors({
        form: "Network error. Please check your connection and try again.",
      })
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
            <div className={styles.inputWrapper}>
              <MailIcon size={18} className={styles.fieldIcon} aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={styles.input}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }
                }}
                placeholder="aya@deafference.com"
                required
                dir="ltr"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <FieldError
                message={errors.email}
                hint="Use your work or personal email address"
              />
            )}
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
            <div className={styles.inputWrapper}>
              <LockIcon size={18} className={styles.fieldIcon} aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={styles.input}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }
                }}
                placeholder="Enter your password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className={styles.visibilityToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <FieldError
                message={errors.password}
                hint="Passwords are case-sensitive"
              />
            )}
          </div>

          {errors.form && (
            <ErrorAlert
              message={errors.form}
              type={errors.form.includes("attempts") ? "warning" : "error"}
              action={errors.form.includes("attempts") ? undefined : {
                label: "Reset password",
                onClick: () => router.push("/auth/forgot-password"),
              }}
            />
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
