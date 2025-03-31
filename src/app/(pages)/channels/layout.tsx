import React from "react"
import type { JSX } from "react"

type PublicChatLayoutProps = {
  children: React.ReactNode
}

const PublicChatLayout = ({ children }: PublicChatLayoutProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-700 p-4">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  )
}

PublicChatLayout.displayName = "PublicChatLayout"

export default PublicChatLayout
