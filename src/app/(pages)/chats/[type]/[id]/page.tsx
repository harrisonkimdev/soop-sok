"use client"

import Banner from "@/app/(components)/chat-window/Banner"
import MessageContainer from "@/app/(components)/chat-window/MessageContainer"
import MessageInput from "@/app/(components)/chat-window/MessageInput"
import IconInputContainer from "@/app/(pages)/chats/(components)/IconInputContainer"
import type { JSX } from "react"

interface ChatPageProps {
  params: {
    type: string
    id: string
  }
}

const ChatPage = ({ params }: ChatPageProps): JSX.Element => {
  return (
    <div className="grid h-full grid-rows-12">
      {/* Only channel or group chat shows the banner. */}
      {(params.type === "channel" || params.type === "group") && <Banner />}

      <div
        className={`flex h-full flex-col gap-4 ${
          params.type === "channel" || params.type === "group"
            ? "row-span-11 row-start-2"
            : "row-span-12 row-start-1"
        } `}
      >
        <MessageContainer />

        {/* features / leave and message input container */}
        <div className="flex justify-between gap-3">
          <IconInputContainer type={params.type} cid={params.id} />
          <MessageInput cid={params.id} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
