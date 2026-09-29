"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { OTPInput } from "@/components/auth/otp-input"
import { OTPTimer } from "@/components/auth/otp-timer"
import styles from "./verify.module.css"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOTP] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [codeExpired, setCodeExpired] = useState(false)

  // Demo: auto-fill OTP for testing (remove in production)
  useEffect(() => {
    const demoOTP = localStorage.getItem("demo-otp")
    if (demoOTP && !otp) setOTP(demoOTP)
  }, [otp])

  const handleSubmit = async (code: string) => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid or expired code. Try again.")
        return
      }

      // Success: redirect to dashboard or home
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setCodeExpired(false)
    setOTP("")

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || "Failed to send code. Try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    }
  }

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !codeExpired) {
      handleSubmit(otp)
    }
  }, [otp, isLoading, codeExpired])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Verify your email</h1>
          <p className={styles.description}>We sent a 6-digit code to {email}. Enter it below to continue.</p>
        </div>

        <OTPInput
          value={otp}
          onChange={setOTP}
          onComplete={handleSubmit}
          isLoading={isLoading || isResending}
          error={error || (codeExpired ? "Code expired. Send a new one." : "")}
          autoFocus={true}
        />

        <OTPTimer initialSeconds={60} onExpire={() => setCodeExpired(true)} onResendClick={handleResend} />

        <div className={styles.actions}>
          <a href="#" onClick={() => router.back()} className={styles.backLink}>
            ← Change email
          </a>
        </div>
      </div>

      {/* Demo notice */}
      <div className={styles.demo}>
        <p>
          <strong>Demo mode:</strong> Check your browser's localStorage for a demo OTP code. In production, codes are sent via email only.
        </p>
      </div>
    </div>
  )
}
