"use client"

import PageTitle from "@/app/(components)/PageTitle"
import { Channel } from "@/app/(pages)/channels/Channel"
import { TChannel } from "@/app/types"
import useFirebaseHookChannels from "@/utils/hooks/fetchData/useFirebaseHookChannels"
import type { JSX } from "react"

const ChannelPage = (): JSX.Element => {
  const fetchedChannels = useFirebaseHookChannels()

  if (fetchedChannels) {
    return (
      <>
        <PageTitle title="Channels" />
        <div className="flex h-full flex-col gap-3 overflow-y-auto">
          {fetchedChannels.length > 0 ? (
            fetchedChannels.map((channel: TChannel) => (
              <Channel key={channel.id} channel={channel} />
            ))
          ) : (
            <p>No channels available.</p>
          )}
        </div>
      </>
    )
  } else {
    return <></>
  }
}

ChannelPage.displayName = "ChannelPage"

export default ChannelPage
