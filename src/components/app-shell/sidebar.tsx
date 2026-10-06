"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeft,
  FlaskConical,
  GitBranch,
  History,
  Layers,
  LayoutGrid,
  Mic,
  Settings2,
  ShieldCheck,
  UserCircle2,
  type LucideIcon,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { APP_ROUTES, SIDEBAR_NAV } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"

const ICONS: Record<string, LucideIcon> = {
  Mic,
  History,
  Settings2,
  LayoutGrid,
  GitBranch,
  FlaskConical,
  Layers,
  UserCircle2,
}

// The "Demos & Prototypes" group links to internal dev prototypes; keep them out of production navigation.
const DEMO_HEADING = "Demos & Prototypes"
const SHOW_DEMOS = process.env.NODE_ENV !== "production"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { role } = useAuth()
  const { t } = useI18n()
  const copy = t.app.shell

  // SIDEBAR_NAV (lib/constants) is English-only; translate known entries by href / heading.
  const navLabels: Record<string, string> = {
    [APP_ROUTES.translate]: copy.nav.translate,
    [APP_ROUTES.history]: copy.nav.history,
    [APP_ROUTES.settings]: copy.nav.settings,
    [APP_ROUTES.profile]: copy.nav.profile,
  }
  const headingLabels: Record<string, string> = { Workspace: copy.workspace }

  const groups = SIDEBAR_NAV.filter((group) => SHOW_DEMOS || group.heading !== DEMO_HEADING)

  return (
    <nav aria-label={copy.sections} className="flex h-full flex-col px-4 py-6">
      <div className="flex-1 space-y-6 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {headingLabels[group.heading] ?? group.heading}
            </p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = ICONS[item.icon]
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-10 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "border-brand-red/30 bg-brand-orange/10 text-brand-red"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        FOCUS_RING,
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {navLabels[item.href] ?? item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {role === "admin" ? (
          <div>
            <p className="px-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {copy.administration}
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href={APP_ROUTES.admin}
                  onClick={onNavigate}
                  aria-current={pathname === APP_ROUTES.admin ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === APP_ROUTES.admin
                      ? "border-brand-red/30 bg-brand-orange/10 text-brand-red"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    FOCUS_RING,
                  )}
                >
                  <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                  {copy.adminPanel}
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border pt-4">
        <Link
          href={APP_ROUTES.home}
          onClick={onNavigate}
          className={cn(
            "flex min-h-10 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            FOCUS_RING,
          )}
        >
          <ArrowLeft className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
          {copy.backToSite}
        </Link>
      </div>
    </nav>
  )
}
