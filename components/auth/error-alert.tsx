"use client"

import styles from "./error-alert.module.css"
import { AlertIcon } from "@/components/landing/icons"

interface ErrorAlertProps {
  message: string
  type?: "error" | "warning"
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function ErrorAlert({ message, type = "error", icon, action }: ErrorAlertProps) {
  return (
    <div className={styles.alert} data-type={type} role="alert" aria-live="polite">
      <span className={styles.iconWrapper}>
        {icon || <AlertIcon size={18} />}
      </span>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {action && (
          <button type="button" className={styles.actionButton} onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
