import { APP_ROUTES } from "@/lib/constants"
import type { LandingMessages } from "@/i18n/messages/landing"

type NavKey = keyof LandingMessages["nav"]["links"]

/** Maps the shared LANDING_NAV / FOOTER_*_NAV hrefs (lib/constants, read-only) onto translated labels. */
const HREF_TO_KEY: Record<string, NavKey> = {
  "#how-it-works": "howItWorks",
  [APP_ROUTES.scenarios]: "forYou",
  "#scenarios": "forYou",
  "#why-choose-us": "forOrganisations",
  "#faq": "resources",
  "#pricing": "pricing",
  "#features": "features",
  "#about": "about",
  "#contact": "contact",
  [APP_ROUTES.translate]: "translate",
  "#demo": "demo",
  "#privacy": "privacy",
}

/**
 * /scenarios has no page; the Scenarios section on the landing page is the destination.
 * Off the landing page (e.g. /terms reuses the navbar/footer), in-page anchors point back to "/".
 */
export function resolveLandingHref(href: string, pathname: string | null) {
  const target = href === APP_ROUTES.scenarios ? "#scenarios" : href
  if (target.startsWith("#") && pathname && pathname !== "/") return `/${target}`
  return target
}

export function navLabel(links: LandingMessages["nav"]["links"], href: string, fallback: string) {
  const key = HREF_TO_KEY[href]
  return key ? links[key] : fallback
}
