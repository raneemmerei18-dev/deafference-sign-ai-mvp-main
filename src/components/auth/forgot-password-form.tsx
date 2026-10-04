"use client"

import { useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthCard } from "./auth-shell"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/shared/field-error"
import { EMAIL_PATTERN } from "@/lib/validation"
import { APP_ROUTES } from "@/lib/constants"

type Status = "idle" | "submitting" | "sent" | "error"

export function ForgotPasswordForm() {
  const idPrefix = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<Status>("idle")
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) {
      setError("Enter your email address.")
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.")
      return
    }
    setError(undefined)
    setStatus("submitting")
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.")
      setDevResetUrl(data.devResetUrl ?? null)
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the email on your account and we'll send you a link to reset your password.
          </p>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col gap-4">
            <p role="status" className="rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
            {devResetUrl ? (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
                <p className="font-medium text-foreground">Dev mode — no email provider is configured:</p>
                <Link href={devResetUrl} className="mt-1 block truncate text-primary underline underline-offset-2">
                  {devResetUrl}
                </Link>
              </div>
            ) : null}
            <Link
              href={APP_ROUTES.login}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <fieldset className="flex flex-col gap-4" disabled={status === "submitting"}>
              <legend className="sr-only">Request a password reset</legend>

              {status === "error" ? (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Something went wrong. Please try again.
                </p>
              ) : null}

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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(error) || undefined}
                  aria-describedby={error ? `${idPrefix}-email-error` : undefined}
                />
                <FieldError id={`${idPrefix}-email-error`} message={error} />
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full justify-center">
                {status === "submitting" ? "Sending…" : "Send reset link"}
              </Button>

              <Link
                href={APP_ROUTES.login}
                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to sign in
              </Link>
            </fieldset>
          </form>
        )}
      </div>
    </AuthCard>
  )
}
