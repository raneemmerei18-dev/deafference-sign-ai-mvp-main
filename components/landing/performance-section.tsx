"use client"

import { useLanguage } from "@/components/i18n/language-provider"
import { SectionHeader } from "./section-header"
import styles from "./performance-section.module.css"

export function PerformanceSection() {
  const { dict } = useLanguage()
  const t = dict.performance

  return (
    <section id="performance" className={`section ${styles.section}`} aria-labelledby="performance-title">
      <div className="container">
        <SectionHeader id="performance-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className={styles.statsGrid}>
          {t.stats.map((stat: { label: string; value: string; description: string }) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.value}>{stat.value}</div>
              <p className={styles.label}>{stat.label}</p>
              <p className={styles.description}>{stat.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.languages}>
          <h3 className={styles.languagesTitle}>{t.languagesTitle}</h3>
          <p className={styles.languagesDescription}>{t.languagesDescription}</p>
          <div className={styles.languagesList}>
            {t.supportedLanguages.map((lang: string) => (
              <div key={lang} className={styles.languageBadge}>
                {lang}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.benchmark}>
          <h3 className={styles.benchmarkTitle}>{t.benchmarkTitle}</h3>
          <div className={styles.benchmarkContent}>
            {t.benchmarks.map((benchmark: { name: string; value: string }) => (
              <div key={benchmark.name} className={styles.benchmarkItem}>
                <span className={styles.benchmarkName}>{benchmark.name}</span>
                <span className={styles.benchmarkValue}>{benchmark.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
