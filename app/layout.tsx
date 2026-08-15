import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider, type AuthUser } from '@/components/auth/auth-provider'
import { DevRoleSwitcher } from '@/components/auth/dev-role-switcher'
import { EmergencyQuickActions } from '@/components/deafference/emergency-quick-actions'
import { SettingsProvider } from '@/components/deafference/settings-provider'
import { getCurrentSession } from '@/lib/auth/current-user'
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from '@/lib/settings'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
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
