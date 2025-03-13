"use client"

import IntroductionField from "@/app/(pages)/profile/[id]/edit/(components)/IntroductionField"
import MBTISelect from "@/app/(pages)/profile/[id]/edit/(components)/MBTISelector"
import ProfilePicture from "@/app/(pages)/profile/[id]/edit/(components)/ProfilePicture"
import UpdateButton from "@/app/(pages)/profile/[id]/edit/(components)/UpdateButton"
import UsernameField from "@/app/(pages)/profile/[id]/edit/(components)/UsernameField"
import { TUser } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser, updateUserProfile } from "@/utils/firebase/firestore"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import useDialogs from "@/utils/global-states/dispatcher"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import type { JSX } from "react"

const ProfileEditPage = (): JSX.Element => {
  const { id } = useParams()
  const router = useRouter()

  const [user, setUser] = useState<TUser | null>(null)

  const { state } = useAppState()
  const { actionsDialog, showMessageDialog } = useDialogs()

  useEffect(() => {
    const getUser = async (): Promise<void | null> => {
      const currentUser = auth.currentUser

      if (currentUser) {
        try {
          const user = await fetchUser(currentUser.uid)

          if (!user) {
            // Handle 404 not found
            router.push("/404")
            return
          }

          setUser(user)
        } catch (err) {
          console.error(err)
          showMessageDialog(
            "data_retrieval",
            "프로필 정보를 불러오는데 실패했습니다.",
          )
        }
      }
    }

    getUser()
  }, [showMessageDialog, router])

  // Update user profile when the user confirms the action dialog.
  useEffect(() => {
    const handleUpdate = async (): Promise<void> => {
      const currentUser = auth.currentUser

      if (currentUser?.uid && user) {
        try {
          await updateUserProfile(currentUser.uid, user)
          router.push(`/profile/${id}`)
          return
        } catch (err) {
          console.error(err)
          showMessageDialog("data_update", "프로필 업데이트에 실패했습니다.")
        }
      }
    }

    if (state.actionsDialogResponse) {
      handleUpdate()
      actionsDialog.hide()
    } else {
      actionsDialog.hide()
    }
  }, [
    state.actionsDialogResponse,
    actionsDialog,
    id,
    showMessageDialog,
    router,
    user,
  ])

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
      <UpdateButton />
    </div>
  )
}

ProfileEditPage.displayName = "ProfileEditPage"

export default ProfileEditPage
