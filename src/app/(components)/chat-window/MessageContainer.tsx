"use client"

import ChatMessage from "@/app/(components)/chat-window/ChatMessage"
import { TMessage } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore"
import type { JSX } from "react"
import { useEffect, useState } from "react"

const MessageContainer = ({ cid }: { cid: string }): JSX.Element => {
  const isAuthenticated = useAuthCheck()
  const [messages, setMessages] = useState<TMessage[]>([])

  useEffect(() => {
    if (!isAuthenticated) return

    const messageRef = collection(firestore, "messages")
    const q = query(messageRef, where("cid", "==", cid))

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
        setMessages(messages)
      },
    )

    return () => unsubscribe()
  }, [isAuthenticated, cid])

  return (
    <div
      onScroll={() => {}}
      className="flex grow flex-col gap-7 overflow-y-auto rounded-lg bg-white p-4 shadow-sm"
    >
      {Array.isArray(messages) &&
        messages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
    </div>
  )
}

export default MessageContainer
