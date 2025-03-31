"use client"

import { useAppState } from "@/app/(context)/AppStateProvider"
import { auth } from "@/utils/firebase/firebase"
import { updateChannel, updateChat } from "@/utils/firebase/firestore"
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-700 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 p-6">
          {/* create-chat, add-banner, chat-list in channel only */}
          {params.type === "channel" &&
            features.map(({ feature, Icon: _Icon, text }) => (
              <div
                key={feature}
                onClick={() => redirectTo(feature as TFeatures)}
                className="group relative overflow-hidden rounded-xl transition duration-300 ease-in-out"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10 flex items-center justify-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 transition-all hover:border-teal-500/50">
                  <p className="text-lg font-medium text-slate-300 transition-colors group-hover:text-teal-300">
                    {text}
                  </p>
                </div>
              </div>
            ))}

          {/* user-list */}
          <div
            onClick={() => redirectTo("user-list")}
            className="group relative overflow-hidden rounded-xl transition duration-300 ease-in-out"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10 flex items-center justify-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 transition-all hover:border-teal-500/50">
              <p className="text-lg font-medium text-slate-300 transition-colors group-hover:text-teal-300">
                User List
              </p>
            </div>
          </div>

          {/* leave */}
          {(params.type === "channel" || params.type === "group") && (
            <div
              onClick={handleLeave}
              className="group relative overflow-hidden rounded-xl transition duration-300 ease-in-out"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex items-center justify-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 transition-all hover:border-rose-500/50">
                <p className="text-lg font-medium text-slate-300 transition-colors group-hover:text-rose-300">
                  Leave
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => redirectTo("cancel")}
          className="w-full border-t border-slate-700/30 bg-slate-700/50 py-4 text-lg font-medium text-slate-300 transition-all hover:bg-slate-700/70 hover:text-teal-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

FeaturesPage.displayName = "FeaturesPage"

export default FeaturesPage
