"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { AuthNavActions } from "@/components/auth/auth-nav-actions"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { useI18n } from "@/i18n/use-i18n"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()
  const copy = t.app.shell
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true
      panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      toggleRef.current?.focus()
    }
  }, [isOpen])

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop: persistent sidebar */}
      <aside className="hidden shrink-0 border-e border-border bg-background lg:block lg:w-72">
        <div className="sticky top-0 h-dvh">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile: off-canvas sidebar + backdrop */}
      <div
        inert={!isOpen}
        className={cn("fixed inset-0 z-50 lg:hidden", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      >
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          id="app-sidebar-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={copy.sections}
          className={cn(
            "absolute inset-y-0 start-0 w-72 max-w-[80vw] border-e border-border bg-background transition-transform duration-300",
            isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full rtl:translate-x-full shadow-none",
          )}
        >
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Mobile: floating toggle */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="app-sidebar-panel"
        aria-label={isOpen ? copy.closeSidebar : copy.openSidebar}
        className={cn(
          "fixed bottom-5 start-5 z-50 inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 lg:hidden",
          FOCUS_RING,
        )}
      >
        {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-40 flex items-center justify-end gap-2 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <LanguageToggle />
          <AuthNavActions />
        </div>
        {children}
      </div>
    </div>
  )
}
