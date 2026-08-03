'use client'

import { useId, useMemo, useState, type SubmitEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs } from '@/components/ui/tabs'
import { FieldError } from '@/components/shared/field-error'
import { PasswordField } from '@/components/shared/password-field'
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, getPasswordStrength } from '@/lib/validation'
import { cn } from '@/lib/utils'

type AuthMode = 'signin' | 'signup'
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type Provider = 'google' | 'apple'

export interface SignInValues {
  identifier: string
  password: string
}

export interface SignUpValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface AuthFormProps {
  /** Which tab is active on first render. Defaults to "signin" per spec. */
  defaultMode?: AuthMode
  onSignIn?: (values: SignInValues) => void | Promise<void>
  onSignUp?: (values: SignUpValues) => void | Promise<void>
  onFederatedAuth?: (provider: Provider, mode: AuthMode) => void | Promise<void>
}

interface SignInErrors {
  identifier?: string
  password?: string
}

interface SignUpErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.4-1.63 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.94 3.9 14.83 3 12.18 3 6.99 3 2.8 7.14 2.8 12.33s4.19 9.33 9.38 9.33c5.41 0 9-3.8 9-9.15 0-.62-.07-1.09-.16-1.41Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.36 1.43c.1 1.02-.29 2.02-.9 2.75-.63.75-1.66 1.34-2.67 1.26-.12-1 .34-2.04.93-2.72.65-.76 1.78-1.34 2.64-1.29Zm2.7 17.53c-.5 1.14-.98 1.66-1.6 2.53-.86 1.2-2.08 2.7-3.59 2.71-1.34.02-1.68-.87-3.5-.86-1.82.01-2.2.88-3.54.86-1.51-.02-2.66-1.36-3.52-2.56-2.42-3.35-2.68-7.28-1.18-9.38.9-1.27 2.36-2.06 3.71-2.06 1.38 0 2.24.86 3.38.86 1.11 0 1.78-.86 3.38-.86 1.03 0 2.42.48 3.34 1.42-2.98 1.63-2.5 5.87.12 7.34Z"
      />
    </svg>
  )
}

function FederatedButtons({
  mode,
  onFederatedAuth,
}: {
  mode: AuthMode
  onFederatedAuth?: AuthFormProps['onFederatedAuth']
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full justify-center gap-2.5"
        onClick={() => onFederatedAuth?.('google', mode)}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full justify-center gap-2.5"
        onClick={() => onFederatedAuth?.('apple', mode)}
      >
        <AppleIcon />
        Continue with Apple
      </Button>
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-3 text-xs text-muted-foreground"
    >
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span aria-hidden="true" className="uppercase tracking-wide">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  )
}

const initialSignIn: SignInValues = { identifier: '', password: '' }

function SignInForm({
  onSignIn,
  onFederatedAuth,
}: {
  onSignIn?: AuthFormProps['onSignIn']
  onFederatedAuth?: AuthFormProps['onFederatedAuth']
}) {
  const idPrefix = useId()
  const [values, setValues] = useState<SignInValues>(initialSignIn)
  const [errors, setErrors] = useState<SignInErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  function validate(current: SignInValues): SignInErrors {
    const next: SignInErrors = {}
    if (!current.identifier.trim()) next.identifier = 'Enter your email or username.'
    if (!current.password) next.password = 'Enter your password.'
    return next
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await onSignIn?.(values)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FederatedButtons mode="signin" onFederatedAuth={onFederatedAuth} />
      <Divider label="or" />

      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
          <legend className="sr-only">Sign in to your account</legend>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-identifier`} className="text-sm font-medium">
              Email or username
            </label>
            <Input
              id={`${idPrefix}-identifier`}
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={values.identifier}
              onChange={(event) => setValues((v) => ({ ...v, identifier: event.target.value }))}
              aria-invalid={Boolean(errors.identifier) || undefined}
              aria-describedby={errors.identifier ? `${idPrefix}-identifier-error` : undefined}
            />
            <FieldError id={`${idPrefix}-identifier-error`} message={errors.identifier} />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordField
              id={`${idPrefix}-password`}
              autoComplete="current-password"
              value={values.password}
              onChange={(value) => setValues((v) => ({ ...v, password: value }))}
              invalid={Boolean(errors.password)}
              describedBy={errors.password ? `${idPrefix}-password-error` : undefined}
            />
            <FieldError id={`${idPrefix}-password-error`} message={errors.password} />
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full justify-center">
            {status === 'submitting' ? 'Signing in…' : 'Sign In'}
          </Button>

          <p aria-live="polite" className="sr-only">
            {status === 'submitting' && 'Signing in, please wait.'}
            {status === 'success' && 'Signed in successfully.'}
            {status === 'error' && 'Sign in failed. Please try again.'}
          </p>
        </fieldset>
      </form>
    </div>
  )
}

const initialSignUp: SignUpValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
}

function SignUpForm({
  onSignUp,
  onFederatedAuth,
}: {
  onSignUp?: AuthFormProps['onSignUp']
  onFederatedAuth?: AuthFormProps['onFederatedAuth']
}) {
  const idPrefix = useId()
  const [values, setValues] = useState<SignUpValues>(initialSignUp)
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const strength = useMemo(() => getPasswordStrength(values.password), [values.password])

  function validate(current: SignUpValues): SignUpErrors {
    const next: SignUpErrors = {}
    if (!current.fullName.trim()) next.fullName = 'Enter your full name.'
    if (!current.email.trim()) {
      next.email = 'Enter your email address.'
    } else if (!EMAIL_PATTERN.test(current.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!current.password) {
      next.password = 'Create a password.'
    } else if (current.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (!current.confirmPassword) {
      next.confirmPassword = 'Confirm your password.'
    } else if (current.confirmPassword !== current.password) {
      next.confirmPassword = 'Passwords do not match.'
    }
    if (!current.agreeToTerms) {
      next.agreeToTerms = 'You must accept the Terms of Service and Privacy Policy.'
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
      await onSignUp?.(values)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const passwordDescribedBy = [
    `${idPrefix}-password-strength`,
    errors.password && `${idPrefix}-password-error`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-6">
      <FederatedButtons mode="signup" onFederatedAuth={onFederatedAuth} />
      <Divider label="or" />

      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
          <legend className="sr-only">Create a new account</legend>

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
            <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
              Password
            </label>
            <PasswordField
              id={`${idPrefix}-password`}
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              value={values.password}
              onChange={(value) => setValues((v) => ({ ...v, password: value }))}
              invalid={Boolean(errors.password)}
              describedBy={passwordDescribedBy}
            />
            <div className="flex items-center gap-2">
              <meter
                min={0}
                max={4}
                low={2}
                high={3}
                optimum={4}
                value={values.password ? strength.score : 0}
                className="h-1.5 w-full"
                aria-hidden="true"
              />
              <span
                id={`${idPrefix}-password-strength`}
                aria-live="polite"
                className="whitespace-nowrap text-xs text-muted-foreground"
              >
                {values.password ? strength.label : `At least ${MIN_PASSWORD_LENGTH} characters`}
              </span>
            </div>
            <FieldError id={`${idPrefix}-password-error`} message={errors.password} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${idPrefix}-confirm-password`} className="text-sm font-medium">
              Confirm password
            </label>
            <PasswordField
              id={`${idPrefix}-confirm-password`}
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(value) => setValues((v) => ({ ...v, confirmPassword: value }))}
              invalid={Boolean(errors.confirmPassword)}
              describedBy={errors.confirmPassword ? `${idPrefix}-confirm-password-error` : undefined}
            />
            <FieldError id={`${idPrefix}-confirm-password-error`} message={errors.confirmPassword} />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2.5">
              <input
                id={`${idPrefix}-terms`}
                name="agreeToTerms"
                type="checkbox"
                required
                checked={values.agreeToTerms}
                onChange={(event) => setValues((v) => ({ ...v, agreeToTerms: event.target.checked }))}
                aria-invalid={Boolean(errors.agreeToTerms) || undefined}
                aria-describedby={errors.agreeToTerms ? `${idPrefix}-terms-error` : undefined}
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 rounded border-input',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              />
              <label htmlFor={`${idPrefix}-terms`} className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <FieldError id={`${idPrefix}-terms-error`} message={errors.agreeToTerms} />
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full justify-center">
            {status === 'submitting' ? 'Creating account…' : 'Create Account'}
          </Button>

          <p aria-live="polite" className="sr-only">
            {status === 'submitting' && 'Creating account, please wait.'}
            {status === 'success' && 'Account created successfully.'}
            {status === 'error' && 'Account creation failed. Please try again.'}
          </p>
        </fieldset>
      </form>
    </div>
  )
}

export function AuthForm({ defaultMode = 'signin', onSignIn, onSignUp, onFederatedAuth }: AuthFormProps) {
  const tabs = [
    {
      value: 'signin',
      label: 'Sign In',
      content: <SignInForm onSignIn={onSignIn} onFederatedAuth={onFederatedAuth} />,
    },
    {
      value: 'signup',
      label: 'Create Account',
      content: <SignUpForm onSignUp={onSignUp} onFederatedAuth={onFederatedAuth} />,
    },
  ]

  return (
    <Card className="mx-auto w-full max-w-md">
      <Tabs tabs={tabs} defaultValue={defaultMode} label="Authentication mode" />
    </Card>
  )
}
