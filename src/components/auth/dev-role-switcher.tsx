"use client"

import type { SessionRole } from "@/lib/auth/session"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"

const ROLES: SessionRole[] = ["guest", "user", "admin"]

/**
 * Floating widget for exercising the guest/user/admin session during
 * development. Renders nothing in production. "Guest" signs the account out;
 * "user"/"admin" call the real `/api/auth/dev-role` endpoint, which flips
 * the signed-in account's role in the database — so this only works once
 * you're actually signed in.
 */
export function DevRoleSwitcher() {
  const { role, user, setRole, signOut } = useAuth()

  if (process.env.NODE_ENV === "production") return null

  function handleClick(candidate: SessionRole) {
    if (candidate === "guest") {
      void signOut()
      return
    }
    void setRole(candidate)
  }

  return (
    <div
      role="group"
      aria-label="Development role switcher"
      className="fixed right-4 bottom-4 z-[100] flex items-center gap-1 rounded-full border border-border bg-card p-1 text-xs shadow-lg"
    >
      <span className="px-2 font-medium text-muted-foreground">Dev role:</span>
      {ROLES.map((candidate) => (
        <button
          key={candidate}
          type="button"
          disabled={candidate !== "guest" && !user}
          onClick={() => handleClick(candidate)}
          title={candidate !== "guest" && !user ? "Sign in first to change your role" : undefined}
          aria-pressed={role === candidate}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
            role === candidate ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
          )}
        >
          {candidate}
        </button>
      ))}
    </div>
  )
}
