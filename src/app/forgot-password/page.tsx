import type { Metadata } from "next"
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Deafference — Reset Password",
  description: "Request a password reset link for your Deafference account.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-dvh bg-background">
      <div className="grid min-h-dvh w-full lg:grid-cols-2">
        <AuthBrandPanel />
        <div className="flex flex-col items-center justify-center gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  )
}
