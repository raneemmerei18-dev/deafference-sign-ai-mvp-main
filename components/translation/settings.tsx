"use client"

import { useState } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { useTranslation } from "@/components/translation/translation-context"
import { ChevronDownIcon } from "@/components/landing/icons"
import styles from "./settings.module.css"

const SIGN_DIALECTS = [
  { id: "asl", label: "American Sign Language (ASL)" },
  { id: "bsl", label: "British Sign Language (BSL)" },
  { id: "lsf", label: "French Sign Language (LSF)" },
  { id: "arabicsl", label: "Arabic Sign Language" },
  { id: "local", label: "Local Sign Language" },
]

export function TranslationSettings() {
  const { dict } = useLanguage()
  const t = dict.translationSettings
  const { state, setState } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  const handleCameraToggle = () => {
    setState({ cameraEnabled: !state.cameraEnabled })
    showSavedMessage()
  }

  const handleLandmarkToggle = () => {
    setState({ landmarkOverlay: !state.landmarkOverlay })
    showSavedMessage()
  }

  const handleDialectChange = (dialectId: string) => {
    setState({ signDialect: dialectId })
    setIsOpen(false)
    showSavedMessage()
  }

  const showSavedMessage = () => {
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2000)
  }

  const selectedDialect = SIGN_DIALECTS.find((d) => d.id === state.signDialect)

  return (
    <aside className={styles.settings} aria-label={t.title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.title}</h2>
      </div>

      <div className={styles.content}>
        {/* Camera Toggle */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            <label htmlFor="camera-toggle" className={styles.label}>
              {t.cameraLabel}
            </label>
            <span className={styles.hint}>{t.cameraHint}</span>
          </div>
          <button
            id="camera-toggle"
            className={`${styles.toggle} ${settings.cameraEnabled ? styles.toggleOn : styles.toggleOff}`}
            onClick={handleCameraToggle}
            role="switch"
            aria-checked={settings.cameraEnabled}
            aria-label={`${t.cameraLabel}: ${settings.cameraEnabled ? t.on : t.off}`}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>

        {/* Landmark Overlay Toggle */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            <label htmlFor="landmark-toggle" className={styles.label}>
              {t.landmarkLabel}
            </label>
            <span className={styles.hint}>{t.landmarkHint}</span>
          </div>
          <button
            id="landmark-toggle"
            className={`${styles.toggle} ${settings.landmarkOverlay ? styles.toggleOn : styles.toggleOff}`}
            onClick={handleLandmarkToggle}
            role="switch"
            aria-checked={settings.landmarkOverlay}
            aria-label={`${t.landmarkLabel}: ${settings.landmarkOverlay ? t.on : t.off}`}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>

        {/* Dialect Selection */}
        <div className={styles.section}>
          <label htmlFor="dialect-select" className={styles.label}>
            {t.dialectLabel}
          </label>
          <div className={styles.dropdownWrapper}>
            <button
              id="dialect-select"
              className={styles.dropdownButton}
              onClick={() => setIsOpen(!isOpen)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className={styles.dropdownText}>
                {selectedDialect?.label || t.selectDialect}
              </span>
              <ChevronDownIcon
                size={20}
                className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ""}`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div className={styles.dropdownMenu} role="listbox">
                {SIGN_DIALECTS.map((dialect) => (
                  <button
                    key={dialect.id}
                    className={`${styles.dropdownItem} ${
                      settings.signDialect === dialect.id ? styles.dropdownItemActive : ""
                    }`}
                    onClick={() => handleDialectChange(dialect.id)}
                    role="option"
                    aria-selected={settings.signDialect === dialect.id}
                  >
                    {dialect.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Status Message */}
        {savedMessage && <div className={styles.savedMessage}>{t.saved}</div>}
      </div>

      {/* Reset Button */}
      <button
        className={styles.resetButton}
        onClick={() => {
          setState({ cameraEnabled: true, landmarkOverlay: false, signDialect: "asl" })
          showSavedMessage()
        }}
      >
        {t.resetButton}
      </button>
    </aside>
  )
}
