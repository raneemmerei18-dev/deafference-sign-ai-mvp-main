"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { APP_ROUTES } from "@/lib/constants"
import { AuthForm } from "./auth-form"
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
  const { signIn } = useAuth()
  const router = useRouter()

  function handleAuthenticated() {
    // Mock sign-in/sign-up: a real backend would return the account's actual
    // role. Admin access can't be self-granted here — use the dev role
    // switcher to test the admin path.
    signIn("user")
    router.push(sanitizeRedirect(redirectTo))
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {reason === "auth-required" ? (
        <div
          role="alert"
          className="flex w-full max-w-md items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Please sign in to continue
            {redirectTo ? ` — you'll be returned to ${redirectTo} afterward.` : "."}
          </p>
        </div>
      ) : null}

      <AuthForm defaultMode={defaultMode} onSignIn={handleAuthenticated} onSignUp={handleAuthenticated} />
    </div>
  )
}
