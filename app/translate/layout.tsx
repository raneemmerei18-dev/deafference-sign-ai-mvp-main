"use client"

import { TranslationProvider } from "@/components/translation/translation-context"
import { TranslationNav } from "@/components/translation/translation-nav"
import styles from "./layout.module.css"

export default function TranslateLayout({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <div className={styles.translateWrapper}>
        <TranslationNav />
        <div className={styles.content}>{children}</div>
      </div>
    </TranslationProvider>
  )
}
