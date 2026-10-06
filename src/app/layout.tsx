import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { AuthProvider, type AuthUser } from '@/components/auth/auth-provider'
import { DevRoleSwitcher } from '@/components/auth/dev-role-switcher'
import { EmergencyQuickActions } from '@/components/deafference/emergency-quick-actions'
import { SettingsProvider } from '@/components/deafference/settings-provider'
import { getCurrentSession } from '@/lib/auth/current-user'
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from '@/lib/settings'
import { dirFor, localeFromLanguage } from '@/i18n/locale'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Deafference — AI Communication Platform',
  description:
    'A polished AI SaaS landing page and product architecture for speech-to-sign communication.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf7f1' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1c26' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const session = await getCurrentSession()
  const initialUser: AuthUser | null = session
    ? { name: session.name, email: session.email, role: session.role === 'admin' ? 'admin' : 'user' }
    : null
  const initialSettings = parseSettingsCookie(cookieStore.get(SETTINGS_COOKIE_NAME)?.value)
  // Server-render the right lang/dir to avoid an LTR flash; SettingsProvider keeps it in sync
  // client-side (and exempts /admin, which stays English).
  const locale = localeFromLanguage(initialSettings.language)

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans antialiased text-foreground">
        <AuthProvider initialUser={initialUser}>
          <SettingsProvider initialSettings={initialSettings}>
            {children}
            <DevRoleSwitcher />
            <EmergencyQuickActions />
          </SettingsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
