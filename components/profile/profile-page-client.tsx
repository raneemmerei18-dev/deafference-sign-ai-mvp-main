"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { APP_ROUTES } from "@/lib/constants"
import { ProfileSettings } from "./profile-settings"
import type { PersonalInfoValues } from "./personal-info-form"
import type { PasswordChangeValues } from "./security-form"

interface AccountData {
  name: string
  email: string
  signLanguage: string
  avatarUrl: string | null
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."))
    reader.readAsDataURL(file)
  })
}

async function parseJsonOrThrow(response: Response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.")
  return data
}

export function ProfilePageClient() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [account, setAccount] = useState<AccountData | null>(null)
  const [guest, setGuest] = useState(false)

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setAccount(data.user)
        else setGuest(true)
      })
  }, [])

  async function handleSavePersonalInfo(values: PersonalInfoValues) {
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: values.fullName, email: values.email, signLanguage: values.signLanguage }),
    })
    const data = await parseJsonOrThrow(response)
    setAccount((current) => (current ? { ...current, ...data.user } : data.user))
  }

  async function handleUpdatePassword(values: PasswordChangeValues) {
    const response = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    })
    await parseJsonOrThrow(response)
  }

  async function handleUploadAvatar(file: File) {
    const dataUrl = await fileToDataUrl(file)
    const response = await fetch("/api/account/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
    })
    await parseJsonOrThrow(response)
    setAccount((current) => (current ? { ...current, avatarUrl: dataUrl } : current))
  }

  async function handleRemoveAvatar() {
    const response = await fetch("/api/account/avatar", { method: "DELETE" })
    await parseJsonOrThrow(response)
    setAccount((current) => (current ? { ...current, avatarUrl: null } : current))
  }

  async function handleSignOut() {
    await signOut()
    router.push(APP_ROUTES.home)
  }

  async function handleDeleteAccount() {
    const response = await fetch("/api/account", { method: "DELETE" })
    await parseJsonOrThrow(response)
    router.push(APP_ROUTES.home)
    router.refresh()
  }

  if (guest) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">Sign in to view and manage your account.</p>
        <div className="flex gap-2">
          <Button size="sm" nativeButton={false} render={<Link href={APP_ROUTES.login}>Sign In</Link>} />
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link href={APP_ROUTES.signup}>Create Account</Link>}
          />
        </div>
      </Card>
    )
  }

  return (
    <ProfileSettings
      key={account ? "loaded" : "loading"}
      defaultValues={
        account ? { fullName: account.name, email: account.email, signLanguage: account.signLanguage } : undefined
      }
      initialAvatarUrl={account?.avatarUrl}
      onSavePersonalInfo={handleSavePersonalInfo}
      onUpdatePassword={handleUpdatePassword}
      onUploadAvatar={handleUploadAvatar}
      onRemoveAvatar={handleRemoveAvatar}
      onSignOut={handleSignOut}
      onDeleteAccount={handleDeleteAccount}
    />
  )
}
