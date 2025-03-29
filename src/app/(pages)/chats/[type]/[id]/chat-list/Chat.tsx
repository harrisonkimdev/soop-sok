import { TChat } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { updateChat } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"

import { useRouter } from "next/navigation"
import type { JSX } from "react"

type ChatProps = {
  chat: TChat
}

const Chat = ({ chat }: ChatProps): JSX.Element => {
  const router = useRouter()
  

  const currUser = auth.currentUser
  const isFull = chat.capacity === chat.numMembers

  const handleEnterChat = async (): Promise<void> => {
    if (currUser && !isFull) {
      try {
        // enter or leave the chat
        await updateChat(chat.id, currUser.uid, "enter")
        router.push(`/chats/group/${chat.id}`)
      } catch (err) {
        
      }
    }
  }

  return (
    <div
      onClick={handleEnterChat}
      className="flex flex-col gap-1 rounded-lg bg-earth-50 px-4 py-3 shadow"
    >
      <p className="line-clamp-1">{chat.name}</p>

      <div className="flex justify-end">
        <p className="text-sm">{formatTimeAgo(chat.createdAt)}</p>
      </div>

      {chat.tag.length > 0 && (
        <div className="flex h-6 justify-between">
          <div className="rounded-full bg-amber-500 px-4 py-1 text-xs text-white">
            <span>{chat.tag}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
