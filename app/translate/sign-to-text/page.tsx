"use client"

import { useState } from "react"
import { TranslationSettings } from "@/components/translation/settings"
import { HistoryDrawer } from "@/components/translation/history-drawer"
import styles from "./page.module.css"

export default function SignToTextPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  return (
    <main className={styles.main}>
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <div className={styles.container}>
        <section className={styles.translationArea}>
          <div className={styles.header}>
            <h1 className={styles.title}>Sign → Text/Speech</h1>
            <p className={styles.subtitle}>Show your signs, get text and speech</p>
            <button
              className={styles.historyButton}
              onClick={() => setIsHistoryOpen(true)}
              title="Open translation history"
              type="button"
            >
              📋 History
            </button>
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
        </section>

        <TranslationSettings />
      </div>
    </main>
  )
}
