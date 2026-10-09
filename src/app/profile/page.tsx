import type { Metadata } from 'next'
import { AppShell } from '@/components/app-shell/app-shell'
import { Container } from '@/components/shared/container'
import { ProfilePageClient } from '@/components/profile/profile-page-client'

export const metadata: Metadata = {
  title: 'Deafference — Account Settings',
  description: 'Manage your Deafference profile, security, and account preferences.',
}

export default function ProfilePage() {
  return (
    <AppShell>
      <main className="py-8 sm:py-10 lg:py-12">
        <Container>
          <ProfilePageClient />
        </Container>
      </main>
    </AppShell>
  )
}
