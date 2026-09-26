"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { APP_ROUTES } from "@/lib/constants"
import { AuthBrandPanel } from "./auth-brand-panel"
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
    <div className="grid min-h-dvh w-full lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex flex-col items-center justify-center gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href={APP_ROUTES.home}
          className="flex items-center gap-2 rounded-lg text-lg font-bold tracking-tight text-foreground lg:hidden"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-xl bg-brand-orange text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="11" width="2.2" height="7" rx="1.1" fill="white" fillOpacity="0.7" />
              <rect x="7.5" y="7" width="2.2" height="14" rx="1.1" fill="white" fillOpacity="0.85" />
              <rect x="11" y="4" width="2.2" height="20" rx="1.1" fill="white" />
            </svg>
          </span>
          Deafference
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex w-full flex-col items-center gap-4"
        >
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

          <AuthForm defaultMode={defaultMode} onSignIn={handleSignIn} onSignUp={handleSignUp} />
        </motion.div>
      </div>
    </div>
  )
}
