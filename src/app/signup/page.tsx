import type { Metadata } from 'next'
import { AuthFlow } from '@/components/auth/auth-flow'

export const metadata: Metadata = {
  title: 'Deafference — Create Account',
  description: 'Sign in or create a Deafference account.',
}

export default function SignupPage() {
  return (
    <>
      <a
        href="#auth"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to sign up form
      </a>
      <main id="auth" className="min-h-dvh bg-background">
        <AuthFlow defaultMode="signup" />
      </main>
    </>
  )
}
