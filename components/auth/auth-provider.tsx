"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { SESSION_COOKIE_NAME, type SessionRole } from "@/lib/auth/session"

export interface AuthUser {
  name: string
  email: string
  role: Exclude<SessionRole, "guest">
}

export interface AuthContextValue {
  role: SessionRole
  user: AuthUser | null
  /** Dev-only: force the mock session to a given role. No-ops in production builds. */
  setRole: (role: SessionRole) => void
  /** Mock sign-in: sets the session role (defaults to "user") — a stand-in for a real auth call. */
  signIn: (role?: Exclude<SessionRole, "guest">) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USERS: Record<Exclude<SessionRole, "guest">, AuthUser> = {
  user: { name: "Jordan Lee", email: "jordan.lee@example.com", role: "user" },
  admin: { name: "Ellen Vance", email: "ellen.vance@example.com", role: "admin" },
}

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7

function writeSessionCookie(role: SessionRole) {
  if (role === "guest") {
    document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
    return
  }
  document.cookie = `${SESSION_COOKIE_NAME}=${role}; path=/; max-age=${ONE_WEEK_SECONDS}; samesite=lax`
}

export function AuthProvider({ initialRole, children }: { initialRole: SessionRole; children: ReactNode }) {
  const [role, setRoleState] = useState<SessionRole>(initialRole)
  const router = useRouter()

  const setRole = useCallback(
    (next: SessionRole) => {
      // The mock cookie is client-writable by design (see lib/auth/session.ts) —
      // never let it be set outside development, even if this code somehow ships.
      if (process.env.NODE_ENV === "production") return
      writeSessionCookie(next)
      setRoleState(next)
      // middleware and any server components (e.g. the sidebar's admin link)
      // read the cookie fresh, so re-run the server render after it changes.
      router.refresh()
    },
    [router],
  )

  const signIn = useCallback(
    (next: Exclude<SessionRole, "guest"> = "user") => setRole(next),
    [setRole],
  )
  const signOut = useCallback(() => setRole("guest"), [setRole])

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      user: role === "guest" ? null : MOCK_USERS[role],
      setRole,
      signIn,
      signOut,
    }),
    [role, setRole, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
