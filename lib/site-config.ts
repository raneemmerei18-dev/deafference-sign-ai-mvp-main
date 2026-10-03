export const CONTACT_EMAILS = {
  general: "hello@deafference.ai",
  partners: "partners@deafference.ai",
  support: "support@deafference.ai",
} as const

export type SocialPlatform = "linkedin" | "instagram" | "x" | "youtube"

export interface SocialLink {
  platform: SocialPlatform
  label: string
  href: string
}

// TODO: fill in the official profile URLs. Entries with an empty href are not
// rendered, so the footer never shows a dead link.
export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "linkedin", label: "LinkedIn", href: "" },
  { platform: "instagram", label: "Instagram", href: "" },
  { platform: "x", label: "X", href: "" },
  { platform: "youtube", label: "YouTube", href: "" },
]

export const PLAN_IDS = ["free", "basic", "premium", "enterprise"] as const
export type PlanId = (typeof PLAN_IDS)[number]

// Monthly price in USD; null means custom-quoted.
export const PLAN_PRICES: Record<PlanId, string | null> = {
  free: "$0",
  basic: "$500",
  premium: "$5,000",
  enterprise: null,
}

export const RECOMMENDED_PLAN: PlanId = "premium"
