"use client"

import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { useI18n } from "@/i18n/use-i18n"
import { useAuth } from "./auth-provider"

/**
 * "Are you sure you want to log out?" confirmation. Every logout trigger opens this
 * instead of calling `signOut()` directly; the underlying signOut logic is unchanged.
 */
export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onSignedOut,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Runs after a successful sign-out (e.g. navigate home). */
  onSignedOut?: () => void
}) {
  const { signOut } = useAuth()
  const { t } = useI18n()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (pending) return
    if (!next) setError(null)
    onOpenChange(next)
  }

  async function handleConfirm() {
    setPending(true)
    setError(null)
    try {
      await signOut()
      onOpenChange(false)
      onSignedOut?.()
    } catch {
      setError(t.common.logout.error)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t.common.logout.title}
      description={t.common.logout.description}
    >
      {error ? (
        <p role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="h-11 px-4" onClick={() => handleOpenChange(false)} disabled={pending} autoFocus>
          {t.common.logout.cancel}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="h-11 px-4"
          onClick={handleConfirm}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />}
          {pending ? t.common.logout.pending : t.common.logout.confirm}
        </Button>
      </div>
    </Dialog>
  )
}
