"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { getPasswordStrength } from "@/lib/validation"
import { ErrorAlert } from "@/components/auth/error-alert"
import { FieldError } from "@/components/auth/field-error"
import { CheckCircleIcon, LockIcon, MailIcon } from "@/components/landing/icons"
import styles from "../auth.module.css"

interface SignupError {
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
  form?: string
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<SignupError>({})
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const strength = getPasswordStrength(password)
  const passwordsMatch = password === confirmPassword && password.length > 0
  const isValid = email && password && passwordsMatch && agreedToTerms && strength.score >= 2

  const validateFields = () => {
    const newErrors: SignupError = {}

    if (!email) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (strength.score < 2) {
      newErrors.password = `Password is too weak. ${strength.suggestions?.[0] || "Add uppercase, numbers, or symbols."}`
    }

    if (confirmPassword && !passwordsMatch) {
      newErrors.confirmPassword = "Passwords do not match. Please check and try again."
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms of Service and Privacy Policy"
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({
            form: "This email is already registered. Try signing in or use a different email.",
          })
        } else if (response.status === 400) {
          if (data.error?.includes("email")) {
            setErrors({ email: data.error })
          } else {
            setErrors({ form: data.error || "Invalid signup information. Please check and try again." })
          }
        } else {
          setErrors({
            form: data.error || "Signup failed. Please try again.",
          })
        }
        return
      }

      router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
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
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.description}>Join Deafference to enable sign language translation in your organization.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="signup-email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <MailIcon size={18} className={styles.fieldIcon} aria-hidden="true" />
              <input
                id="signup-email"
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
              <FieldError message={errors.email} hint="You'll use this to sign in later" />
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="signup-password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <LockIcon size={18} className={styles.fieldIcon} aria-hidden="true" />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={styles.input}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }
                }}
                placeholder="At least 8 characters"
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
            {errors.password && <FieldError message={errors.password} />}
            {password && !errors.password && (
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
            <div className={styles.inputWrapper}>
              <LockIcon size={18} className={styles.fieldIcon} aria-hidden="true" />
              <input
                id="signup-confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                placeholder="Re-enter password"
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
              />
            </div>
            {errors.confirmPassword && (
              <FieldError message={errors.confirmPassword} />
            )}
            {confirmPassword && passwordsMatch && !errors.confirmPassword && (
              <p className={styles.success}>
                <CheckCircleIcon size={16} /> Passwords match
              </p>
            )}
          </div>

          <div className={styles.fieldset}>
            <div className={styles.checkbox}>
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked)
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: undefined }))
                  }
                }}
                required
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? "terms-error" : undefined}
              />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && (
              <FieldError message={errors.terms} />
            )}
          </div>

          {errors.form && (
            <ErrorAlert message={errors.form} />
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
