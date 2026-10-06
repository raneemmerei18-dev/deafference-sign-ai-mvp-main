export type Locale = "en" | "ar"
export type Direction = "ltr" | "rtl"

/** Value stored in `settings.language` (see LANGUAGES in language-selector) that switches the UI to Arabic. */
export const ARABIC_LANGUAGE = "العربية"
export const ENGLISH_LANGUAGE = "English"

/** Maps the existing `settings.language` value onto a supported UI locale. Untranslated languages fall back to English. */
export function localeFromLanguage(language: string | undefined | null): Locale {
  return language === ARABIC_LANGUAGE ? "ar" : "en"
}

export function dirFor(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

/** Routes that stay English/LTR regardless of the selected language (super-admin dashboard is out of i18n scope). */
export function isLocaleExemptPath(pathname: string | null | undefined) {
  return !!pathname && (pathname === "/admin" || pathname.startsWith("/admin/"))
}

/** Replaces `{name}` placeholders in a message. */
export function fmt(message: string, vars: Record<string, string | number>) {
  return message.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match))
}
