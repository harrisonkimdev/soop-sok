import React from "react"
import type { JSX } from "react"

type ProfileLayoutProps = {
  children: React.ReactNode
}

const ProfileLayout = ({ children }: ProfileLayoutProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-700 p-4">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 shadow-2xl backdrop-blur-sm">
        <div className="flex flex-col gap-4 p-6">{children}</div>
      </div>
    </div>
  )
}

ProfileLayout.displayName = "ProfileLayout"

export default ProfileLayout
