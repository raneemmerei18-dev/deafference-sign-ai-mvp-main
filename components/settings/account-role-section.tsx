"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { ShieldCheck, User as UserIcon, LogOut, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"

function initialsFor(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

/**
 * Account identity + role. The user's role comes straight from the signed
 * session (issued server-side by /api/auth/*), so this panel — and the
 * admin-only block inside it — reflects real, dynamic access, not a mock.
 */
export function AccountRoleSection() {
  const { user, role, signOut } = useAuth()
  const idPrefix = useId()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col items-start gap-3">
          <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
            Account &amp; Access
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Sign in to see your profile, manage your account, and unlock role-based features like the admin panel.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button size="lg" nativeButton={false} render={<Link href={APP_ROUTES.login}>Sign In</Link>} />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href={APP_ROUTES.signup}>Create Account</Link>}
            />
          </div>
        </section>
      </Card>
    )
  }

  const isAdmin = role === "admin"

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-5">
          <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground">
            Account &amp; Access
          </h2>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary"
              >
                {initialsFor(user.name, user.email)}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{user.name || user.email}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>

            <Badge
              className={cn(
                "gap-1.5 py-1.5",
                isAdmin ? "border-primary/30 bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              {isAdmin ? <ShieldCheck className="size-3.5" /> : <UserIcon className="size-3.5" />}
              {isAdmin ? "Admin access" : "Standard user"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={handleSignOut} disabled={signingOut}>
              <LogOut className="size-4" />
              {signingOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </section>
      </Card>

      {isAdmin ? (
        <Card className="border-primary/25 bg-primary/[0.04]">
          <section aria-labelledby={`${idPrefix}-admin-heading`} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
              <h3 id={`${idPrefix}-admin-heading`} className="text-sm font-semibold text-foreground">
                Admin tools unlocked
              </h3>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Your account has admin access, so you can manage users, review feedback, and monitor system health from
              the admin panel.
            </p>
            <Button
              size="sm"
              className="w-fit"
              nativeButton={false}
              render={
                <Link href={APP_ROUTES.admin}>
                  Open admin panel
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
          </section>
        </Card>
      ) : (
        <Card className="border-dashed">
          <section aria-labelledby={`${idPrefix}-locked-heading`} className="flex flex-col gap-1.5">
            <h3 id={`${idPrefix}-locked-heading`} className="text-sm font-semibold text-foreground">
              Admin tools
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Locked for standard users. Ask a workspace admin to upgrade your account if you need access to user
              management, feedback, or system monitoring.
            </p>
          </section>
        </Card>
      )}
    </div>
  )
}
