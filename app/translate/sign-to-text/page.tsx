"use client"

import { useState } from "react"
import { TranslationSettings } from "@/components/translation/settings"
import { StatusIndicator } from "@/components/translation/status-indicator"
import styles from "./page.module.css"

export default function SignToTextPage() {
  const [status, setStatus] = useState<"ready" | "listening" | "low-confidence" | "error">("ready")

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <StatusIndicator state={status} variant="badge" position="top-right" />
        <section className={styles.translationArea}>
          <div className={styles.header}>
            <h1 className={styles.title}>Sign → Text/Speech</h1>
            <p className={styles.subtitle}>Show your signs, get text and speech</p>
          </div>

          <div className={styles.cameraPreview}>
            <div className={styles.cameraPlaceholder}>
              <p>Camera feed will appear here</p>
              <p className={styles.cameraNote}>Grant camera permissions to begin</p>
            </div>
          </div>

          <div className={styles.output}>
            <div className={styles.outputSection}>
              <h2 className={styles.outputLabel}>Detected Text</h2>
              <div className={styles.outputBox}>
                <p className={styles.outputText}>Text will appear here as signs are recognized</p>
              </div>
            </div>

            <div className={styles.outputSection}>
              <h2 className={styles.outputLabel}>Speech Output</h2>
              <button className={styles.playButton}>Play Speech</button>
            </div>
          </div>

          <div className={styles.statusDemo}>
            <h3 className={styles.demTitle}>Status States (Demo)</h3>
            <div className={styles.demoControls}>
              <button
                className={`${styles.demoButton} ${status === "ready" ? styles.demoButtonActive : ""}`}
                onClick={() => setStatus("ready")}
              >
                Ready
              </button>
              <button
                className={`${styles.demoButton} ${status === "listening" ? styles.demoButtonActive : ""}`}
                onClick={() => setStatus("listening")}
              >
                Listening
              </button>
              <button
                className={`${styles.demoButton} ${status === "low-confidence" ? styles.demoButtonActive : ""}`}
                onClick={() => setStatus("low-confidence")}
              >
                Low Confidence
              </button>
              <button
                className={`${styles.demoButton} ${status === "error" ? styles.demoButtonActive : ""}`}
                onClick={() => setStatus("error")}
              >
                Error
              </button>
            </div>
            <div className={styles.bannerDemo}>
              <StatusIndicator state={status} variant="banner" />
            </div>
          </div>
        </section>

        <TranslationSettings />
      </div>
    </main>
  )
}
