"use client"

import styles from "./status-indicator.module.css"

type StatusState = "ready" | "listening" | "low-confidence" | "error"

interface StatusIndicatorProps {
  state: StatusState
  variant?: "badge" | "banner"
  position?: string
}

const STATUS_CONFIG = {
  ready: {
    label: "Ready",
    description: "Camera connected. Waiting for sign input.",
    color: "success",
    icon: "●",
  },
  listening: {
    label: "Listening/Tracking",
    description: "Actively tracking hand movements and signs.",
    color: "active",
    icon: "◆",
  },
  "low-confidence": {
    label: "Low Confidence",
    description: "Hand detection unclear. Move hands into view or improve lighting.",
    color: "warning",
    icon: "◆",
  },
  error: {
    label: "Error/No Hand Detected",
    description: "No hands visible in camera feed. Ensure both hands are in view.",
    color: "error",
    icon: "●",
  },
}

export function StatusIndicator({
  state,
  variant = "badge",
  position = "top-right",
}: StatusIndicatorProps) {
  const config = STATUS_CONFIG[state]

  if (variant === "banner") {
    return (
      <div
        className={`${styles.banner} ${styles[`banner-${config.color}`]}`}
        role="status"
        aria-live="polite"
        aria-label={`Status: ${config.label}`}
      >
        <div className={styles.bannerContent}>
          <div className={styles.bannerHeader}>
            <span className={`${styles.icon} ${styles[`icon-${config.color}`]}`}>
              {config.icon}
            </span>
            <h3 className={styles.bannerLabel}>{config.label}</h3>
          </div>
          <p className={styles.bannerDescription}>{config.description}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${styles.badge} ${styles[`badge-${config.color}`]} ${styles[`position-${position}`]}`}
      role="status"
      aria-live="polite"
      aria-label={`Status: ${config.label}. ${config.description}`}
    >
      <span className={`${styles.icon} ${styles[`icon-${config.color}`]}`}>
        {config.icon}
      </span>
      <div className={styles.badgeContent}>
        <div className={styles.badgeLabel}>{config.label}</div>
        <div className={styles.badgeDescription}>{config.description}</div>
      </div>
    </div>
  )
}
