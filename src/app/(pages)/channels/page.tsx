"use client"

import PageTitle from "@/app/(components)/PageTitle"
import { Channel } from "@/app/(pages)/channels/Channel"
import { TChannel } from "@/app/types"
import { firestore } from "@/utils/firebase/firebase"
import useAuthCheck from "@/utils/hooks/useAuthCheck"
import {
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore"
import type { JSX } from "react"
import { useEffect, useState } from "react"

const ChannelPage = (): JSX.Element => {
  const [channels, setChannels] = useState<TChannel[]>([])

  const isAuthenticated = useAuthCheck()

  useEffect(() => {
    if (!isAuthenticated) return

    const unsubscribe = onSnapshot(
      collection(firestore, "channels"),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const channels = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as TChannel,
        )
        setChannels(channels)
      },
    )

    return () => unsubscribe()
  }, [isAuthenticated])

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col gap-4 p-4">
        <PageTitle title="Channels" />

        <div className="space-y-4">
          {channels.length > 0 ? (
            channels?.map((channel: TChannel) => (
              <Channel key={channel.id} channel={channel} />
            ))
          ) : (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/50 py-5 text-center text-slate-400">
              No channels available.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ChannelPage.displayName = "ChannelPage"

export default ChannelPage
