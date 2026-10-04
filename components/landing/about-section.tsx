"use client"

import { useLanguage } from "@/components/i18n/language-provider"
import { SectionHeader } from "./section-header"
import styles from "./about-section.module.css"

export function AboutSection() {
  const { dict } = useLanguage()
  const t = dict.about

  return (
    <section id="about" className={`section ${styles.section}`} aria-labelledby="about-title">
      <div className="container">
        <SectionHeader id="about-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className={styles.layout}>
          <div className={styles.narrative}>
            <h3 className={styles.missionTitle}>{t.missionTitle}</h3>
            <p className={styles.missionText}>{t.missionText}</p>

            <div className={styles.story}>
              <h4 className={styles.storyTitle}>{t.storyTitle}</h4>
              <p className={styles.storyText}>{t.storyText}</p>
            </div>

            <div className={styles.values}>
              <h4 className={styles.valuesTitle}>{t.valuesTitle}</h4>
              <ul className={styles.valuesList}>
                {t.values.map((value: string) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.team}>
            <h3 className={styles.teamTitle}>{t.teamTitle}</h3>
            <p className={styles.teamDescription}>{t.teamDescription}</p>

            <div className={styles.teamGrid}>
              {t.teamMembers.map((member: { name: string; role: string }) => (
                <div key={member.name} className={styles.teamCard}>
                  <div className={styles.avatar} aria-hidden="true" />
                  <h4 className={styles.memberName}>{member.name}</h4>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              ))}
            </div>

            <p className={styles.teamNote}>{t.teamNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
