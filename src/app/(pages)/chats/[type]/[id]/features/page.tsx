"use client"

import { auth } from "@/utils/firebase/firebase"
import { updateChannel, updateChat } from "@/utils/firebase/firestore"
import { useAppState } from "@/utils/global-states/AppStateProvider"
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ArrowLeftStartOnRectangleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MegaphoneIcon,
  PlusIcon,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UsersIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

const features = [
  { feature: "create-chat", Icon: PlusIcon, text: "Create Chat" },
  { feature: "add-banner", Icon: MegaphoneIcon, text: "Add Banner" },
  {
    feature: "chat-list",
    Icon: ChatBubbleOvalLeftEllipsisIcon,
    text: "Chat List",
  },
]

type TFeatures =
  | "create-chat"
  | "add-banner"
  | "chat-list"
  | "user-list"
  | "cancel"

type PageProps = {
  params: {
    type: string
    id: string
  }
}

const FeaturesPage = ({ params }: PageProps): JSX.Element => {
  const router = useRouter()
  const { state, dispatch } = useAppState()

  const redirectTo = (feature: TFeatures): void => {
    if (auth) {
      const path = feature === "cancel" ? "" : `/${feature}`
      router.push(`/chats/${params.type}/${params.id}${path}`)
      return
    }
  }

  const handleLeave = async (): Promise<void> => {
    const currentUserId = auth.currentUser?.uid
    if (!currentUserId) {
      // TODO: add feedback - need to login.
      router.push("/")
    }

    // update channel or chat depending on where a user is.
    const leaveFunction = params.type === "channel" ? updateChannel : updateChat
    const userLeft = await leaveFunction(params.id, currentUserId!, "leave")

    // Redirect users to /channels.
    if (params.type === "channel") {
      dispatch({ type: "SET_CHANNEL_ID", payload: null })
      if (userLeft) router.push("/channels")
    }

    // Redirect users to /chats/channel.
    else if (params.type === "group" && userLeft) {
      router.push(`/chats/channel/${state.channelId}`)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 py-2">
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg">
        {/* create-chat, add-banner, chat-list in channel only */}
        {params.type === "channel" &&
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          features.map(({ feature, Icon, text }) => (
            <div
              key={feature}
              onClick={() => redirectTo(feature as TFeatures)}
              className="flex items-center justify-center gap-4 rounded-lg bg-earth-50 py-5 transition duration-300 ease-in-out hover:bg-earth-100"
            >
              {/* <Icon className='h-7' /> */}
              <p className="text-lg font-semibold text-earth-500">{text}</p>
            </div>
          ))}

        {/* user-list */}
        <div
          onClick={() => redirectTo("user-list")}
          className="flex items-center justify-center gap-4 rounded-lg bg-earth-50 py-5 transition duration-300 ease-in-out hover:bg-earth-100"
        >
          {/* <UsersIcon className='h-7' /> */}
          <p className="text-lg font-semibold text-earth-500">User List</p>
        </div>

        {/* leave */}
        {(params.type === "channel" || params.type === "group") && (
          <div
            onClick={handleLeave}
            className="flex items-center justify-center gap-4 rounded-lg bg-earth-50 py-5 transition duration-300 ease-in-out hover:bg-earth-100"
          >
            {/* <ArrowLeftStartOnRectangleIcon className="h-7" /> */}
            <p className="text-lg font-semibold text-earth-500">Leave</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => redirectTo("cancel")}
        className="w-full rounded-lg bg-earth-50 py-4 text-lg font-semibold text-earth-500 shadow-sm transition duration-300 ease-in-out hover:bg-earth-100"
      >
        Cancel
      </button>
    </div>
  )
}

FeaturesPage.displayName = "FeaturesPage"

export default FeaturesPage
