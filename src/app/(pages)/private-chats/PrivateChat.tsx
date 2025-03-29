import { TPrivateChat, TMessage, TUser } from "@/app/types"
import { auth, firestore } from "@/utils/firebase/firebase"
import { fetchUser } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  collection,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { JSX } from "react"

type TProps = {
  privateChat: TPrivateChat
}

const PrivateChat = (props: TProps): JSX.Element => {
  const [user, setUser] = useState<TUser | null>(null)
  const [latestMessage, setLatestMessage] = useState<TMessage | null>(null)

  const router = useRouter()

  const isAuthenticated = useAuthCheck()

  const chatId = props.privateChat.id

  useEffect(() => {
    if (!isAuthenticated) return

    const messageRef = collection(firestore, "messages")
    const q = query(messageRef, where("cid", "==", chatId))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const messages = querySnapshot.docs.map((doc) => {
          const data = doc.data() as TMessage
          return {
            ...data,
            id: doc.id,
          }
        })
        setLatestMessage(messages[messages.length - 1])
      },
    )

    return () => unsubscribe()
  }, [isAuthenticated, chatId])

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
            src={user?.photoURL || "/images/ks.jpeg"}
            alt=""
            width={64}
            height={64}
            className="haspect-square h-16 w-16 rounded-full object-cover"
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
