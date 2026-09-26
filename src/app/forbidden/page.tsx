import type { Metadata } from "next"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { APP_ROUTES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "403 — Forbidden",
  description: "You don't have permission to access this page.",
}

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <ShieldAlert className="size-10 text-destructive" aria-hidden="true" />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">403 — Forbidden</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Your account doesn&apos;t have permission to view this page. If you believe this is a mistake, contact an
        administrator.
      </p>
      <Link href={APP_ROUTES.home} className={buttonVariants({ size: "lg" })}>
        Return home
      </Link>
    </main>
  )
}
