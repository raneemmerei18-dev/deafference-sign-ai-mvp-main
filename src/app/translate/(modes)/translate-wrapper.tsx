"use client"

import { LanguageProvider } from "@/components/i18n/language-provider"
import { TranslationProvider } from "@/components/translation/translation-context"
import { HistoryProvider } from "@/components/translation/history-context"
import { TranslationNav } from "@/components/translation/translation-nav"
import { useI18n } from "@/i18n/use-i18n"
import styles from "./layout.module.css"

export function TranslateWrapper({ children }: { children: React.ReactNode }) {
  // These pages read their copy from the root lib/i18n dictionaries via useLanguage();
  // feed that provider the app's own language setting (remount on change to pick it up).
  const { locale } = useI18n()
  return (
    <LanguageProvider key={locale} initialLocale={locale}>
      <TranslationProvider>
        <HistoryProvider>
          <div className={styles.translateWrapper}>
            <TranslationNav />
            <div className={styles.content}>{children}</div>
          </div>
        </HistoryProvider>
      </TranslationProvider>
    </LanguageProvider>
  )
}
