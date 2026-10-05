"use client"

import { TranslationProvider } from "@/components/translation/translation-context"
import { HistoryProvider } from "@/components/translation/history-context"
import { TranslationNav } from "@/components/translation/translation-nav"
import styles from "./layout.module.css"

export function TranslateWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <HistoryProvider>
        <div className={styles.translateWrapper}>
          <TranslationNav />
          <div className={styles.content}>{children}</div>
        </div>
      </HistoryProvider>
    </TranslationProvider>
  )
}
