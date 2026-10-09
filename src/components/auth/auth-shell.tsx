"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function GlowOrb({ className, color }: { className?: string; color: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{ background: color }}
    />
  )
}

/**
 * Shared frame for every auth screen (sign in, create account, forgot/reset
 * password). Borrows the landing page's light "pop" theme — icy-blue
 * atmosphere, glass card, soft glow orbs and the real wordmark — so moving
 * from the marketing site into auth feels like the same product.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { t, fmt } = useI18n()
  return (
    <div className="landing-pop pop-atmosphere relative isolate flex min-h-dvh flex-col overflow-hidden text-foreground">
      <div aria-hidden="true" className="pop-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />
      <div aria-hidden="true" className="pop-particles pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <GlowOrb className="pop-float -top-32 -start-24 -z-10 size-[26rem]" color="rgba(59,130,246,0.2)" />
      <GlowOrb className="pop-float-delay top-1/4 -end-32 -z-10 size-[28rem]" color="rgba(167,180,255,0.22)" />
      <GlowOrb className="-bottom-24 start-1/3 -z-10 size-80" color="rgba(255,138,61,0.12)" />

      <header className="flex items-center justify-between gap-3 px-4 pt-5 sm:px-8 sm:pt-6">
        <Link href={APP_ROUTES.home} className={cn("min-w-0 rounded-lg", FOCUS_RING)}>
          <img src="/deafference-wordmark.png" alt={t.auth.shell.homeLogoAlt} className="h-9 w-auto max-w-full object-contain object-left rtl:object-right sm:h-12" />
        </Link>
        <Link
          href={APP_ROUTES.home}
          className={cn(
            "glass-pop group inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm sm:px-4 font-medium text-brand-navy transition-all hover:-translate-y-0.5",
            FOCUS_RING,
          )}
        >
          <ArrowLeft
            className="size-4 transition-transform ltr:group-hover:-translate-x-0.5 rtl:-scale-x-100"
            aria-hidden="true"
          />
          {t.auth.shell.backToHome}
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex w-full max-w-md flex-col items-center gap-4"
        >
          {children}
        </motion.div>
      </div>

      {/* Extra bottom space on mobile so fixed floating actions never cover the form's submit button. */}
      <footer className="px-4 pb-28 text-center text-xs text-muted-foreground sm:pb-6">
        {fmt(t.auth.shell.copyright, { year: new Date().getFullYear() })}
      </footer>
    </div>
  )
}

/** The glass card the auth forms sit in. */
export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass-pop glow-border-pop relative w-full rounded-3xl p-5 shadow-[var(--pop-glow)] sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  )
}
