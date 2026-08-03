'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { UserCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/shared/field-error'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg']

export interface AvatarSectionProps {
  onUpload?: (file: File) => void | Promise<void>
  onRemove?: () => void | Promise<void>
}

export function AvatarSection({ onUpload, onRemove }: AvatarSectionProps) {
  const idPrefix = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>()

  // Revoke the previous object URL whenever it's replaced or the section unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please choose a PNG or JPEG image.')
      event.target.value = ''
      return
    }

    setError(undefined)
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
    await onUpload?.(file)
  }

  async function handleRemove() {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
    setError(undefined)
    if (inputRef.current) inputRef.current.value = ''
    await onRemove?.()
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Profile Picture
        </h2>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile picture preview" className="size-full object-cover" />
            ) : (
              <UserCircle2 className="size-10" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-file`} className="text-sm font-medium">
              Upload New Picture
            </label>
            <input
              ref={inputRef}
              id={`${idPrefix}-file`}
              name="avatar"
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileChange}
              aria-describedby={[`${idPrefix}-hint`, error && `${idPrefix}-error`].filter(Boolean).join(' ')}
              aria-invalid={Boolean(error) || undefined}
              className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground file:transition-colors hover:file:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p id={`${idPrefix}-hint`} className="text-xs text-muted-foreground">
              PNG or JPEG.
            </p>
            <FieldError id={`${idPrefix}-error`} message={error} />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 w-fit"
              disabled={!previewUrl}
              onClick={handleRemove}
            >
              Remove Picture
            </Button>
          </div>
        </div>
      </section>
    </Card>
  )
}
