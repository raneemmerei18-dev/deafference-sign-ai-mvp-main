"use client"

import Link from "next/link"
import { ShieldCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { APP_ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"

function initialsFor(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

/** Login/Signup buttons for guests, or an account chip + sign out for signed-in users. Drop into any header's top-right slot. */
export function AuthNavActions({ className }: { className?: string }) {
  const { user, role, signOut } = useAuth()

  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={APP_ROUTES.login}>Log In</Link>} />
        <Button size="sm" nativeButton={false} render={<Link href={APP_ROUTES.signup}>Sign Up</Link>} />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href={APP_ROUTES.settings}
        className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pr-3 pl-1 text-sm transition-colors hover:bg-muted"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initialsFor(user.name, user.email)}
        </span>
        <span className="hidden font-medium text-foreground sm:inline">{user.name || user.email}</span>
        {role === "admin" ? (
          <Badge className="hidden gap-1 border-primary/30 bg-primary/10 py-0.5 text-primary sm:inline-flex">
            <ShieldCheck className="size-3" />
            Admin
          </Badge>
        ) : null}
      </Link>
      <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut()}>
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
