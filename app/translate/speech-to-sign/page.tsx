import { TranslationSettings } from "@/components/translation/settings"
import { useTranslation } from "@/components/translation/translation-context"
import styles from "./page.module.css"

export default function SpeechToSignPage() {
  const { state } = useTranslation()

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.translationArea}>
          <div className={styles.header}>
            <h1 className={styles.title}>Speech → Sign</h1>
            <p className={styles.subtitle}>Hear speech, see it signed in real-time</p>
          </div>

          <div className={styles.audioRecorder}>
            <div className={styles.recorderHeader}>
              <span className={styles.statusLabel}>Microphone Status</span>
              <div className={styles.statusIndicator}>
                <span className={styles.statusDot} aria-hidden="true" />
                Ready
              </div>
            </div>

            <div className={styles.recorderControls}>
              <button className={styles.recordButton}>
                <span className={styles.recordIcon}>🎤</span>
                Start Recording
              </button>
              <button className={styles.stopButton} disabled>
                <span className={styles.stopIcon}>⏹️</span>
                Stop Recording
              </button>
            </div>

            {state.cameraEnabled ? (
              <p className={styles.permissionNote}>Microphone permission required. Click start recording to begin.</p>
            ) : (
              <p className={styles.permissionNote}>⚠️ Camera is disabled. Enable in settings to see sign language output.</p>
            )}
          </div>

          <div className={styles.output}>
            <div className={styles.outputSection}>
              <h2 className={styles.outputLabel}>Recognized Speech</h2>
              <div className={styles.speechBox}>
                <p className={styles.speechText}>Your speech will appear here as it's recognized</p>
              </div>
            </div>

            <div className={styles.outputSection}>
              <h2 className={styles.outputLabel}>Sign Language Video</h2>
              <div className={styles.videoPreview}>
                <p className={styles.previewText}>Sign language animation will appear here</p>
              </div>
            </div>
          </div>
        </section>

        <TranslationSettings />
      </div>
    </main>
  )
}
