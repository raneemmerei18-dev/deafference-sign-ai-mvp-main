export type TextSize = "normal" | "large" | "xlarge"
export type Theme = "light" | "dark" | "system"
export type Density = "comfortable" | "compact"

export type Settings = {
  // Appearance
  theme: Theme
  density: Density
  textSize: TextSize
  // Language & accessibility
  language: string
  signLanguageDialect: string
  highContrast: boolean
  reduceMotion: boolean
  alwaysCaptions: boolean
  textOnly: boolean
  largeButtons: boolean
  sound: boolean
  // Privacy & data
  shareUsageAnalytics: boolean
  shareModelImprovementData: boolean
  sessionHistoryEnabled: boolean
  // Notifications
  notifyProductUpdatesEmail: boolean
  notifySecurityAlertsEmail: boolean
  notifyUsageReportsEmail: boolean
  notifySystemStatusInApp: boolean
  notifyFeatureAnnouncementsInApp: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  density: "comfortable",
  textSize: "normal",
  language: "English",
  signLanguageDialect: "asl",
  highContrast: false,
  reduceMotion: false,
  alwaysCaptions: true,
  textOnly: false,
  largeButtons: false,
  sound: true,
  shareUsageAnalytics: true,
  shareModelImprovementData: true,
  sessionHistoryEnabled: true,
  notifyProductUpdatesEmail: true,
  notifySecurityAlertsEmail: true,
  notifyUsageReportsEmail: false,
  notifySystemStatusInApp: true,
  notifyFeatureAnnouncementsInApp: true,
}

/** Read server-side in `app/layout.tsx` (via `cookies()`) so the first paint already
 *  reflects a saved theme — avoids a flash of the default theme on load. */
export const SETTINGS_COOKIE_NAME = "df-settings"

export function parseSettingsCookie(raw: string | undefined | null): Settings {
  if (!raw) return DEFAULT_SETTINGS
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Settings>
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}
