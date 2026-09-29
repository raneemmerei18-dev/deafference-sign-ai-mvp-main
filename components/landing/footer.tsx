"use client"

import type { ComponentType } from "react"
import { useLanguage } from "@/components/i18n/language-provider"
import { CONTACT_EMAILS, SOCIAL_LINKS, type SocialPlatform } from "@/lib/site-config"
import { requestContact } from "./contact-intent"
import { ArrowUpIcon, InstagramIcon, LinkedInIcon, MailIcon, XIcon, YouTubeIcon } from "./icons"
import { LogoMark } from "./logo"
import styles from "./footer.module.css"

const SOCIAL_ICONS: Record<SocialPlatform, ComponentType<{ size?: number }>> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YouTubeIcon,
}

export function Footer() {
  const { dict } = useLanguage()
  const t = dict.footer
  const socials = SOCIAL_LINKS.filter((link) => link.href)

  const sitemap = [
    {
      title: t.groups.product,
      links: [
        { href: "#demo", label: dict.nav.demo },
        { href: "#pricing", label: dict.nav.pricing },
      ],
    },
    {
      title: t.groups.company,
      links: [
        { href: "#contact", label: dict.nav.contact },
        { href: "#contact", label: dict.nav.bookDemo, onClick: () => requestContact("demo") },
      ],
    },
    {
      title: t.groups.resources,
      links: [{ href: "#accessibility", label: t.accessibilityTitle }],
    },
  ]

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <a href="#top" className={styles.brand} aria-label={dict.nav.home}>
              <LogoMark size={30} />
              <span>Deafference</span>
            </a>
            <p className={styles.tagline}>{t.tagline}</p>

            <h2 className={styles.groupTitle}>{t.connect}</h2>
            <ul className={styles.socialList}>
              {socials.map(({ platform, label, href }) => {
                const Icon = SOCIAL_ICONS[platform]
                return (
                  <li key={platform}>
                    <a href={href} className={styles.socialLink} aria-label={label} target="_blank" rel="noopener noreferrer">
                      <Icon size={18} />
                    </a>
                  </li>
                )
              })}
              <li>
                <a href={`mailto:${CONTACT_EMAILS.general}`} className={styles.emailLink}>
                  <MailIcon size={18} />
                  <bdi>{CONTACT_EMAILS.general}</bdi>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label={t.sitemap} className={styles.sitemap}>
            {sitemap.map((group) => (
              <div key={group.title}>
                <h2 className={styles.groupTitle}>{group.title}</h2>
                <ul className={styles.linkList}>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={styles.link} onClick={link.onClick}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <section id="accessibility" className={styles.statement} aria-labelledby="accessibility-title">
          <h2 id="accessibility-title" className={styles.statementTitle}>
            {t.accessibilityTitle}
          </h2>
          <p>{t.accessibilityBody}</p>
          <p>
            {t.accessibilityContactLead}{" "}
            <a href={`mailto:${CONTACT_EMAILS.general}`}>
              <bdi>{CONTACT_EMAILS.general}</bdi>
            </a>{" "}
            {t.accessibilityContactTail}
          </p>
        </section>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} Deafference. {t.rights}
          </p>
          <a href="#top" className={styles.backToTop}>
            <ArrowUpIcon size={16} />
            {t.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
