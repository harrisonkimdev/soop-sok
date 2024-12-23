import { TChat } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import { updateChat } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"
import useFetchChatInRealTime from "@/utils/hooks/fetchData/useFetchChatInRealTime"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

type ChatProps = {
  chat: TChat
}

const Chat = ({ chat }: ChatProps): JSX.Element => {
  const router = useRouter()
  const { messageDialog } = useDialogs()

  const channelData = useFetchChatInRealTime({
    chatId: chat.id,
  })

  const isFull = channelData?.isFull ?? false

  const handleEnterChat = async (): Promise<void> => {
    if (auth.currentUser && !isFull) {
      try {
        const res = await updateChat(chat.id, auth.currentUser.uid, "enter")
        if (res) router.push(`/chats/chatroom/${chat.id}`)
      } catch (err) {
        console.error(err)
        messageDialog.show("general")
      }
    }
  }

  return (
    <div
      onClick={handleEnterChat}
      className="flex flex-col gap-1 rounded-lg bg-stone-100 px-3 py-2"
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
