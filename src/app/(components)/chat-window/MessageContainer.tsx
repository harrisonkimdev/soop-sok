"use client"

import ChatMessage from "@/app/(components)/chat-window/ChatMessage"
import { TMessage } from "@/app/types"
import useFirebaseHookMessages from "@/utils/hooks/fetchData/useFirebaseHookMessages"
import type { JSX } from "react"

const MessageContainer = ({ cid }: { cid: string }): JSX.Element => {
  const messages = useFirebaseHookMessages(cid)

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
