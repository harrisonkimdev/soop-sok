"use client"

import { TBanner } from "@/app/types"
import { ActionButtons } from "@/components/CreateChat/ActionButtons"
import { CapacitySlider } from "@/components/CreateChat/CapacitySlider"
import { NameInput } from "@/components/CreateChat/NameInput"
import { PasswordInput } from "@/components/CreateChat/PasswordInput"
import { PrivacyRadio } from "@/components/CreateChat/PrivacyRadio"
import { TagSelect } from "@/components/CreateChat/TagSelect"
import { auth } from "@/utils/firebase/firebase"
import { createChat, getBanner } from "@/utils/firebase/firestore"
import useDialogs from "@/utils/global-states/dispatcher"
import { useChatForm } from "@/utils/hooks/useCreateChatForm"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import type { JSX } from "react"

type TProps = {
  params: {
    type: string
    id: string
  }
}

const CreateChatPage = ({ params }: TProps): JSX.Element => {
  const {
    formState,
    setFormState,
    handleInputChange,
    handleSliderChange,
    handleSelectChange,
    handlePrivacyChange,
  } = useChatForm()

  const router = useRouter()
  const { messageDialog } = useDialogs()

  // TODO: server side rendering
  useEffect(() => {
    const fetchBannerOptions = async (): Promise<void> => {
      if (auth) {
        try {
          const banner: TBanner | null = await getBanner()

          if (banner) {
            setFormState((prevState) => ({
              ...prevState,
              tagOptions: banner.tagOptions,
            }))
          }
        } catch (err) {
          messageDialog.show("data_retrieval")
        }
      }
    }
    fetchBannerOptions()
  }, [messageDialog, setFormState])

  const redirectToFeaturesPage = (): void => {
    if (auth) router.push(`/chats/${params.type}/${params.id}/features`)
    else router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const currentUser = auth.currentUser

    // TODO: validate the inputs
    if (currentUser && formState.name.length > 0) {
      try {
        const cid = await createChat(
          params.id,
          currentUser.uid,
          formState.capacity,
          formState.name,
          formState.tag,
          formState.isPrivate,
          formState.password,
        )

        if (cid) router.push(`/chats/group/${cid}`)
      } catch (err) {
        console.error(err)
        messageDialog.show("general")
      }
    }
  }

  return (
    <form onSubmit={() => {}} className="flex h-full flex-col gap-4">
      {/* input fields */}
      <div className="flex grow flex-col gap-6 overflow-y-auto rounded-lg bg-white p-5 shadow-sm">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          create a new chat
        </h1>

        {/* name */}
        <NameInput name={formState.name} onChange={handleInputChange} />

        {/* tag */}
        <TagSelect
          tag={formState.tag}
          tagOptions={formState.tagOptions}
          onChange={handleSelectChange}
        />

        {/* capacity */}
        <CapacitySlider
          capacity={formState.capacity}
          onChange={handleSliderChange}
        />

        {/* isPrivate */}
        <PrivacyRadio
          isPrivate={formState.isPrivate}
          onChange={handlePrivacyChange}
        />

        {/* password */}
        <PasswordInput
          isPrivate={formState.isPrivate}
          password={formState.password}
          onChange={handleInputChange}
        />
      </div>

      {/* buttons */}
      <ActionButtons
        onCancel={redirectToFeaturesPage}
        onSubmit={handleSubmit}
      />
    </form>
  )
}

CreateChatPage.displayName = "CreateChatPage"

export default CreateChatPage
