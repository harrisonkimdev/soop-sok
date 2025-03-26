"use client"

import Chat from "@/app/(pages)/chats/[type]/[id]/chat-list/Chat"
import { TChat } from "@/app/types"
import useFirebaseHookChats from "@/utils/hooks/fetchData/useFirebaseHookChats"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

type pageProps = {
  params: {
    type: string
    id: string
  }
}

const ChatListPage = ({ params }: pageProps): JSX.Element => {
  const router = useRouter()

  const chats = useFirebaseHookChats({ cid: params.id })

  const handleCancelClick = (): void => {
    console.log("handleCancelClick")
    router.push(`/chats/${params.type}/${params.id}/features`)
    return
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* chat list */}
      <div className="row-span-11 flex grow flex-col gap-6 overflow-y-auto rounded-lg bg-white p-4">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          Chat List
        </h1>

        <div className="flex flex-col gap-4">
          {chats?.map((chat: TChat) => <Chat key={chat.id} chat={chat} />)}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCancelClick}
        className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
      >
        Cancel
      </button>
    </div>
  )
}

ChatListPage.displayName = "ChatListPage"

export default ChatListPage
