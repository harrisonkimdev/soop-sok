import { TPrivateChat, TMessage, TUser } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"
import useFirebaseHookMessages from "@/utils/hooks/fetchData/useFirebaseHookMessages"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { JSX } from "react"

type TProps = {
  privateChat: TPrivateChat
}

const PrivateChat = (props: TProps): JSX.Element => {
  const router = useRouter()

  const [user, setUser] = useState<TUser | null>(null)

  const chatId = props.privateChat.id
  const latestMessage = useFirebaseHookMessages(chatId, true) as TMessage | null

  useEffect(() => {
    const getuser = async (): Promise<void> => {
      if (latestMessage?.uid) {
        const fetchedUser = await fetchUser(latestMessage.uid)
        setUser(fetchedUser)
      }
    }
    getuser()
  }, [latestMessage?.uid])

  const enterPrivateChat = (): void => {
    if (auth && auth.currentUser) {
      // URL: "/chats/[type=private-chat]/[id]
      router.push(`/chats/private-chat/${chatId}`)
    }
  }

  return (
    <div onClick={enterPrivateChat}>
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        {user && (
          <Image
            src={user?.photoURL || "/default-profile.png"}
            alt=""
            width={1324}
            height={1827}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}

        <div className="w-min grow">
          <div className="flex justify-between">
            {/* Sender's name. */}
            <p className="font-medium">{user?.displayName}</p>

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
