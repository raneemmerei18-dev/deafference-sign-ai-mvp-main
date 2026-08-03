"use client"

import type { SessionRole } from "@/lib/auth/session"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"

const ROLES: SessionRole[] = ["guest", "user", "admin"]

/**
 * Floating widget for exercising the guest/user/admin mock session during
 * development. Renders nothing in production — this only exists so RBAC
 * behavior (route guards, conditional nav) can be tested without a real
 * backend issuing sessions.
 */
export function DevRoleSwitcher() {
  const { role, setRole } = useAuth()

  if (process.env.NODE_ENV === "production") return null

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
          onClick={() => setRole(candidate)}
          aria-pressed={role === candidate}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            role === candidate ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
          )}
        >
          {candidate}
        </button>
      ))}
    </div>
  )
}
