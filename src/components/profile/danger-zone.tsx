'use client'

import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'

export interface DangerZoneProps {
  onSignOut?: () => void | Promise<void>
  onDeleteAccount?: () => void | Promise<void>
}

type DeleteStatus = 'idle' | 'submitting' | 'error'

export function DangerZone({ onSignOut, onDeleteAccount }: DangerZoneProps) {
  const idPrefix = useId()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [status, setStatus] = useState<DeleteStatus>('idle')

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      setConfirmed(false)
      setStatus('idle')
    }
  }

  async function handleConfirmDelete() {
    setStatus('submitting')
    try {
      await onDeleteAccount?.()
      handleDialogOpenChange(false)
    } catch {
      setStatus('error')
    }
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Account Actions
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-sm font-medium text-foreground">Sign out</p>
            <p className="text-sm text-muted-foreground">End your current session on this device.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => onSignOut?.()}>
            Sign Out
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-destructive">Delete account</p>
            <p className="text-sm text-muted-foreground">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <Button type="button" variant="destructive" onClick={() => setDialogOpen(true)}>
            Delete Account
          </Button>
        </div>
      </section>

      <Dialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        title="Delete your account?"
        description="This action is permanent and cannot be undone. All of your profile data will be removed."
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2.5">
            <input
              id={`${idPrefix}-confirm-delete`}
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <label htmlFor={`${idPrefix}-confirm-delete`} className="text-sm">
              I understand this action is permanent and cannot be undone.
            </label>
          </div>

          {status === 'error' && (
            <p role="alert" className="text-sm font-medium text-destructive">
              Could not delete your account. Please try again.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!confirmed || status === 'submitting'}
              onClick={handleConfirmDelete}
            >
              {status === 'submitting' ? 'Deleting…' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  )
}
