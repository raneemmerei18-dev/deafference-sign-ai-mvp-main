import type { Metadata } from 'next'
import { AuthFlow } from '@/components/auth/auth-flow'
import { SkipToAuthLink } from '@/components/auth/skip-to-auth-link'

export const metadata: Metadata = {
  title: 'Deafference — Sign In',
  description: 'Sign in or create a Deafference account.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; reason?: string }>
}) {
  const params = await searchParams

  return (
    <>
      <SkipToAuthLink mode="signin" />
      <main id="auth" className="min-h-dvh bg-background">
        <AuthFlow defaultMode="signin" redirectTo={params.redirectTo} reason={params.reason} />
      </main>
    </>
  )
}
