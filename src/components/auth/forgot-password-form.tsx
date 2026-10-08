"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCard } from "./auth-shell"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/shared/field-error"
import { EMAIL_PATTERN } from "@/lib/validation"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"

type Status = "idle" | "submitting" | "sent" | "error"

export function ForgotPasswordForm() {
  const { t } = useI18n()
  const idPrefix = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<Status>("idle")
  const [formError, setFormError] = useState<string | null>(null)
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) {
      setError(t.auth.validation.emailRequired)
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(t.auth.validation.emailInvalid)
      return
    }
    setError(undefined)
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setStatus("error")
      setFormError(t.common.errors.network)
      return
    }
    setFormError(null)
    setStatus("submitting")
    let res: Response
    try {
      res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch {
      setStatus("error")
      setFormError(t.common.errors.network)
      return
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setStatus("error")
      setFormError(
        res.status === 400
          ? t.auth.validation.emailInvalid
          : res.status === 429
            ? t.auth.errors.rateLimited
            : t.common.errors.generic,
      )
      return
    }
    setDevResetUrl(data.devResetUrl ?? null)
    setStatus("sent")
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">{t.auth.forgot.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.auth.forgot.subtitle}</p>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col gap-4">
            <p role="status" className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground">
              {t.auth.forgot.sentPrefix}{" "}
              <strong dir="ltr" className="break-all">
                {email}
              </strong>
              {t.auth.forgot.sentSuffix}
            </p>
            {devResetUrl ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
                <p className="font-medium text-foreground">{t.auth.forgot.devNotice}</p>
                <Link href={devResetUrl} dir="ltr" className="mt-1 block truncate text-primary underline underline-offset-2">
                  {devResetUrl}
                </Link>
              </div>
            ) : null}
            <Link
              href={APP_ROUTES.login}
              className="inline-flex min-h-10 items-center gap-1.5 self-start rounded text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
              {t.auth.forgot.backToSignin}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <fieldset className="flex flex-col gap-4" disabled={status === "submitting"}>
              <legend className="sr-only">{t.auth.forgot.legend}</legend>

              {status === "error" && formError ? (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium">
                  {t.auth.forgot.emailLabel}
                </label>
                <Input
                  id={`${idPrefix}-email`}
                  name="email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(error) || undefined}
                  aria-describedby={error ? `${idPrefix}-email-error` : undefined}
                />
                <FieldError id={`${idPrefix}-email-error`} message={error} />
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-2 h-11 w-full justify-center text-sm"
                aria-busy={status === "submitting" || undefined}
              >
                {status === "submitting" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {status === "submitting" ? t.auth.forgot.submitting : t.auth.forgot.submit}
              </Button>

              <Link
                href={APP_ROUTES.login}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                {t.auth.forgot.backToSignin}
              </Link>
            </fieldset>
          </form>
        )}
      </div>
    </AuthCard>
  )
}
