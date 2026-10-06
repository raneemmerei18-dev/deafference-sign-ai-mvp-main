"use client"

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCard } from "./auth-shell"
import { FieldError } from "@/components/shared/field-error"
import { PasswordField } from "@/components/shared/password-field"
import { MIN_PASSWORD_LENGTH, getPasswordStrength } from "@/lib/validation"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"

type Status = "idle" | "submitting" | "success" | "error"

const FORM_ERROR_CLASS = "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
const BACK_LINK_CLASS =
  "inline-flex min-h-10 items-center rounded text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const { t, fmt } = useI18n()
  const idPrefix = useId()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [status, setStatus] = useState<Status>("idle")
  const [formError, setFormError] = useState<string | null>(null)
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (redirectTimer.current) clearTimeout(redirectTimer.current)
  }, [])

  const strength = useMemo(() => getPasswordStrength(password), [password])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const v = t.auth.validation
    const nextErrors: typeof errors = {}
    if (!password) nextErrors.password = v.passwordNew
    else if (password.length < MIN_PASSWORD_LENGTH) nextErrors.password = fmt(v.passwordMin, { min: MIN_PASSWORD_LENGTH })
    if (!confirmPassword) nextErrors.confirmPassword = v.confirmRequired
    else if (confirmPassword !== password) nextErrors.confirmPassword = v.passwordsMismatch
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setFormError(null)
    setStatus("submitting")
    let res: Response
    try {
      res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
    } catch {
      setStatus("error")
      setFormError(t.common.errors.network)
      return
    }
    await res.json().catch(() => ({}))
    if (!res.ok) {
      setStatus("error")
      // 400 = invalid/expired token (password length is validated above).
      setFormError(res.status === 400 ? t.auth.errors.resetLinkInvalid : t.common.errors.generic)
      return
    }
    setStatus("success")
    redirectTimer.current = setTimeout(() => router.push(APP_ROUTES.login), 1800)
  }

  if (!token) {
    return (
      <AuthCard>
        <p role="alert" className={FORM_ERROR_CLASS}>
          {t.auth.reset.missingToken}
        </p>
        <Link href={APP_ROUTES.login} className={`mt-4 ${BACK_LINK_CLASS}`}>
          {t.auth.reset.backToSignin}
        </Link>
      </AuthCard>
    )
  }

  if (status === "success") {
    return (
      <AuthCard className="text-center">
        <CheckCircle2 className="mx-auto size-8 text-primary" aria-hidden="true" />
        <p role="status" className="mt-3 text-sm font-medium text-foreground">
          {t.auth.reset.success}
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">{t.auth.reset.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.auth.reset.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="flex flex-col gap-4" disabled={status === "submitting"}>
            <legend className="sr-only">{t.auth.reset.legend}</legend>

            {formError ? (
              <div role="alert" className={FORM_ERROR_CLASS}>
                <p>{formError}</p>
                {status === "error" && formError === t.auth.errors.resetLinkInvalid ? (
                  <Link href="/forgot-password" className="mt-1 inline-block font-medium underline underline-offset-2">
                    {t.auth.forgot.submit}
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
                {t.auth.reset.passwordLabel}
              </label>
              <PasswordField
                id={`${idPrefix}-password`}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={setPassword}
                invalid={Boolean(errors.password)}
                describedBy={[`${idPrefix}-password-strength`, errors.password && `${idPrefix}-password-error`]
                  .filter(Boolean)
                  .join(" ")}
              />
              <div className="flex items-center gap-2">
                <meter min={0} max={4} low={2} high={3} optimum={4} value={password ? strength.score : 0} className="h-1.5 w-full" aria-hidden="true" />
                <span id={`${idPrefix}-password-strength`} aria-live="polite" className="whitespace-nowrap text-xs text-muted-foreground">
                  {password ? t.auth.password.strength[strength.score] : fmt(t.auth.password.hint, { min: MIN_PASSWORD_LENGTH })}
                </span>
              </div>
              <FieldError id={`${idPrefix}-password-error`} message={errors.password} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-confirm`} className="text-sm font-medium">
                {t.auth.reset.confirmLabel}
              </label>
              <PasswordField
                id={`${idPrefix}-confirm`}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                invalid={Boolean(errors.confirmPassword)}
                describedBy={errors.confirmPassword ? `${idPrefix}-confirm-error` : undefined}
              />
              <FieldError id={`${idPrefix}-confirm-error`} message={errors.confirmPassword} />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-2 h-11 w-full justify-center text-sm"
              aria-busy={status === "submitting" || undefined}
            >
              {status === "submitting" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {status === "submitting" ? t.auth.reset.submitting : t.auth.reset.submit}
            </Button>
          </fieldset>
        </form>
      </div>
    </AuthCard>
  )
}
