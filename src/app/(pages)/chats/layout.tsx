import React from "react"
import type { JSX } from "react"

type ChatLayoutProps = {
  children: React.ReactNode
}

const ChatLayout = ({ children }: ChatLayoutProps): JSX.Element => {
  return <div className="h-full">{children}</div>
}

ChatLayout.displayName = "ChatLayout"

export default ChatLayout
