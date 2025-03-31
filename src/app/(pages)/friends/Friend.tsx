"use client"

import { TUser } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser, getOrCreateChatId } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"

const NO_PIC_PLACEHOLDER =
  "https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/No%20Image.png?alt=media&token=18067651-9566-4522-bf2e-9a7963731676"

type FriendProp = {
  friendId: string
  className?: string
}

export const Friend = ({ friendId, className }: FriendProp): JSX.Element => {
  const [friend, setFriend] = useState<TUser | null>(null)

  const router = useRouter()

  useEffect(() => {
    const getUser = async (): Promise<void | null> => {
      if (!auth) return

      try {
        const user = await fetchUser(friendId)
        if (user) {
          setFriend(user as TUser)
        }
      } catch (err) {
        console.error(err)
      }
    }
    getUser()
  })

  const redirectToDMChat = async (): Promise<void | null> => {
    const myId = auth.currentUser?.uid
    const opponentId = friendId

    if (!myId || !opponentId) {
      // TODO: Provide feedback to the user
      return
    }

    // Redirect to the chat page if the chat exists
    if (auth) {
      try {
        const chat = await getOrCreateChatId(myId, friendId)

        if (chat) {
          router.push(`/chats/private-chat/${chat.id}`)
          return
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl transition duration-300 ease-in-out ${className || ""}`}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative z-10 flex items-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 p-5 transition-all hover:border-teal-500/50">
        <Link
          href={`/profile/${friendId}`}
          className={`flex h-min items-center rounded-full border-2 ${friend?.isOnline ? "border-teal-500/50" : "border-rose-500/50"}`}
        >
          <Image
            src={friend?.photoURL || NO_PIC_PLACEHOLDER}
            alt={`${friend?.displayName}'s profile picture`}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </Link>

        <div className="grid grow grid-cols-6 items-center">
          <Link
            href={`/profile/${friendId}`}
            className="col-span-4 cursor-pointer transition-colors group-hover:text-teal-300"
          >
            <p className="truncate text-lg font-medium text-slate-300">
              {friend?.displayName}
            </p>
            <p className="whitespace-nowrap text-sm text-slate-400">
              Last login: {formatTimeAgo(friend?.lastLoginTime)}
            </p>
          </Link>

          <div className="col-span-2 flex items-center justify-end">
            <button
              onClick={redirectToDMChat}
              aria-label="Direct Message"
              className="rounded-full border border-slate-700/30 bg-slate-800/50 p-2 transition-all duration-200 hover:border-teal-500/50 hover:text-teal-300"
            >
              <ChatBubbleBottomCenterIcon className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friend
