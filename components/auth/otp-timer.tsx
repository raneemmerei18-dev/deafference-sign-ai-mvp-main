"use client"

import { useEffect, useState } from "react"
import styles from "./otp-timer.module.css"

interface OTPTimerProps {
  initialSeconds?: number
  onExpire: () => void
  onResendClick: () => Promise<void>
}

export function OTPTimer({ initialSeconds = 60, onExpire, onResendClick }: OTPTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isResending, setIsResending] = useState(false)

  const isExpired = secondsLeft === 0
  const canResend = isExpired && !isResending

  useEffect(() => {
    if (isExpired) {
      onExpire()
      return
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isExpired, onExpire])

  const handleResend = async () => {
    setIsResending(true)
    try {
      await onResendClick()
      setSecondsLeft(initialSeconds)
    } finally {
      setIsResending(false)
    }
  }

  const minutesLeft = Math.floor(secondsLeft / 60)
  const secondsDisplay = String(secondsLeft % 60).padStart(2, "0")

  return (
    <div className={styles.container}>
      <div className={styles.timerDisplay} aria-live="polite" role="status">
        {!isExpired ? (
          <>
            <span className={styles.label}>Code expires in</span>
            <span className={styles.time}>
              {minutesLeft}:{secondsDisplay}
            </span>
          </>
        ) : (
          <span className={styles.expired}>Code has expired</span>
        )}
      </div>

      {isExpired ? (
        <button type="button" className={`btn btn-secondary ${styles.resendButton}`} onClick={handleResend} disabled={isResending}>
          {isResending ? "Sending..." : "Send new code"}
        </button>
      ) : (
        <p className={styles.note}>Didn't receive a code? Check your spam folder.</p>
      )}
    </div>
  )
}
