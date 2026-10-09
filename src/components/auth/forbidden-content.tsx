"use client"

import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

export function ForbiddenContent() {
  const { t } = useI18n()
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 pb-24 text-center sm:pb-0">
      <ShieldAlert className="size-10 text-destructive" aria-hidden="true" />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t.auth.forbidden.title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t.auth.forbidden.description}</p>
      <Link href={APP_ROUTES.home} className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
        {t.auth.forbidden.returnHome}
      </Link>
    </main>
  )
}
