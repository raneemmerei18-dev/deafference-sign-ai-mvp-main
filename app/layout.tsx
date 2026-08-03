import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import { DevRoleSwitcher } from '@/components/auth/dev-role-switcher'
import { SettingsProvider } from '@/components/deafference/settings-provider'
import { parseSessionRole, SESSION_COOKIE_NAME } from '@/lib/auth/session'
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
  const initialRole = parseSessionRole(cookieStore.get(SESSION_COOKIE_NAME)?.value)
  const initialSettings = parseSettingsCookie(cookieStore.get(SETTINGS_COOKIE_NAME)?.value)

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-dvh bg-background font-sans antialiased text-foreground">
        <AuthProvider initialRole={initialRole}>
          <SettingsProvider initialSettings={initialSettings}>
            {children}
            <DevRoleSwitcher />
          </SettingsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
