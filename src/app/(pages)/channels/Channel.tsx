import { TChannel } from "@/app/types"
import { auth } from "@/utils/firebase/firebase"
import { updateChannel } from "@/utils/firebase/firestore"
import useDialogs from "@/utils/global-states/dispatcher"
import useFirebaseHookChannel from "@/utils/hooks/fetchData/useFirebaseHookChannel"
import { useRouter } from "next/navigation"
import type { JSX } from "react"

interface ChannelProps {
  channel: TChannel
}

export const Channel = (props: ChannelProps): JSX.Element => {
  const router = useRouter()

  const { channelState, showMessageDialog } = useDialogs()

  const channelData: { isFull: boolean; numMembers: number } | null =
    useFirebaseHookChannel({ channelId: props.channel.id })

  const isFull =
    channelData && "isFull" in channelData ? channelData.isFull : false
  const numMembers =
    channelData && "numMembers" in channelData ? channelData.numMembers : 0

  /*
  // When users join a channel, add them to the 'members' subcollection of the
  // associated channel document and update the 'numMembers' field in the
  // channel document accordingly.
  */
  const handleEnterChannel = async (): Promise<void> => {
    const currentUser = auth.currentUser

    if (!currentUser || isFull) return

    try {
      // Update the channel document with the user's ID.
      const res = await updateChannel(
        props.channel.id,
        currentUser.uid,
        "enter",
      )

      if (res) {
        // Set the current channel state.
        channelState.set(props.channel.id)
        router.push(`/chats/channel/${props.channel.id}/`)
        return
      }
    } catch (err) {
      console.error(err)
      showMessageDialog(
        "data_retrieval",
        "채널 정보를 불러오는데 실패했습니다.",
      )
    }
  }

  return (
    <div
      onClick={handleEnterChannel}
      className={` ${!isFull ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md transition duration-300 ease-in-out hover:bg-gray-100`}
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {props.channel.name}
      </h3>
      <p className="text-sm text-gray-600">
        Capacity: {numMembers} / {props.channel.capacity}
      </p>
    </div>
  )
}

export default Channel
