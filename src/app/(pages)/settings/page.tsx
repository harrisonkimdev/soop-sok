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
          className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 py-3 text-center text-base font-semibold text-slate-200 shadow transition duration-300 ease-in-out hover:border-slate-600 hover:bg-slate-700/80 hover:text-white"
        >
          Profile
        </Link>

        <button
          onClick={handleSignout}
          className="w-full rounded-lg border border-slate-700/50 bg-slate-800/60 py-3 text-base font-semibold text-slate-200 shadow transition duration-300 ease-in-out hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Settings
