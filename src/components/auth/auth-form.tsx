'use client'

import { useId, useMemo, useRef, useState, type KeyboardEvent, type SubmitEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/shared/field-error'
import { PasswordField } from '@/components/shared/password-field'
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, getPasswordStrength } from '@/lib/validation'
import { cn } from '@/lib/utils'
import { AuthCard } from './auth-shell'

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

const PRIMARY_BUTTON_CLASS =
  'mt-2 h-12 w-full justify-center rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-base font-bold text-white shadow-[0_18px_36px_-14px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-14px_rgba(37,99,235,0.65)]'

const SOCIAL_BUTTON_CLASS =
  'h-12 w-full justify-center gap-2.5 sm:flex-1 rounded-xl text-sm font-semibold shadow-sm hover:-translate-y-0.5'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
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
  // UI only for now: the buttons are live and styled, but no OAuth provider
  // is wired up yet — clicks only reach a handler if one is passed in.
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn(SOCIAL_BUTTON_CLASS, 'border-border bg-white text-[#1f1f1f] hover:bg-white hover:border-[#3B82F6]/40')}
        onClick={() => onFederatedAuth?.('google', mode)}
      >
        <GoogleIcon />
        Google
      </Button>
      <Button
        type="button"
        size="lg"
        className={cn(SOCIAL_BUTTON_CLASS, 'bg-black text-white hover:bg-black/85')}
        onClick={() => onFederatedAuth?.('apple', mode)}
      >
        <AppleIcon />
        Apple
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
      <span aria-hidden="true">{label}</span>
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
  const [formError, setFormError] = useState<string | null>(null)

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

    setFormError(null)
    setStatus('submitting')
    try {
      await onSignIn?.(values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setFormError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FederatedButtons mode="signin" onFederatedAuth={onFederatedAuth} />
      <Divider label="or continue with email" />

      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
          <legend className="sr-only">Sign in to your account</legend>

          {formError ? (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          ) : null}

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

          <Button type="submit" size="lg" className={PRIMARY_BUTTON_CLASS}>
            {status === 'submitting' ? 'Signing in…' : 'Sign In'}
          </Button>

          <p aria-live="polite" className="sr-only">
            {status === 'submitting' && 'Signing in, please wait.'}
            {status === 'success' && 'Signed in successfully.'}
            {status === 'error' && (formError ?? 'Sign in failed. Please try again.')}
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
  const [formError, setFormError] = useState<string | null>(null)

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

    setFormError(null)
    setStatus('submitting')
    try {
      await onSignUp?.(values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setFormError(err instanceof Error ? err.message : 'Account creation failed. Please try again.')
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
      <Divider label="or continue with email" />

      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-4" disabled={status === 'submitting'}>
          <legend className="sr-only">Create a new account</legend>

          {formError ? (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          ) : null}

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
                  'mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-[#3B82F6]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              />
              <label htmlFor={`${idPrefix}-terms`} className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/#privacy" className="font-medium text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <FieldError id={`${idPrefix}-terms-error`} message={errors.agreeToTerms} />
          </div>

          <Button type="submit" size="lg" className={PRIMARY_BUTTON_CLASS}>
            {status === 'submitting' ? 'Creating account…' : 'Create Account'}
          </Button>

          <p aria-live="polite" className="sr-only">
            {status === 'submitting' && 'Creating account, please wait.'}
            {status === 'success' && 'Account created successfully.'}
            {status === 'error' && (formError ?? 'Account creation failed. Please try again.')}
          </p>
        </fieldset>
      </form>
    </div>
  )
}

const MODE_COPY: Record<AuthMode, { tab: string; title: string; subtitle: string }> = {
  signin: {
    tab: 'Sign In',
    title: 'Welcome back',
    subtitle: 'Sign in to keep translating, right where you left off.',
  },
  signup: {
    tab: 'Create Account',
    title: 'Create your account',
    subtitle: 'Join Deafference and start communicating without barriers.',
  },
}

const MODES: AuthMode[] = ['signin', 'signup']

export function AuthForm({ defaultMode = 'signin', onSignIn, onSignUp, onFederatedAuth }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const baseId = useId()
  const tabRefs = useRef<Record<AuthMode, HTMLButtonElement | null>>({ signin: null, signup: null })
  const copy = MODE_COPY[mode]

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next: AuthMode =
      event.key === 'Home' ? 'signin' : event.key === 'End' ? 'signup' : mode === 'signin' ? 'signup' : 'signin'
    setMode(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <AuthCard>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div
        role="tablist"
        aria-label="Authentication mode"
        className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-border bg-[color:var(--primary)]/[0.06] p-1"
      >
        {MODES.map((value) => {
          const selected = value === mode
          return (
            <button
              key={value}
              ref={(node) => {
                tabRefs.current[value] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setMode(value)}
              onKeyDown={handleTabKeyDown}
              className={cn(
                'relative rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors',
                selected ? 'text-white' : 'text-muted-foreground hover:text-brand-navy',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${baseId}-tab-indicator`}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] shadow-[0_10px_24px_-10px_rgba(37,99,235,0.6)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{MODE_COPY[value].tab}</span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${mode}`}>
        {mode === 'signin' ? (
          <SignInForm onSignIn={onSignIn} onFederatedAuth={onFederatedAuth} />
        ) : (
          <SignUpForm onSignUp={onSignUp} onFederatedAuth={onFederatedAuth} />
        )}
      </div>
    </AuthCard>
  )
}
