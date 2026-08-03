import type { Metadata } from 'next'
import { AppShell } from '@/components/app-shell/app-shell'
import { Container } from '@/components/shared/container'
import { ProfileSettings } from '@/components/profile/profile-settings'

export const metadata: Metadata = {
  title: 'Deafference — Account Settings',
  description: 'Manage your Deafference profile, security, and account preferences.',
}

export default function ProfilePage() {
  return (
    <AppShell>
      <main className="py-8 sm:py-10 lg:py-12">
        <Container>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Account Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage your profile, security, and account preferences.
          </p>

          <div className="mt-8 max-w-2xl">
            <ProfileSettings />
          </div>
        </Container>
      </main>
    </AppShell>
  )
}
