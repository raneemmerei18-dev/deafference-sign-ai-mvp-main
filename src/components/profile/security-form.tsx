'use client'

import { useId, useMemo, useState, type SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError } from '@/components/shared/field-error'
import { PasswordField } from '@/components/shared/password-field'
import { MIN_PASSWORD_LENGTH, getPasswordStrength } from '@/lib/validation'

export interface PasswordChangeValues {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface SecurityFormProps {
  onUpdatePassword?: (values: PasswordChangeValues) => void | Promise<void>
}

interface PasswordChangeErrors {
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const initialValues: PasswordChangeValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function SecurityForm({ onUpdatePassword }: SecurityFormProps) {
  const idPrefix = useId()
  const [values, setValues] = useState<PasswordChangeValues>(initialValues)
  const [errors, setErrors] = useState<PasswordChangeErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const strength = useMemo(() => getPasswordStrength(values.newPassword), [values.newPassword])

  function validate(current: PasswordChangeValues): PasswordChangeErrors {
    const next: PasswordChangeErrors = {}
    if (!current.currentPassword) next.currentPassword = 'Enter your current password.'
    if (!current.newPassword) {
      next.newPassword = 'Create a new password.'
    } else if (current.newPassword.length < MIN_PASSWORD_LENGTH) {
      next.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (!current.confirmNewPassword) {
      next.confirmNewPassword = 'Confirm your new password.'
    } else if (current.confirmNewPassword !== current.newPassword) {
      next.confirmNewPassword = 'Passwords do not match.'
    }
    return next
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await onUpdatePassword?.(values)
      setStatus('success')
      setValues(initialValues)
    } catch {
      setStatus('error')
    }
  }

  const passwordDescribedBy = [`${idPrefix}-strength`, errors.newPassword && `${idPrefix}-new-error`]
    .filter(Boolean)
    .join(' ')

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Security
        </h2>

        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
            <legend className="sr-only">Update your password</legend>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-current`} className="text-sm font-medium">
                Current password
              </label>
              <PasswordField
                id={`${idPrefix}-current`}
                autoComplete="current-password"
                value={values.currentPassword}
                onChange={(value) => setValues((v) => ({ ...v, currentPassword: value }))}
                invalid={Boolean(errors.currentPassword)}
                describedBy={errors.currentPassword ? `${idPrefix}-current-error` : undefined}
              />
              <FieldError id={`${idPrefix}-current-error`} message={errors.currentPassword} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-new`} className="text-sm font-medium">
                New password
              </label>
              <PasswordField
                id={`${idPrefix}-new`}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={values.newPassword}
                onChange={(value) => setValues((v) => ({ ...v, newPassword: value }))}
                invalid={Boolean(errors.newPassword)}
                describedBy={passwordDescribedBy}
              />
              <div className="flex items-center gap-2">
                <meter
                  min={0}
                  max={4}
                  low={2}
                  high={3}
                  optimum={4}
                  value={values.newPassword ? strength.score : 0}
                  className="h-1.5 w-full"
                  aria-hidden="true"
                />
                <span
                  id={`${idPrefix}-strength`}
                  aria-live="polite"
                  className="whitespace-nowrap text-xs text-muted-foreground"
                >
                  {values.newPassword ? strength.label : `At least ${MIN_PASSWORD_LENGTH} characters`}
                </span>
              </div>
              <FieldError id={`${idPrefix}-new-error`} message={errors.newPassword} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-confirm`} className="text-sm font-medium">
                Confirm new password
              </label>
              <PasswordField
                id={`${idPrefix}-confirm`}
                autoComplete="new-password"
                value={values.confirmNewPassword}
                onChange={(value) => setValues((v) => ({ ...v, confirmNewPassword: value }))}
                invalid={Boolean(errors.confirmNewPassword)}
                describedBy={errors.confirmNewPassword ? `${idPrefix}-confirm-error` : undefined}
              />
              <FieldError id={`${idPrefix}-confirm-error`} message={errors.confirmNewPassword} />
            </div>

            <Button type="submit" className="mt-2 w-fit">
              {status === 'submitting' ? 'Updating…' : 'Update Password'}
            </Button>

            <p aria-live="polite" className="sr-only">
              {status === 'submitting' && 'Updating password, please wait.'}
              {status === 'success' && 'Password updated successfully.'}
              {status === 'error' && 'Could not update password. Please try again.'}
            </p>
          </fieldset>
        </form>
      </section>
    </Card>
  )
}
