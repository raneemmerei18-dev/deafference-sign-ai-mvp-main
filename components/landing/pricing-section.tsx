"use client"

import { useLanguage } from "@/components/i18n/language-provider"
import type { ContactTopic } from "@/lib/contact"
import { PLAN_IDS, PLAN_PRICES, RECOMMENDED_PLAN, type PlanId } from "@/lib/site-config"
import { requestContact } from "./contact-intent"
import { CheckIcon } from "./icons"
import { SectionHeader } from "./section-header"
import styles from "./pricing-section.module.css"

// TODO: point "free" at the signup flow once it's rebuilt; until then every
// plan CTA leads to the contact form.
const PLAN_TOPICS: Record<PlanId, ContactTopic> = {
  free: "general",
  basic: "sales",
  premium: "sales",
  enterprise: "sales",
}

export function PricingSection() {
  const { dict } = useLanguage()
  const t = dict.pricing

  return (
    <section id="pricing" className={`section ${styles.section}`} aria-labelledby="pricing-title">
      <div className="container">
        <SectionHeader id="pricing-title" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <ul className={styles.grid}>
          {PLAN_IDS.map((id) => {
            const plan = t.plans[id]
            const price = PLAN_PRICES[id]
            const isRecommended = id === RECOMMENDED_PLAN

            return (
              <li key={id} className={styles.card} data-recommended={isRecommended}>
                {isRecommended ? <p className={styles.badge}>{t.recommended}</p> : null}
                <h3 className={styles.name}>{plan.name}</h3>
                <p className={styles.audience}>{plan.audience}</p>

                <div className={styles.priceBlock}>
                  {price ? (
                    <p className={styles.priceRow}>
                      <span className={styles.price} dir="ltr">
                        {price}
                      </span>
                      <span className={styles.cadence}>{t.perMonth}</span>
                    </p>
                  ) : (
                    <>
                      <p className={styles.priceRow}>
                        <span className={styles.price}>{t.custom}</span>
                      </p>
                      <p className={styles.cadence}>{t.customNote}</p>
                    </>
                  )}
                </div>

                <a
                  href="#contact"
                  className={`btn btn-block ${isRecommended ? "btn-primary" : "btn-secondary"} ${styles.cta}`}
                  onClick={() => requestContact(PLAN_TOPICS[id])}
                >
                  {plan.cta}
                </a>

                <p className={styles.includes}>{t.includes}</p>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <CheckIcon size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>

        <p className={styles.note}>{t.pricesNote}</p>
      </div>
    </section>
  )
}
