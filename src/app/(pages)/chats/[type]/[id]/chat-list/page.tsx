"use client"

import PageTitle from "@/app/(components)/PageTitle"
import Chat from "@/app/(pages)/chats/[type]/[id]/chat-list/Chat"
import { TChat } from "@/app/types"
import RedirectButton from "@/components/RedirectButton"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  collection,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
  DocumentData,
} from "firebase/firestore"
import type { JSX } from "react"
import { useEffect, useState } from "react"

type pageProps = {
  params: {
    type: string
    id: string
  }
}

const ChatList = ({ params }: pageProps): JSX.Element => {
  const [chats, setChats] = useState<TChat[]>([])
  const isAuthenticated = useAuthCheck()

  useEffect(() => {
    if (!isAuthenticated) return

    const chatsRef = collection(firestore, "chats")
    const q = query(chatsRef, where("cid", "==", params.id))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const chats = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as TChat,
        )

        setChats(chats)
      },
      (error: Error) => {
        console.error("채팅 리스닝 중 오류", error)
      },
    )

    return () => unsubscribe()
  }, [params.id, isAuthenticated])

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="row-span-11 flex grow flex-col gap-6 overflow-y-auto rounded-lg bg-white p-4">
        <PageTitle title="Chat List" />

        <div className="flex flex-col gap-4">
          {chats.length > 0 ? (
            chats?.map((chat: TChat) => <Chat key={chat.id} chat={chat} />)
          ) : (
            <p>No chats available.</p>
          )}
        </div>
      </div>

      <RedirectButton
        text="Cancel"
        redirectURL={`/chats/${params.type}/${params.id}/features`}
      />
    </div>
  )
}

ChatList.displayName = "ChatList"

export default ChatList
