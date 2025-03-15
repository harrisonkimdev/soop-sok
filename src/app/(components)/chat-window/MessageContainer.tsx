"use client"

import ChatMessage from "@/app/(components)/chat-window/ChatMessage"
import { TMessage } from "@/app/types"
import useFirebaseHookMessages from "@/utils/hooks/fetchData/useFirebaseHookMessages"
import type { JSX } from "react"

const MessageContainer = (): JSX.Element => {
  const messages = useFirebaseHookMessages({})

  return (
    <div
      onScroll={() => {}}
      className="flex grow flex-col gap-5 overflow-y-auto rounded-lg bg-white p-4 shadow-sm"
    >
      {Array.isArray(messages) &&
        messages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
    </div>
  )
}

export default MessageContainer
