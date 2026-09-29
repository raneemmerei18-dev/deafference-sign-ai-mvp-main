import type { Metadata, Viewport } from "next"
import { cookies, headers } from "next/headers"
import type { ReactNode } from "react"
import { LanguageProvider } from "@/components/i18n/language-provider"
import { DEFAULT_LOCALE, dictionaries, dirFor, LOCALE_COOKIE, parseLocale, type Locale } from "@/lib/i18n/dictionaries"
import "./globals.css"

async function getLocale(): Promise<Locale> {
  const fromCookie = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value)
  if (fromCookie) return fromCookie

  // First visit: honour the browser's preference before the visitor picks one.
  const acceptLanguage = (await headers()).get("accept-language") ?? ""
  return acceptLanguage.trim().toLowerCase().startsWith("ar") ? "ar" : DEFAULT_LOCALE
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = dictionaries[await getLocale()]
  return { title: meta.title, description: meta.description }
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#faf8f4",
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale()

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  )
}
