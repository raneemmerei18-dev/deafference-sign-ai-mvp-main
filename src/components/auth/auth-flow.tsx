"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { APP_ROUTES } from "@/lib/constants"
import { AuthShell } from "./auth-shell"
import { AuthForm, type SignInValues, type SignUpValues } from "./auth-form"
import { useAuth } from "./auth-provider"

/** Only allow same-origin, path-relative redirects — never forward to an absolute or protocol-relative URL. */
function sanitizeRedirect(redirectTo: string | undefined) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) return APP_ROUTES.home
  return redirectTo
}

export function AuthFlow({
  defaultMode,
  redirectTo,
  reason,
}: {
  defaultMode?: "signin" | "signup"
  redirectTo?: string
  reason?: string
}) {
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  async function handleSignIn(values: SignInValues) {
    await signIn(values)
    router.push(sanitizeRedirect(redirectTo))
  }

  async function handleSignUp(values: SignUpValues) {
    await signUp(values)
    router.push(sanitizeRedirect(redirectTo))
  }

  return (
    <AuthShell>
      {reason === "auth-required" ? (
        <div
          role="alert"
          className="flex w-full items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Please sign in to continue
            {redirectTo ? ` — you'll be returned to ${redirectTo} afterward.` : "."}
          </p>
        </div>
      ) : null}

      <AuthForm defaultMode={defaultMode} onSignIn={handleSignIn} onSignUp={handleSignUp} />
    </AuthShell>
  )
}
