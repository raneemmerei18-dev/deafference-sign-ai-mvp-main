"use client"

import styles from "./field-error.module.css"

interface FieldErrorProps {
  message: string | null | undefined
  hint?: string
}

export function FieldError({ message, hint }: FieldErrorProps) {
  if (!message) return null

  return (
    <div className={styles.container}>
      <p className={styles.error} role="alert">
        <span className={styles.symbol}>⚠</span>
        {message}
      </p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
