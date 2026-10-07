"use client"

import { useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react"
import styles from "./otp-input.module.css"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  isLoading?: boolean
  error?: string
  autoFocus?: boolean
  disabled?: boolean
}

const OTP_LENGTH = 6

export function OTPInput({ value, onChange, onComplete, isLoading = false, error, autoFocus = true, disabled = false }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus first input on mount
  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus()
  }, [autoFocus])

  // Handle input change and auto-move to next box
  const handleChange = (index: number, newDigit: string) => {
    // Only allow digits
    if (!/^\d*$/.test(newDigit)) return

    // Single digit per box
    const digit = newDigit.slice(-1)
    const newValue = value.split("")
    newValue[index] = digit
    const result = newValue.join("")

    onChange(result)

    // Auto-advance to next box if digit entered
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Trigger callback when all boxes filled
    if (digit && result.length === OTP_LENGTH && /^\d{6}$/.test(result)) {
      onComplete?.(result)
    }
  }

  // Handle backspace to delete and move to previous box
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newValue = value.split("")
      newValue[index] = ""
      onChange(newValue.join(""))
      // Move to previous box if deleting
      if (value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      if (index > 0) inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      if (index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste (e.g. "123456" pasted into first box)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH).replace(/\D/g, "")
    if (pasted) {
      onChange(pasted)
      // Focus last box if full, otherwise focus next empty box
      const nextEmptyIndex = pasted.length
      if (nextEmptyIndex < OTP_LENGTH) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[OTP_LENGTH - 1]?.focus()
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup} role="group" aria-label="Verification code" aria-describedby={error ? "otp-error" : undefined}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={styles.box}
            data-state={value[index] ? "filled" : "empty"}
            data-error={error ? "true" : undefined}
            disabled={isLoading || disabled}
            aria-label={`Digit ${index + 1} of 6`}
            aria-invalid={error ? "true" : undefined}
          />
        ))}
      </div>
      {error ? (
        <p id="otp-error" className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <p className={styles.hint}>Enter the 6-digit code we sent to your email.</p>
    </div>
  )
}
