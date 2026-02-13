"use client"

import PageTitle from "@/app/(components)/PageTitle"
import { auth } from "@/utils/firebase/firebase"
import { updateUserStatus } from "@/utils/firebase/firestore"
import { signOut } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

const Settings = (): JSX.Element => {
  const router = useRouter()

  const handleSignout = async (): Promise<void> => {
    if (!auth?.currentUser) return

    try {
      const res = await updateUserStatus(auth.currentUser.uid, "signout")
      if (!res) {
        console.error("Session expired or update failed")
        return
      }
      await signOut(auth)
      router.push("/")
      return
    } catch (err) {
      console.error("Error during sign out:", err)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Settings" />

      <div className="flex flex-col gap-4">
        <Link
          href={`/profile/${auth.currentUser?.uid}`}
          className="group relative z-10 flex w-full items-center justify-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 transition-all hover:border-teal-500/50"
        >
          <p className="text-lg font-medium text-slate-300 transition-colors group-hover:text-teal-300">
            Profile
          </p>
        </Link>

        <button
          onClick={handleSignout}
          className="group relative z-10 flex w-full items-center justify-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 transition-all hover:border-red-500/50 hover:bg-red-500/20"
        >
          <p className="text-lg font-medium text-slate-300 transition-colors group-hover:text-red-400">
            Sign Out
          </p>
        </button>
      </div>
    </div>
  )
}

export default Settings
