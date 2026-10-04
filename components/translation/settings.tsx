"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { ChevronDownIcon } from "@/components/landing/icons"
import styles from "./settings.module.css"

interface TranslationSettings {
  cameraEnabled: boolean
  landmarkOverlay: boolean
  signDialect: string
}

const DEFAULT_SETTINGS: TranslationSettings = {
  cameraEnabled: true,
  landmarkOverlay: false,
  signDialect: "asl",
}

const SIGN_DIALECTS = [
  { id: "asl", label: "American Sign Language (ASL)" },
  { id: "bsl", label: "British Sign Language (BSL)" },
  { id: "lsf", label: "French Sign Language (LSF)" },
  { id: "arabicsl", label: "Arabic Sign Language" },
  { id: "local", label: "Local Sign Language" },
]

interface SettingsProps {
  onSettingsChange?: (settings: TranslationSettings) => void
}

export function TranslationSettings({ onSettingsChange }: SettingsProps) {
  const { dict } = useLanguage()
  const t = dict.translationSettings
  const [settings, setSettings] = useState<TranslationSettings>(DEFAULT_SETTINGS)
  const [isOpen, setIsOpen] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem("translationSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch {
        setSettings(DEFAULT_SETTINGS)
      }
    }
  }, [])

  const handleCameraToggle = () => {
    const updated = { ...settings, cameraEnabled: !settings.cameraEnabled }
    setSettings(updated)
    saveSettings(updated)
  }

  const handleLandmarkToggle = () => {
    const updated = { ...settings, landmarkOverlay: !settings.landmarkOverlay }
    setSettings(updated)
    saveSettings(updated)
  }

  const handleDialectChange = (dialectId: string) => {
    const updated = { ...settings, signDialect: dialectId }
    setSettings(updated)
    saveSettings(updated)
    setIsOpen(false)
  }

  const saveSettings = (newSettings: TranslationSettings) => {
    localStorage.setItem("translationSettings", JSON.stringify(newSettings))
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2000)
    onSettingsChange?.(newSettings)
  }

  const selectedDialect = SIGN_DIALECTS.find((d) => d.id === settings.signDialect)

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
          setSettings(DEFAULT_SETTINGS)
          localStorage.removeItem("translationSettings")
          setSavedMessage(true)
          setTimeout(() => setSavedMessage(false), 2000)
          onSettingsChange?.(DEFAULT_SETTINGS)
        }}
      >
        {t.resetButton}
      </button>
    </aside>
  )
}
