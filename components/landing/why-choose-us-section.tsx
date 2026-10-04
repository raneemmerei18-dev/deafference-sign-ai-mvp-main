"use client"

import { useLanguage } from "@/components/i18n/language-provider"
import { WifiOffIcon, ShieldIcon, LanguagesIcon, SmileIcon } from "./icons"
import { SectionHeader } from "./section-header"
import styles from "./why-choose-us-section.module.css"

const FEATURE_ICONS = {
  realtime: WifiOffIcon,
  offline: WifiOffIcon,
  deaf: SmileIcon,
  accessible: ShieldIcon,
}

export function WhyChooseUsSection() {
  const { dict } = useLanguage()
  const t = dict.whyChooseUs

  return (
    <section id="why" className={`section ${styles.section}`} aria-labelledby="why-title">
      <div className="container">
        <SectionHeader id="why-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className={styles.grid}>
          {t.features.map((feature: { id: string; title: string; description: string }) => {
            const Icon = FEATURE_ICONS[feature.id as keyof typeof FEATURE_ICONS]

            return (
              <div key={feature.id} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon size={32} />
                </div>
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.description}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
