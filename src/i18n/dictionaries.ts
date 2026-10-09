import type { Locale } from "./locale"
import { common } from "./messages/common"
import { landing } from "./messages/landing"
import { auth } from "./messages/auth"
import { app } from "./messages/app"
import { profile } from "./messages/profile"
import { settings } from "./messages/settings"
import { studio } from "./messages/studio"

function build(locale: Locale) {
  return {
    common: common[locale],
    landing: landing[locale],
    auth: auth[locale],
    app: app[locale],
    profile: profile[locale],
    settings: settings[locale],
    studio: studio[locale],
  }
}

export type Messages = ReturnType<typeof build>

export const dictionaries: Record<Locale, Messages> = { en: build("en"), ar: build("ar") }
