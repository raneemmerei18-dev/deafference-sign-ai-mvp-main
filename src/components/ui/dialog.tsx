"use client"

import { useEffect, useId, useRef } from "react"
import { cn } from "@/lib/utils"

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={() => onOpenChange(false)}
      className={cn(
        "w-[min(92vw,42rem)] rounded-3xl border border-border bg-background p-0 shadow-2xl backdrop:bg-black/50",
      )}
    >
      <div className="p-6">
        <div className="space-y-2">
          <h2 id={titleId} className="text-xl font-semibold text-foreground">{title}</h2>
          {description ? <p id={descriptionId} className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  )
}
