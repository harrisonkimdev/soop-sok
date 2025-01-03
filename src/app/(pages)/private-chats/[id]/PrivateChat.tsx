import { TPrivateChat, TMessage } from "@/types"
import { auth } from "@/utils/firebase/firebase"
import { formatTimeAgo } from "@/utils/functions"
import useFirebaseHookMessages from "@/utils/hooks/fetchData/useFirebaseHookMessages"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

type TProps = {
  privateChat: TPrivateChat
}

const PrivateChat = (props: TProps): JSX.Element => {
  const router = useRouter()

  const chatId = props.privateChat.id
  const latestMessage = useFirebaseHookMessages({ chatId }) as TMessage | null

  const enterPrivateChat = (): void => {
    if (auth && auth.currentUser) {
      router.push(`/chats/private-chat/${chatId}`)
    }
  }

  return (
    <div onClick={enterPrivateChat}>
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <Image
          src={latestMessage?.senderPhotoURL || "/default-profile.png"}
          alt=""
          width={1324}
          height={1827}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div className="w-min grow">
          <div className="flex justify-between">
            {/* Sender's name. */}
            <p className="font-medium">{latestMessage?.senderName}</p>

            {/* the time last message was received. */}
            {latestMessage && <p>{formatTimeAgo(latestMessage?.createdAt)}</p>}
          </div>

          {/* the content of the last message. */}
          <p className="mt-1 line-clamp-2 h-[3rem] overflow-hidden">
            {latestMessage?.message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivateChat
