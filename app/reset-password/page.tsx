import type { Metadata } from "next"
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"
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
    <main className="min-h-dvh bg-background">
      <div className="grid min-h-dvh w-full lg:grid-cols-2">
        <AuthBrandPanel />
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <ResetPasswordForm token={params.token} />
        </div>
      </div>
    </main>
  )
}
