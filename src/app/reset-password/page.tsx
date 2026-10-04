import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Deafference — Choose a New Password",
  description: "Reset your Deafference account password.",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams

  return (
    <main>
      <AuthShell>
        <ResetPasswordForm token={params.token} />
      </AuthShell>
    </main>
  )
}
