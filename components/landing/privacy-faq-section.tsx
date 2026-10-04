"use client"

import { useState } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { ChevronDownIcon } from "./icons"
import styles from "./privacy-faq-section.module.css"

export function PrivacyFaqSection() {
  const { dict } = useLanguage()
  const t = dict.privacyFaq
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <section className={`section ${styles.section}`} aria-labelledby="privacy-title">
      <div className="container">
        <div className={styles.layout}>
          {/* Privacy Policy */}
          <div className={styles.privacy}>
            <h2 id="privacy-title" className={styles.title}>
              {t.privacyTitle}
            </h2>
            <div className={styles.privacyContent}>
              <div className={styles.privacyBlock}>
                <h3 className={styles.blockTitle}>{t.dataCollection}</h3>
                <p className={styles.blockText}>{t.dataCollectionText}</p>
              </div>

              <div className={styles.privacyBlock}>
                <h3 className={styles.blockTitle}>{t.dataUsage}</h3>
                <p className={styles.blockText}>{t.dataUsageText}</p>
              </div>

              <div className={styles.privacyBlock}>
                <h3 className={styles.blockTitle}>{t.dataProtection}</h3>
                <p className={styles.blockText}>{t.dataProtectionText}</p>
              </div>

              <div className={styles.privacyBlock}>
                <h3 className={styles.blockTitle}>{t.userRights}</h3>
                <ul className={styles.rightsList}>
                  {t.rights.map((right: string) => (
                    <li key={right}>{right}</li>
                  ))}
                </ul>
              </div>

              <p className={styles.legalNote}>{t.legalNote}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className={styles.faq}>
            <h2 className={styles.title}>{t.faqTitle}</h2>
            <div className={styles.faqList}>
              {t.faqs.map((faq: { question: string; answer: string }, index: number) => (
                <details
                  key={index}
                  className={styles.faqItem}
                  open={expandedItems.has(index)}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleItem(index)
                  }}
                >
                  <summary className={styles.faqQuestion}>
                    <span>{faq.question}</span>
                    <ChevronDownIcon
                      size={20}
                      className={styles.chevron}
                      aria-hidden="true"
                    />
                  </summary>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
