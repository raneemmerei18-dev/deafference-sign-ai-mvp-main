"use client"

import { useLanguage } from "@/components/i18n/language-provider"
import { SectionHeader } from "./section-header"
import styles from "./features-section.module.css"

export function FeaturesSection() {
  const { dict } = useLanguage()
  const t = dict.features

  return (
    <section id="features" className={`section ${styles.section}`} aria-labelledby="features-title">
      <div className="container">
        <SectionHeader id="features-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className={styles.layout}>
          {t.capabilities.map((capability: { title: string; description: string; features: string[] }) => (
            <div key={capability.title} className={styles.capabilityGroup}>
              <div className={styles.groupHeader}>
                <h3 className={styles.groupTitle}>{capability.title}</h3>
                <p className={styles.groupDescription}>{capability.description}</p>
              </div>

              <ul className={styles.featureList}>
                {capability.features.map((feature: string) => (
                  <li key={feature} className={styles.featureItem}>
                    <span className={styles.checkmark} aria-hidden="true">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.integrations}>
          <h3 className={styles.integrationsTitle}>{t.integrationsTitle}</h3>
          <p className={styles.integrationsDescription}>{t.integrationsDescription}</p>
          <div className={styles.integrationsList}>
            {t.integrations.map((integration: string) => (
              <div key={integration} className={styles.integrationBadge}>
                {integration}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
