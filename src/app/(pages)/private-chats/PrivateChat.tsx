import { TPrivateChat, TMessage, TUser } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import { fetchUser } from "@/utils/firebase/firestore"
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

const PrivateChat = ({ privateChat }: TProps): JSX.Element => {
  const [user, setUser] = useState<TUser | null>(null)
  const [latestMessage, setLatestMessage] = useState<TMessage | null>(null)

  const router = useRouter()

  const isAuthenticated = useAuthCheck()

  const chatId = privateChat.id

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
      const user = await fetchUser(privateChat.to)
      setUser(user)
    }
    getuser()
  }, [privateChat.to])

  const enterPrivateChat = (): void => {
    router.push(`/chats/private/${chatId}`)
  }

  return (
    <div
      onClick={enterPrivateChat}
      className="group relative overflow-hidden rounded-xl transition duration-300 ease-in-out"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative z-10 flex items-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 p-5 transition-all hover:border-teal-500/50">
        {user?.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium text-slate-300 transition-colors group-hover:text-teal-300">
            {user?.displayName || "Unknown User"}
          </h3>
          {latestMessage && (
            <p className="text-sm text-slate-400 transition-colors group-hover:text-teal-200">
              {latestMessage.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrivateChat
