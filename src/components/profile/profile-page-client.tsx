"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { APP_ROUTES } from "@/lib/constants"
import { useI18n } from "@/i18n/use-i18n"
import { ApiError, requestJson } from "./api-error"
import { LanguageSection } from "./language-section"
import { ProfileSettings } from "./profile-settings"
import type { PersonalInfoValues } from "./personal-info-form"
import type { PasswordChangeValues } from "./security-form"

interface AccountData {
  name: string
  email: string
  signLanguage: string
  avatarUrl: string | null
}

type LoadState =
  | { kind: "loading" }
  | { kind: "loaded"; account: AccountData }
  | { kind: "guest" }
  | { kind: "error"; error: unknown }

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."))
    reader.readAsDataURL(file)
  })
}

const JSON_HEADERS = { "Content-Type": "application/json" }

export function ProfilePageClient() {
  const { t } = useI18n()
  const router = useRouter()
  const [state, setState] = useState<LoadState>({ kind: "loading" })

  const load = useCallback(async () => {
    setState({ kind: "loading" })
    try {
      const data = await requestJson<{ user?: AccountData }>("/api/account", { cache: "no-store" })
      setState(data.user ? { kind: "loaded", account: data.user } : { kind: "guest" })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) setState({ kind: "guest" })
      else setState({ kind: "error", error })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function patchAccount(patch: Partial<AccountData>) {
    setState((current) => (current.kind === "loaded" ? { ...current, account: { ...current.account, ...patch } } : current))
  }

  async function handleSavePersonalInfo(changes: Partial<PersonalInfoValues>) {
    const data = await requestJson<{ user: AccountData }>("/api/account", {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(changes),
    })
    patchAccount(data.user)
    return data.user
  }

  async function handleUpdatePassword(values: PasswordChangeValues) {
    await requestJson("/api/account/password", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    })
  }

  async function handleUploadAvatar(file: File) {
    const dataUrl = await fileToDataUrl(file)
    await requestJson("/api/account/avatar", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ dataUrl }),
    })
    patchAccount({ avatarUrl: dataUrl })
    return dataUrl
  }

  async function handleRemoveAvatar() {
    await requestJson("/api/account/avatar", { method: "DELETE" })
    patchAccount({ avatarUrl: null })
  }

  function handleSignedOut() {
    router.push(APP_ROUTES.home)
  }

  async function handleDeleteAccount() {
    await requestJson("/api/account", { method: "DELETE" })
    router.push(APP_ROUTES.home)
    router.refresh()
  }

  let body: React.ReactNode
  if (state.kind === "loading") {
    body = (
      <div aria-busy="true" className="flex flex-col gap-6">
        <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {t.profile.load.loading}
        </p>
        {[0, 1, 2].map((i) => (
          <Card key={i} aria-hidden="true" className="flex flex-col gap-4">
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
          </Card>
        ))}
      </div>
    )
  } else if (state.kind === "error") {
    body = (
      <Card role="alert" className="flex flex-col items-start gap-3 border-destructive/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">{t.profile.load.errorTitle}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {state.error instanceof ApiError && state.error.status === 0
            ? t.common.errors.network
            : `${t.profile.load.errorBody} ${t.common.errors.generic}`}
        </p>
        <Button type="button" variant="outline" className="h-10 px-4" onClick={() => void load()}>
          <RotateCw className="size-4" aria-hidden="true" />
          {t.common.actions.retry}
        </Button>
      </Card>
    )
  } else if (state.kind === "guest") {
    body = (
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">{t.profile.load.guest}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-10 px-4"
              nativeButton={false}
              render={<Link href={APP_ROUTES.login}>{t.profile.load.signIn}</Link>}
            />
            <Button
              variant="outline"
              className="h-10 px-4"
              nativeButton={false}
              render={<Link href={APP_ROUTES.signup}>{t.profile.load.createAccount}</Link>}
            />
          </div>
        </Card>
        <LanguageSection />
      </div>
    )
  } else {
    const { account } = state
    body = (
      <ProfileSettings
        defaultValues={{ fullName: account.name, email: account.email, signLanguage: account.signLanguage }}
        displayName={account.name || account.email}
        initialAvatarUrl={account.avatarUrl}
        onSavePersonalInfo={handleSavePersonalInfo}
        onUpdatePassword={handleUpdatePassword}
        onUploadAvatar={handleUploadAvatar}
        onRemoveAvatar={handleRemoveAvatar}
        onSignedOut={handleSignedOut}
        onDeleteAccount={handleDeleteAccount}
      />
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{t.profile.page.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.profile.page.subtitle}</p>
      <div className="mt-8 max-w-2xl">{body}</div>
    </>
  )
}

