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
    <>
      <PageTitle title="Channels" />
      <div className="flex h-full flex-col gap-3 overflow-y-auto">
        {channels.length > 0 ? (
          channels?.map((channel: TChannel) => (
            <Channel key={channel.id} channel={channel} />
          ))
        ) : (
          <p>No channels available.</p>
        )}
      </div>
    </>
  )
}

ChannelPage.displayName = "ChannelPage"

export default ChannelPage
