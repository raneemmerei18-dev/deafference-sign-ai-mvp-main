"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { requestContact } from "./contact-intent"
import { ArrowRightIcon, LanguagesIcon, ShieldIcon, WifiOffIcon } from "./icons"
import styles from "./demo-section.module.css"

type DemoMode = "speechToSign" | "signToText"
type PhraseId = "greeting" | "help" | "doctor" | "water"

const MODES: DemoMode[] = ["speechToSign", "signToText"]
const PHRASE_IDS: PhraseId[] = ["greeting", "help", "doctor", "water"]

// ASL gloss (sign order, not English word order). Language-independent, so it
// lives here rather than in the dictionaries.
const GLOSSES: Record<PhraseId, string[]> = {
  greeting: ["HELLO", "HOW", "YOU"],
  help: ["ME", "NEED", "HELP", "PLEASE"],
  doctor: ["DOCTOR", "WHERE"],
  water: ["ME", "WANT", "WATER", "PLEASE"],
}

const SIGN_INTERVAL_MS = 650

/**
 * Reveals `count` items one at a time whenever `resetKey` changes. Renders
 * everything at once on the server and for users who prefer reduced motion.
 */
function useSequentialReveal(count: number, resetKey: string) {
  const [revealed, setRevealed] = useState(count)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(count)
      return
    }
    setRevealed(1)
    let step = 1
    const timer = window.setInterval(() => {
      step += 1
      setRevealed(step)
      if (step >= count) window.clearInterval(timer)
    }, SIGN_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [count, resetKey])

  return revealed
}

export function DemoSection() {
  const { dict } = useLanguage()
  const t = dict.demo
  const [mode, setMode] = useState<DemoMode>("speechToSign")
  const [phraseId, setPhraseId] = useState<PhraseId>("greeting")

  const gloss = GLOSSES[phraseId]
  const phrase = t.phrases[phraseId]
  const revealed = useSequentialReveal(gloss.length, `${mode}:${phraseId}`)
  const isComplete = revealed >= gloss.length

  const signs = (
    <ol className={styles.glossList} dir="ltr">
      {gloss.map((sign, index) => (
        <li
          key={`${sign}-${index}`}
          className={styles.gloss}
          data-state={index < revealed - 1 || isComplete ? "done" : index === revealed - 1 ? "current" : "pending"}
        >
          {sign}
        </li>
      ))}
    </ol>
  )
  const text = <p className={styles.phrase}>{phrase}</p>

  return (
    <section id="demo" className={`section ${styles.section}`} aria-labelledby="demo-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="demo-title" className={styles.title}>
            {t.title}
          </h1>
          <p className={styles.lead}>{t.lead}</p>

          <ul className={styles.badges}>
            <li className={styles.badge}>
              <WifiOffIcon size={16} />
              {t.badges.offline}
            </li>
            <li className={styles.badge}>
              <ShieldIcon size={16} />
              {t.badges.private}
            </li>
            <li className={styles.badge}>
              <LanguagesIcon size={16} />
              {t.badges.bilingual}
            </li>
          </ul>

          <div className={styles.ctas}>
            <a href="#contact" className="btn btn-primary btn-lg" onClick={() => requestContact("demo")}>
              {t.primaryCta}
              <ArrowRightIcon size={18} className="icon-flip-rtl" />
            </a>
            <a href="#pricing" className="btn btn-secondary btn-lg">
              {t.secondaryCta}
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <div role="group" aria-label={t.modesLabel} className={styles.modes}>
            {MODES.map((id) => (
              <button
                key={id}
                type="button"
                className={styles.mode}
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
              >
                {t.modes[id].from}
                <ArrowRightIcon size={16} className="icon-flip-rtl" />
                <span className="visually-hidden"> {t.to} </span>
                {t.modes[id].to}
              </button>
            ))}
          </div>

          <div role="group" aria-labelledby="demo-phrases-label" className={styles.phrases}>
            <p id="demo-phrases-label" className={styles.groupLabel}>
              {t.phrasesLabel}
            </p>
            <div className={styles.phraseList}>
              {PHRASE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={styles.phraseButton}
                  aria-pressed={phraseId === id}
                  onClick={() => setPhraseId(id)}
                >
                  {t.phrases[id]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.stage}>
            <div className={styles.pane}>
              <p className={styles.paneLabel}>{t.inputLabel[mode]}</p>
              {mode === "speechToSign" ? text : signs}
            </div>
            <div className={styles.arrow} aria-hidden="true">
              <ArrowRightIcon size={22} />
            </div>
            <div className={`${styles.pane} ${styles.outputPane}`}>
              <p className={styles.paneLabel}>{t.outputLabel[mode]}</p>
              {mode === "speechToSign" ? signs : isComplete ? text : <p className={styles.pending}>{t.translating}</p>}
            </div>
          </div>

          {/* Announce the finished result once, not every sign as it animates. */}
          <p className="visually-hidden" aria-live="polite">
            {isComplete ? `${t.outputLabel[mode]}: ${mode === "speechToSign" ? gloss.join(" ") : phrase}` : ""}
          </p>

          <ul className={styles.notes}>
            <li>{t.glossNote}</li>
            <li className={styles.offlineNote}>
              <WifiOffIcon size={16} />
              {t.offlineNote}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
