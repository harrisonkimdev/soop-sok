"use client"

import IntroductionField from "@/app/(pages)/profile/[id]/edit/(components)/IntroductionField"
import MBTISelect from "@/app/(pages)/profile/[id]/edit/(components)/MBTISelector"
import ProfilePicture from "@/app/(pages)/profile/[id]/edit/(components)/ProfilePicture"
import UpdateButton from "@/app/(pages)/profile/[id]/edit/(components)/UpdateButton"
import UsernameField from "@/app/(pages)/profile/[id]/edit/(components)/UsernameField"
import type { TUser } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { updateUserProfile } from "@/utils/firebase/firestore"
import { useRouter, useParams } from "next/navigation"
import { useState, useCallback } from "react"
import type { JSX } from "react"

export default function EditProfile(): JSX.Element {
  const router = useRouter()
  const { id } = useParams()
  const [user, setUser] = useState<TUser | null>(null)

  const handleUpdate = useCallback(async (): Promise<void> => {
    const currentUser = auth.currentUser

    if (currentUser && user) {
      try {
        await updateUserProfile(currentUser.uid, user)
        router.push(`/profile/${id}`)
      } catch (error) {
        console.error("Update error:", error)
      }
    }
  }, [id, router, user])

  const updateField = useCallback(
    (field: string, value: any, isProfileField = false) => {
      setUser((prev) => {
        if (!prev) return prev
        if (isProfileField) {
          return {
            ...prev,
            profile: {
              ...prev.profile,
              [field]: value,
            },
          } as TUser
        } else {
          return {
            ...prev,
            [field]: value,
          } as TUser
        }
      })
    },
    [],
  )

  return (
    <div className="flex flex-col gap-6 pt-10">
      <ProfilePicture photoURL={user?.photoURL} updateField={updateField} />
      <div className="flex flex-col gap-8">
        <UsernameField
          displayName={user?.displayName}
          updateField={updateField}
        />
        <IntroductionField
          introduction={user?.profile.introduction}
          updateField={updateField}
        />
        <MBTISelect mbti={user?.profile.mbti} updateField={updateField} />
      </div>
      <UpdateButton onUpdate={handleUpdate} />
    </div>
  )
}

EditProfile.displayName = "EditProfile"
