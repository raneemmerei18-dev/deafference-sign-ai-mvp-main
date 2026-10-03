"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Container } from "@/components/shared/container"
import { FOOTER_EXPLORE_NAV, FOOTER_COMPANY_NAV } from "@/lib/constants"
import { Logo } from "@/components/deafference/logo"
import { ConnectorPath, GlowOrb } from "./ui/pop"

// Only real destinations here — no placeholder "#" links.
const socialLinks = [{ label: "Email", href: "mailto:hello@deafference.ai", icon: Mail }]

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group relative inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:translate-x-0.5 hover:text-[color:var(--primary)]"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[color:var(--primary)] transition-all duration-300 group-hover:w-full" />
    </a>
  )
}

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pop-atmosphere relative z-10 overflow-hidden border-t border-border/60 py-16 sm:py-20"
    >
      {/* Layered blue depth + a quiet animated connector, kept subtle for a footer */}
      <div className="pop-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <GlowOrb className="top-[-6rem] left-[10%] size-72 opacity-70" color="rgba(59,130,246,0.16)" />
      <GlowOrb className="right-[8%] bottom-[-8rem] size-80 opacity-70" color="rgba(167,180,255,0.18)" />
      <ConnectorPath
        d="M 0 30 C 200 -10, 420 80, 700 20"
        className="left-0 top-0 hidden h-24 w-full opacity-70 lg:block"
        delay={0.6}
      />

      <Container className="relative grid gap-12 lg:grid-cols-[1.3fr_auto_auto_auto] lg:items-start lg:gap-10">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Professional AI landing architecture with a separate translation workflow and room for
            future product pages.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/20 bg-white/60 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[color:var(--primary)] uppercase backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand-orange" />
            Deafference
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">Explore</p>
          <nav className="mt-5 flex flex-col gap-3.5">
            {FOOTER_EXPLORE_NAV.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">Company</p>
          <nav className="mt-5 flex flex-col gap-3.5">
            {FOOTER_COMPANY_NAV.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">Social</p>
          <div className="mt-5 flex flex-col gap-3.5">
            {socialLinks.map((item) => {
              const Icon = item.icon
              return (
                <FooterLink key={item.label} href={item.href}>
                  <Icon className="size-4" />
                  {item.label}
                </FooterLink>
              )
            })}
          </div>
        </div>
      </Container>

      <Container className="relative mt-14 border-t border-[color:var(--primary)]/10 pt-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Deafference. Crafted with a soft-blue, editorial system.
        </p>
      </Container>
    </motion.footer>
  )
}
