import { TranslationSettings } from "@/components/translation/settings"
import { useTranslation } from "@/components/translation/translation-context"
import styles from "./page.module.css"

export default function TextToSpeechPage() {
  const { state } = useTranslation()

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.translationArea}>
          <div className={styles.header}>
            <h1 className={styles.title}>Text → Speech & Sign</h1>
            <p className={styles.subtitle}>Convert written text to speech and sign language</p>
          </div>

          <div className={styles.inputSection}>
            <label htmlFor="text-input" className={styles.inputLabel}>
              Enter or paste text
            </label>
            <textarea
              id="text-input"
              className={styles.textInput}
              placeholder="Type or paste text here... it will be translated to speech and sign language"
              maxLength={500}
            />
            <div className={styles.charCount}>
              <span>0 / 500</span>
            </div>
          </div>

          <div className={styles.output}>
            <div className={styles.outputSection}>
              <h2 className={styles.outputLabel}>Sign Language Video</h2>
              <div className={styles.videoPreview}>
                <p className={styles.previewText}>Sign language animation will appear here</p>
              </div>
            </div>

            <div className={styles.outputSection}>
              <h2 className={styles.outputLabel}>Speech Output</h2>
              <div className={styles.speechControls}>
                <button className={styles.playButton}>▶ Play Speech</button>
                <button className={styles.pauseButton}>⏸ Pause</button>
              </div>
            </div>
          </div>
        </section>

        <TranslationSettings />
      </div>
    </main>
  )
}
