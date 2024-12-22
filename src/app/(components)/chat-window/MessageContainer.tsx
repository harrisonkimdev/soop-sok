"use client"

import ChatMessage from "@/app/(components)/chat-window/ChatMessage"
import { TMessage } from "@/types"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import { collection } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import type { JSX } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

const MessageContainer = (): JSX.Element => {
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [messages, setMessages] = useState<TMessage[]>([])
  const chatWindowRef = useRef<HTMLDivElement>(null)

  // check rules in Cloud Firestore for security concerns.
  const [value, loading, error] = useCollection(
    collection(firestore, "messages"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  )

  useAuthCheck(setIsAuthenticated)

  // If it's an authenticated user, fetch messages.
  useEffect(() => {
    if (isAuthenticated && value) {
      const messageList = value.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TMessage,
      )

      setMessages(messageList)
    }
  }, [isAuthenticated, value, router])

  useEffect(() => {
    if (loading) {
      console.log("Loading messages...")
    } else if (error) {
      console.error("Error fetching messages:", error)
    }
  }, [loading, error])

  return (
    <div
      ref={chatWindowRef}
      onScroll={() => {}}
      className="flex grow flex-col gap-5 overflow-y-auto rounded-lg bg-white p-4 shadow-sm"
    >
      {messages.map((message: TMessage) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  )
}

export default MessageContainer
