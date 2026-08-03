'use client'

import { AvatarSection, type AvatarSectionProps } from './avatar-section'
import { PersonalInfoForm, type PersonalInfoFormProps } from './personal-info-form'
import { SecurityForm, type SecurityFormProps } from './security-form'
import { DangerZone, type DangerZoneProps } from './danger-zone'

export interface ProfileSettingsProps {
  defaultValues?: PersonalInfoFormProps['defaultValues']
  onUploadAvatar?: AvatarSectionProps['onUpload']
  onRemoveAvatar?: AvatarSectionProps['onRemove']
  onSavePersonalInfo?: PersonalInfoFormProps['onSave']
  onUpdatePassword?: SecurityFormProps['onUpdatePassword']
  onSignOut?: DangerZoneProps['onSignOut']
  onDeleteAccount?: DangerZoneProps['onDeleteAccount']
}

export function ProfileSettings({
  defaultValues,
  onUploadAvatar,
  onRemoveAvatar,
  onSavePersonalInfo,
  onUpdatePassword,
  onSignOut,
  onDeleteAccount,
}: ProfileSettingsProps) {
  return (
    <div className="flex flex-col gap-6">
      <AvatarSection onUpload={onUploadAvatar} onRemove={onRemoveAvatar} />
      <PersonalInfoForm defaultValues={defaultValues} onSave={onSavePersonalInfo} />
      <SecurityForm onUpdatePassword={onUpdatePassword} />
      <DangerZone onSignOut={onSignOut} onDeleteAccount={onDeleteAccount} />
    </div>
  )
}
