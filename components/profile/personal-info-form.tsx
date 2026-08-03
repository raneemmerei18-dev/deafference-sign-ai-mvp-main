'use client'

import { useId, useState, type SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/shared/field-error'
import { EMAIL_PATTERN } from '@/lib/validation'

const SIGN_LANGUAGE_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: 'asl', label: 'American Sign Language (ASL)' },
  { value: 'bsl', label: 'British Sign Language (BSL)' },
  { value: 'lsf', label: 'Langue des signes française (LSF)' },
  { value: 'dgs', label: 'Deutsche Gebärdensprache (DGS)' },
  { value: 'other', label: 'Other' },
] as const

export interface PersonalInfoValues {
  fullName: string
  email: string
  signLanguage: string
}

export interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfoValues>
  onSave?: (values: PersonalInfoValues) => void | Promise<void>
}

interface PersonalInfoErrors {
  fullName?: string
  email?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export function PersonalInfoForm({ defaultValues, onSave }: PersonalInfoFormProps) {
  const idPrefix = useId()
  const [values, setValues] = useState<PersonalInfoValues>({
    fullName: defaultValues?.fullName ?? '',
    email: defaultValues?.email ?? '',
    signLanguage: defaultValues?.signLanguage ?? '',
  })
  const [errors, setErrors] = useState<PersonalInfoErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  function validate(current: PersonalInfoValues): PersonalInfoErrors {
    const next: PersonalInfoErrors = {}
    if (!current.fullName.trim()) next.fullName = 'Enter your full name.'
    if (!current.email.trim()) {
      next.email = 'Enter your email address.'
    } else if (!EMAIL_PATTERN.test(current.email)) {
      next.email = 'Enter a valid email address.'
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
      await onSave?.(values)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
          Personal Information
        </h2>

        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
            <legend className="sr-only">Edit personal information</legend>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
                Full name
              </label>
              <Input
                id={`${idPrefix}-name`}
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={values.fullName}
                onChange={(event) => setValues((v) => ({ ...v, fullName: event.target.value }))}
                aria-invalid={Boolean(errors.fullName) || undefined}
                aria-describedby={errors.fullName ? `${idPrefix}-name-error` : undefined}
              />
              <FieldError id={`${idPrefix}-name-error`} message={errors.fullName} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium">
                Email address
              </label>
              <Input
                id={`${idPrefix}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={(event) => setValues((v) => ({ ...v, email: event.target.value }))}
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
              />
              <FieldError id={`${idPrefix}-email-error`} message={errors.email} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-sign-language`} className="text-sm font-medium">
                Preferred sign language
              </label>
              <select
                id={`${idPrefix}-sign-language`}
                name="signLanguage"
                value={values.signLanguage}
                onChange={(event) => setValues((v) => ({ ...v, signLanguage: event.target.value }))}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                {SIGN_LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="mt-2 w-fit">
              {status === 'submitting' ? 'Saving…' : 'Save Changes'}
            </Button>

            <p aria-live="polite" className="sr-only">
              {status === 'submitting' && 'Saving changes, please wait.'}
              {status === 'success' && 'Changes saved successfully.'}
              {status === 'error' && 'Could not save changes. Please try again.'}
            </p>
          </fieldset>
        </form>
      </section>
    </Card>
  )
}
