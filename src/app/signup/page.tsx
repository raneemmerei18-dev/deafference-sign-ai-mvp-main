import type { Metadata } from 'next'
import { AuthFlow } from '@/components/auth/auth-flow'
import { SkipToAuthLink } from '@/components/auth/skip-to-auth-link'

export const metadata: Metadata = {
  title: 'Deafference — Create Account',
  description: 'Sign in or create a Deafference account.',
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const params = await searchParams

  return (
    <>
      <SkipToAuthLink mode="signup" />
      <main id="auth" className="min-h-dvh bg-background">
        {/* redirectTo is sanitized (same-origin paths only) inside AuthFlow. */}
        <AuthFlow defaultMode="signup" redirectTo={params.redirectTo} />
      </main>
    </>
  )
}
