import React from "react"
import type { JSX } from "react"

type PublicChatLayoutProps = {
  children: React.ReactNode
}

const PublicChatLayout = ({ children }: PublicChatLayoutProps): JSX.Element => {
  return <div className="h-full">{children}</div>
}

PublicChatLayout.displayName = "PublicChatLayout"

export default PublicChatLayout
