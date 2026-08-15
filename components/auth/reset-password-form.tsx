"use client"

import { useId, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FieldError } from "@/components/shared/field-error"
import { PasswordField } from "@/components/shared/password-field"
import { MIN_PASSWORD_LENGTH, getPasswordStrength } from "@/lib/validation"
import { APP_ROUTES } from "@/lib/constants"

type Status = "idle" | "submitting" | "success" | "error"

export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const idPrefix = useId()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [status, setStatus] = useState<Status>("idle")
  const [formError, setFormError] = useState<string | null>(null)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!password) nextErrors.password = "Create a new password."
    else if (password.length < MIN_PASSWORD_LENGTH) nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setFormError(null)
    setStatus("submitting")
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.")
      setStatus("success")
      setTimeout(() => router.push(APP_ROUTES.login), 1800)
    } catch (err) {
      setStatus("error")
      setFormError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (!token) {
    return (
      <Card className="mx-auto w-full max-w-md border-border/60 p-7 shadow-xl shadow-black/[0.03] sm:p-8">
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          This reset link is missing its token. Request a new one from the sign-in page.
        </p>
        <Link href={APP_ROUTES.login} className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </Card>
    )
  }

  if (status === "success") {
    return (
      <Card className="mx-auto w-full max-w-md border-border/60 p-7 text-center shadow-xl shadow-black/[0.03] sm:p-8">
        <CheckCircle2 className="mx-auto size-8 text-primary" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-foreground">Password updated. Redirecting to sign in…</p>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-md border-border/60 p-7 shadow-xl shadow-black/[0.03] sm:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Choose a new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Make it something you haven't used before.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-4" disabled={status === "submitting"}>
            <legend className="sr-only">Reset password</legend>

            {formError ? (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-password`} className="text-sm font-medium">
                New password
              </label>
              <PasswordField
                id={`${idPrefix}-password`}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={setPassword}
                invalid={Boolean(errors.password)}
                describedBy={errors.password ? `${idPrefix}-password-error` : undefined}
              />
              <div className="flex items-center gap-2">
                <meter min={0} max={4} low={2} high={3} optimum={4} value={password ? strength.score : 0} className="h-1.5 w-full" aria-hidden="true" />
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {password ? strength.label : `At least ${MIN_PASSWORD_LENGTH} characters`}
                </span>
              </div>
              <FieldError id={`${idPrefix}-password-error`} message={errors.password} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${idPrefix}-confirm`} className="text-sm font-medium">
                Confirm new password
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

            <Button type="submit" size="lg" className="mt-2 w-full justify-center">
              {status === "submitting" ? "Updating…" : "Update password"}
            </Button>
          </fieldset>
        </form>
      </div>
    </Card>
  )
}
